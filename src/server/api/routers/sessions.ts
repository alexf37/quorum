import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { db } from "@/server/db";

async function checkClassOwnership(classId: string, userId: string) {
  const clazz = await db.class.findUnique({
    where: {
      id: classId,
    },
    select: {
      ownerUserId: true,
    },
  });
  if (!clazz) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "No such class exists.",
    });
  }
  if (clazz.ownerUserId !== userId) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "You are not the owner of this class.",
    });
  }
}

async function checkSessionOwnership(sessionId: string, userId: string) {
  const session = await db.classSession.findUnique({
    where: {
      id: sessionId,
    },
    select: {
      hostUserId: true,
    },
  });
  if (!session) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "No such session exists.",
    });
  }
  if (session.hostUserId !== userId) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "You are not the owner of this session.",
    });
  }
}

export const sessionsRouter = createTRPCRouter({
  createSession: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        classId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await checkClassOwnership(input.classId, ctx.session.user.id);
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
      await checkSessionOwnership(input.sessionId, ctx.session.user.id);
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
      await checkSessionOwnership(input.sessionId, ctx.session.user.id);
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
      await checkSessionOwnership(input.sessionId, ctx.session.user.id);
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
  editSession: protectedProcedure
    .input(
      z.object({
        sessionId: z.string(),
        title: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await checkSessionOwnership(input.sessionId, ctx.session.user.id);
      const session = await ctx.db.classSession.update({
        where: {
          id: input.sessionId,
        },
        data: {
          title: input.title,
        },
      });
      return session;
    }),
});
