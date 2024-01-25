import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { observable } from "@trpc/server/observable";

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),
  randomNumber: publicProcedure.subscription(() => {
    console.log("subscribed");
    return observable<number>((emit) => {
      const int = setInterval(() => {
        emit.next(Math.random());
      }, 500);
      return () => {
        clearInterval(int);
      };
    });
  }),
});
