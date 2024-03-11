import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { db } from "@/server/db";
import { analyzeAnswers } from "../analyze-answers";

async function checkSessionExists(sessionId: string) {
  const session = await db.classSession.findUnique({
    where: {
      id: sessionId,
    },
  });
  if (!session) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "No such session exists.",
    });
  }
  return session;
}
async function checkSessionMembership(sessionId: string, userId: string) {
  const session = await db.classSession.findUnique({
    where: {
      id: sessionId,
    },
    select: {
      hostUserId: true,
      students: {
        where: {
          id: userId,
        },
      },
    },
  });
  if (!session) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "No such session exists.",
    });
  }
  if (session.hostUserId !== userId && session.students.length === 0) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "You are not a member of this session.",
    });
  }
}
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

async function checkClassMembership(classId: string, userId: string) {
  const clazz = await db.class.findUnique({
    where: {
      id: classId,
    },
    select: {
      ownerUserId: true,
      students: {
        where: {
          id: userId,
        },
      },
    },
  });
  if (!clazz) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "No such class exists.",
    });
  }
  if (clazz.ownerUserId !== userId && clazz.students.length === 0) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "You are not a member of this class.",
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

async function checkSessionOngoing(sessionId: string) {
  const session = await db.classSession.findUnique({
    where: {
      id: sessionId,
    },
    select: {
      status: true,
    },
  });
  if (session?.status !== "ONGOING") {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "The session is not ongoing.",
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
        orderBy: {
          index: "asc",
        },
      });
      return freeResponseQuestions;
    }),
  addFreeResponseQuestion: protectedProcedure
    .input(
      z.object({
        sessionId: z.string(),
        prompt: z.string(),
        isLatex: z.boolean(),
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
          isLatex: input.isLatex,
          classSessionId: input.sessionId,
          index: (existingFreeResponseQuestions[0]?.index ?? 0) + 1,
        },
      });
      return freeResponseQuestion;
    }),
  editFreeResponseQuestion: protectedProcedure
    .input(
      z.object({
        questionId: z.string(),
        sessionId: z.string(),
        prompt: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await checkSessionOwnership(input.sessionId, ctx.session.user.id);
      const question = await ctx.db.freeResponseQuestion.update({
        where: {
          id: input.questionId,
        },
        data: {
          question: input.prompt,
        },
      });
      return question;
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
  getCurrentFreeResponseQuestion: protectedProcedure
    .input(
      z.object({
        sessionId: z.string(),
        includeAnswer: z.boolean().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      await checkSessionMembership(input.sessionId, ctx.session.user.id);
      await checkSessionOngoing(input.sessionId);
      const sessionWithCurrentQuestion = await ctx.db.classSession.findUnique({
        where: {
          id: input.sessionId,
        },
        select: {
          currentQuestion: {
            include: {
              answers: input.includeAnswer && {
                where: {
                  userId: ctx.session.user.id,
                },
              },
            },
          },
        },
      });
      return sessionWithCurrentQuestion?.currentQuestion ?? null;
    }),
  getSessionInfo: protectedProcedure
    .input(
      z.object({
        sessionId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const session = await ctx.db.classSession.findUnique({
        where: {
          id: input.sessionId,
        },
      });
      return session;
    }),
  setCurrentFreeResponseQuestion: protectedProcedure
    .input(
      z.object({
        sessionId: z.string(),
        questionId: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await checkSessionOwnership(input.sessionId, ctx.session.user.id);
      await checkSessionOngoing(input.sessionId);
      const session = await ctx.db.classSession.update({
        where: {
          id: input.sessionId,
        },
        data: {
          currentQuestionId: input.questionId ?? null,
        },
      });
      return session;
    }),
  startSession: protectedProcedure
    .input(
      z.object({
        sessionId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await checkSessionOwnership(input.sessionId, ctx.session.user.id);
      const session = await ctx.db.classSession.update({
        where: {
          id: input.sessionId,
        },
        data: {
          status: "ONGOING",
        },
      });
      await ctx.db.classSession.updateMany({
        where: {
          classId: session.classId,
          status: "ONGOING",
          id: {
            not: input.sessionId,
          },
        },
        data: {
          status: "CLOSED",
        },
      });
      return session;
    }),
  joinSessionAsStudent: protectedProcedure
    .input(
      z.object({
        sessionId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const sessionThatExists = await checkSessionExists(input.sessionId);
      await checkClassMembership(
        sessionThatExists.classId,
        ctx.session.user.id,
      );
      await checkSessionOngoing(input.sessionId);
      const updatedSession = await ctx.db.classSession.update({
        where: {
          id: input.sessionId,
        },
        data: {
          students: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
      });
      return updatedSession;
    }),
  submitFreeResponseAnswer: protectedProcedure
    .input(
      z.object({
        sessionId: z.string(),
        questionId: z.string(),
        answer: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await checkSessionOngoing(input.sessionId);
      await checkSessionMembership(input.sessionId, ctx.session.user.id);
      const answer = await ctx.db.freeResponseAnswer.upsert({
        where: {
          freeResponseQuestionId_userId: {
            freeResponseQuestionId: input.questionId,
            userId: ctx.session.user.id,
          },
        },
        update: {
          answer: input.answer,
          createdAt: new Date(),
        },
        create: {
          answer: input.answer,
          createdAt: new Date(),
          freeResponseQuestionId: input.questionId,
          userId: ctx.session.user.id,
        },
      });
      return answer;
    }),
  getCurrentAnswerCount: protectedProcedure
    .input(
      z.object({
        sessionId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      await checkSessionExists(input.sessionId);
      await checkSessionOwnership(input.sessionId, ctx.session.user.id);
      const answerCount = await ctx.db.freeResponseAnswer.count({
        where: {
          freeResponseQuestion: {
            currentInClassSession: {
              currentQuestion: {
                classSessionId: input.sessionId,
              },
            },
          },
        },
      });
      return answerCount;
    }),
  getCurrentStudentCount: protectedProcedure
    .input(
      z.object({
        sessionId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      await checkSessionExists(input.sessionId);
      await checkSessionOwnership(input.sessionId, ctx.session.user.id);
      const studentCount = await ctx.db.user.count({
        where: {
          classSessions: {
            some: {
              id: input.sessionId,
            },
          },
        },
      });
      return studentCount;
    }),
  deleteFreeResponseQuestion: protectedProcedure
    .input(
      z.object({
        questionId: z.string(),
        sessionId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await checkSessionOwnership(input.sessionId, ctx.session.user.id);
      const question = await ctx.db.freeResponseQuestion.delete({
        where: {
          id: input.questionId,
        },
      });
      return question;
    }),
  getStudentAnswersForCurrentQuestion: protectedProcedure
    .input(
      z.object({
        sessionId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      await checkSessionOwnership(input.sessionId, ctx.session.user.id);
      const answers = await ctx.db.freeResponseAnswer.findMany({
        where: {
          freeResponseQuestion: {
            currentInClassSession: {
              currentQuestion: {
                classSessionId: input.sessionId,
              },
            },
          },
        },
      });
      return answers;
    }),
  endSession: protectedProcedure
    .input(
      z.object({
        sessionId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await checkSessionOwnership(input.sessionId, ctx.session.user.id);
      const session = await ctx.db.classSession.update({
        where: {
          id: input.sessionId,
        },
        data: {
          status: "CLOSED",
        },
      });
      return session;
    }),
  analyzeAnswers: protectedProcedure
    .input(
      z.object({
        sessionId: z.string(),
        question: z.string(),
        answers: z.array(z.string()),
      }),
    )
    .query(async ({ ctx, input }) => {
      await checkSessionOwnership(input.sessionId, ctx.session.user.id);
      return analyzeAnswers(input.question, input.answers);
    }),
});
