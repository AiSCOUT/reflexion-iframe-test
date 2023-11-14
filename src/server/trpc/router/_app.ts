import { router } from "../trpc";
import { reflexionRouter } from "./reflexion";

export const appRouter = router({
  reflexion: reflexionRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
