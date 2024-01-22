import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const classesRouter = createTRPCRouter({
  registerForClassByCode: protectedProcedure
    .input(
      z.object({
        classCode: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const classCode = input.classCode;
      const userId = ctx.session.user.id;
      // maybe do operation on class instead, but for now just do it on user
      const user = await ctx.db.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          classes: true,
        },
      });
      if (!user) {
        //handle auth error
        return null;
      }
      if (user.classes.map((c) => c.code).includes(classCode)) {
        // tell user they are already registered for this class
        return user;
      }
      const updatedUser = await ctx.db.user.update({
        where: {
          id: userId,
        },
        data: {
          classes: {
            connect: {
              code: classCode,
            },
          },
        },
      });
      return updatedUser;
    }),
});
