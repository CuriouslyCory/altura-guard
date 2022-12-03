import { router } from "../trpc";
import { alturaRouter } from "./altura";
import { exampleRouter } from "./example";

export const appRouter = router({
  altura: alturaRouter,
  example: exampleRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
