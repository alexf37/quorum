import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { env } from "@/env";
import { Resend } from "resend";
import { VerificationEmail } from "@/emails/VerificationEmail";

export const settingsRouter = createTRPCRouter({
  getExistingFormData: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
      select: {
        displayName: true,
        computingId: true,
      },
    });
    return user;
  }),
  updateFormData: protectedProcedure
    .input(
      z.object({
        displayName: z.string().optional(),
        computingId: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          displayName: input.displayName,
        },
      });
      if (user.computingId === input.computingId) return user;
      if (!input.computingId) return user;

      // only if computingId is nonempty and has changed
      const now = Date.now();
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
      // expire all other verification records for this user
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
        return verificationRecord;
      } catch (error) {
        return error;
      }
      // on verification, just expire verification record and update computingId on user after removing it from any existing verified users.
    }),
});
