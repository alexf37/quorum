import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

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
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid or unauthorised user.",
        });
      }
      if (user.classes.map((c) => c.code).includes(classCode)) {
        // tell user they are already registered for this class
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Already registered for this class.",
        });
      }
      //shouldn't be using this as the primary to check if class exists,
      // but whatever i can change it later
      try {
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
      } catch (e) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Invalid class code: ${classCode}`,
        });
      }
    }),
  createClass: protectedProcedure
    .input(
      z.object({
        courseCode: z
          .string()
          .min(4, {
            message: "Course code must be at least 4 characters long",
          })
          .max(12, {
            message: "Course code must be at most 12 characters long",
          }),
        joinCode: z
          .string()
          .min(4, {
            message: "Join code must be at least 4 characters long",
          })
          .max(12, {
            message: "Join code must be at most 12 characters long",
          }),
        title: z
          .string()
          .min(4, {
            message: "Title must be at least 4 characters long",
          })
          .max(50, {
            message: "Title must be at most 50 characters long",
          }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const newClass = await ctx.db.class.create({
          data: {
            title: input.title,
            courseCode: input.courseCode,
            code: input.joinCode,
            ownerUserId: ctx.session.user.id,
          },
        });
        return newClass;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong.",
        });
      }
    }),
  getJoinedClasses: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const classes = await ctx.db.class.findMany({
      where: {
        students: {
          some: {
            id: userId,
          },
        },
      },
    });
    return classes;
  }),
  getOwnedClasses: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const classes = await ctx.db.class.findMany({
      where: {
        ownerUserId: userId,
      },
    });
    return classes;
  }),
  //this was entirely AI generated, so might have bugs
  leaveClass: protectedProcedure
    .input(z.object({ classId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const classId = input.classId;
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
      if (!user.classes.map((c) => c.id).includes(classId)) {
        // tell user they are not registered for this class
        return user;
      }
      const updatedUser = await ctx.db.user.update({
        where: {
          id: userId,
        },
        data: {
          classes: {
            disconnect: {
              id: classId,
            },
          },
        },
      });
      return updatedUser;
    }),
  // potentially dangerous, need to take care of cascades
  deleteClass: protectedProcedure
    .input(z.object({ classId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const deletedClass = await ctx.db.class.delete({
          where: {
            id: input.classId,
          },
        });
        return deletedClass;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong.",
        });
      }
    }),
  getClassById: protectedProcedure
    .input(z.object({ classId: z.string() }))
    .query(async ({ ctx, input }) => {
      const classObj = await ctx.db.class.findUnique({
        where: {
          id: input.classId,
        },
      });
      return {
        id: classObj?.id,
        title: classObj?.title,
        courseCode: classObj?.courseCode,
        code: classObj?.code,
      };
    }),
});
