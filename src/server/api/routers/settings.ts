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
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        user.computingId == (input.computingId || undefined) &&
        user.name == input.name
      )
        return {
          message: "No changes have been made.",
        };
      // if user submits empty or nulling computingId, just remove it (no effect if already null in db)
      if (!input.computingId) {
        const userWithoutComputingId = await ctx.db.user.update({
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
      const expiredRecords = await ctx.db.computingIdVerification.updateMany({
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
          ? "https://quorum.alexfoster.dev"
          : "http://localhost:3000";
      try {
        const data = await resend.emails.send({
          from: "Quorum <noreply@quorum.alexfoster.dev>",
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
});
