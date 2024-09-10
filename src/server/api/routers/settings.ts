import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { env } from "@/env";
import { Resend } from "resend";
import { VerificationEmail } from "emails/VerificationEmail";
import { TRPCError } from "@trpc/server";

export const settingsRouter = createTRPCRouter({
  getExistingFormData: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
      select: {
        name: true,
        computingId: true,
      },
    });
    return user;
  }),
  updateFormData: protectedProcedure
    .input(
      z.object({
        name: z.string().optional(),
        computingId: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          name: input.name,
        },
      });
      console.log(user);
      console.log(input);
      if (
        user.computingId === (input.computingId ?? undefined) &&
        user.name === input.name
      )
        return {
          message: "No changes have been made.",
        };
      // if user submits empty or nulling computingId, just remove it (no effect if already null in db)
      if (!input.computingId) {
        await ctx.db.user.update({
          where: {
            id: ctx.session.user.id,
          },
          data: {
            computingId: null,
          },
        });
        return {
          message: "Your account details have been updated.",
        };
      }

      // only if computingId is nonempty and has changed
      // expire all other verification records for this user
      const now = Date.now();
      await ctx.db.computingIdVerification.updateMany({
        where: {
          userId: user.id,
          expires: {
            lte: new Date(now),
          },
        },
        data: {
          expires: new Date(now),
        },
      });
      //create new verification record
      const verificationRecord = await ctx.db.computingIdVerification.create({
        data: {
          user: {
            connect: {
              id: user.id,
            },
          },
          computingId: input.computingId,
          expires: new Date(now + 1000 * 60 * 60 * 24), // 24 hours
        },
      });

      // send verification email
      const resend = new Resend(env.RESEND_API_KEY);
      const baseHref =
        env.NODE_ENV === "production"
          ? "https://quorumed.com"
          : "http://localhost:3000";
      try {
        await resend.emails.send({
          from: "Quorum <noreply@quorumed.com>",
          to: [verificationRecord.computingId + "@virginia.edu"],
          subject: "Verify your Computing ID",
          react: VerificationEmail({
            verificationLink: `${baseHref}/verify/${verificationRecord.id}`,
          }),
        });
        return {
          message:
            "Account details have been updated. Please check your inbox for a verification email.",
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to send verification email.",
        });
      }
      // on verification, just expire verification record and update computingId on user after removing it from any existing verified users.
    }),
  deleteAccount: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.db.user.delete({
      where: {
        id: ctx.session.user.id,
      },
    });
    return {
      message: "Your account has been deleted.",
    };
  }),
  verifyComputingId: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // fetch verification record
      const verificationRecord = await ctx.db.computingIdVerification.findFirst(
        {
          where: {
            id: input.id,
          },
        },
      );

      // if somehow verification record doesn't exist, say so
      if (!verificationRecord) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Verification request not found.",
        });
      }

      // if verification record is expired, say so
      if (verificationRecord.expires < new Date(Date.now())) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Verification has expired.",
        });
      }

      // removing computing id from any existing users, since latest user is the last to verify it
      await ctx.db.user.updateMany({
        where: {
          computingId: verificationRecord.computingId,
        },
        data: {
          computingId: null,
        },
      });

      // now verified, so add computing id to user
      const userWithComputingId = await ctx.db.user.update({
        where: {
          id: verificationRecord.userId,
        },
        data: {
          computingId: verificationRecord.computingId,
        },
      });
      if (!userWithComputingId) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "User not found.",
        });
      }

      // expire verification record that we just used
      await ctx.db.computingIdVerification.update({
        where: {
          id: verificationRecord.id,
        },
        data: {
          expires: new Date(),
        },
      });
      return {
        message: "Your Computing ID has been verified.",
      };
    }),
  setComputingId: protectedProcedure
    .input(
      z.object({
        computingId: z.string().min(4, {
          message: "Computing ID must be at least 4 characters long",
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          computingId: input.computingId,
        },
      });
      return {
        message: "Your computing ID has been updated.",
      };
    }),
});
