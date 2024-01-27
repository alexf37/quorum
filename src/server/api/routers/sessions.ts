import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const sessionsRouter = createTRPCRouter({
  createSession: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        classId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const classSession = await ctx.db.classSession.create({
        data: {
          title: input.title,
          createdAt: new Date(),
          hostUserId: ctx.session.user.id,
          classId: input.classId,
        },
      });
      return classSession;
    }),
  getSessionsByClassId: protectedProcedure
    .input(
      z.object({
        classId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const sessions = await ctx.db.classSession.findMany({
        where: {
          classId: input.classId,
        },
      });
      return sessions;
    }),
  deleteSession: protectedProcedure
    .input(
      z.object({
        sessionId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const session = await ctx.db.classSession.delete({
        where: {
          id: input.sessionId,
        },
      });
      return session;
    }),
  getFreeResponseQuestionsBySessionId: protectedProcedure
    .input(
      z.object({
        sessionId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const freeResponseQuestions = await ctx.db.freeResponseQuestion.findMany({
        where: {
          classSessionId: input.sessionId,
        },
      });
      return freeResponseQuestions;
    }),
  addFreeResponseQuestion: protectedProcedure
    .input(
      z.object({
        sessionId: z.string(),
        prompt: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const existingFreeResponseQuestions =
        await ctx.db.freeResponseQuestion.findMany({
          where: {
            classSessionId: input.sessionId,
          },
          orderBy: {
            index: "desc",
          },
        });
      const freeResponseQuestion = await ctx.db.freeResponseQuestion.create({
        data: {
          question: input.prompt,
          classSessionId: input.sessionId,
          index: (existingFreeResponseQuestions[0]?.index ?? 0) + 1,
        },
      });
      return freeResponseQuestion;
    }),
});
