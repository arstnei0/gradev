import { router } from "../trpc"
import { gradeRouter } from "./grades"
import { subjectRouter } from "./subjects"

export const appRouter = router({
	grade: gradeRouter,
	subject: subjectRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
