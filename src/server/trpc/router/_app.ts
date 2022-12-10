import { router } from "../trpc"
import { authRouter } from "./auth"
import { gradeRouter } from "./grades"
import { subjectRouter } from "./subjects"

export const appRouter = router({
	grade: gradeRouter,
	auth: authRouter,
	subject: subjectRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
