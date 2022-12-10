import { z } from "zod"
import {
	protectedProcedure,
	publicProcedure,
	router,
	sharedProcedure,
} from "../trpc"
import { gradeRouter } from "./grades"
import { subjectRouter } from "./subjects"
import { prisma } from "../../db/client"

export const appRouter = router({
	grade: gradeRouter,
	subject: subjectRouter,
	user: sharedProcedure.query(async ({ ctx, input }) => {
		return prisma.user.findUnique({
			where: {
				id: input,
			},
			select: {
				name: true,
			},
		})
	}),
	editUserPublicity: protectedProcedure
		.input(z.boolean())
		.mutation(async ({ ctx, input }) => {
			console.log(
				await prisma.user.update({
					where: {
						id: ctx.session.user.id,
					},
					data: {
						public: input,
					},
				})
			)
			return prisma.user.update({
				where: {
					id: ctx.session.user.id,
				},
				data: {
					public: input,
				},
			})
		}),
})

// export type definition of API
export type AppRouter = typeof appRouter
