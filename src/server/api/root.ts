import { exampleRouter } from "@/server/api/routers/example";
import { createTRPCRouter } from "@/server/api/trpc";
import { settingsRouter } from "./routers/settings";
import { classesRouter } from "./routers/classes";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  settings: settingsRouter,
  classes: classesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
