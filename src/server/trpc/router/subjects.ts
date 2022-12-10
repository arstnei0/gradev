import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { protectedProcedure, publicProcedure, router, sharedProcedure } from "../trpc"
import { prisma } from "../../db/client"

export const subjectRouter = router({
	all: protectedProcedure.query(async ({ ctx }) => {
		return prisma?.subject.findMany({
			where: {
				userId: ctx.session.user.id,
			},
		})
	}),
	share: sharedProcedure.query(async ({ ctx, input }) => {
		return prisma?.subject.findMany({
			where: {
				userId: input,
			},
		})
	}),
	create: protectedProcedure
		.input(
			z.object({
				name: z.string(),
				fullMark: z.number().default(8),
			})
		)
		.mutation(async ({ ctx, input }) => {
			return prisma?.subject.create({
				data: {
					userId: ctx.session.user.id,
					name: input.name,
					fullMark: input.fullMark,
				},
			})
		}),
	delete: protectedProcedure
		.input(z.string())
		.mutation(async ({ ctx, input }) => {
			const subject = await prisma?.subject.findUnique({
				where: {
					id: input,
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

			return prisma?.subject.delete({
				where: {
					id: input,
				},
			})
		}),
})
