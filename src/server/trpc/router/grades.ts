import { TRPCError } from "@trpc/server"
import { z } from "zod"

import { router, protectedProcedure } from "../trpc"

export const gradeRouter = router({
	all: protectedProcedure.query(async ({ ctx }) => {
		return prisma?.grade.findMany({
			where: {
				subject: {
					userId: ctx.session.user.id,
				},
			},
			select: {
				subject: true,
				mark: true,
				id: true,
				gradedAt: true,
			},
			orderBy: {
				gradedAt: "asc",
			},
		})
	}),
	add: protectedProcedure
		.input(
			z.object({
				subjectId: z.string(),
				mark: z.number().default(0),
				gradeAt: z.date().optional(),
			})
		)
		.mutation(async ({ input, ctx }) => {
			const subject = await prisma?.subject.findUnique({
				where: {
					id: input.subjectId,
				},
				select: {
					userId: true,
				},
			})

			if (ctx.session.user.id !== subject?.userId) {
				throw new TRPCError({
					code: "FORBIDDEN",
				})
			}

			return prisma?.grade.create({
				data: {
					subjectId: input.subjectId,
					mark: input.mark,
					...(input.gradeAt
						? {
								gradedAt: input.gradeAt,
						  }
						: {}),
				},
			})
		}),
	delete: protectedProcedure
		.input(z.string())
		.mutation(async ({ input, ctx }) => {
			const grade = await prisma?.grade.findUnique({
				where: {
					id: input,
				},
				select: {
					subjectId: true,
				},
			})

			const subject = await prisma?.subject.findUnique({
				where: {
					id: grade?.subjectId,
				},
				select: {
					userId: true,
				},
			})

			if (ctx.session.user.id !== subject?.userId) {
				throw new TRPCError({
					code: "FORBIDDEN",
				})
			}

			return prisma?.grade.delete({
				where: {
					id: input,
				},
			})
		}),
})
