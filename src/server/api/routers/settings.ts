import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";

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
          computingId: input.computingId,
        },
      });
      return user;
    }),
});
