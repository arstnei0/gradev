import { initTRPC, TRPCError } from "@trpc/server"
import next from "next"
import superjson from "superjson"
import { z } from "zod"
import { prisma } from "../db/client"

import { type Context } from "./context"

const t = initTRPC.context<Context>().create({
	transformer: superjson,
	errorFormatter({ shape }) {
		return shape
	},
})

export const router = t.router

/**
 * Unprotected procedure
 **/
export const publicProcedure = t.procedure

/**
 * Reusable middleware to ensure
 * users are logged in
 */
const isAuthed = t.middleware(({ ctx, next }) => {
	if (!ctx.session || !ctx.session.user) {
		throw new TRPCError({ code: "UNAUTHORIZED" })
	}
	return next({
		ctx: {
			// infers the `session` as non-nullable
			session: { ...ctx.session, user: ctx.session.user },
		},
	})
})

/**
 * Protected procedure
 **/
export const protectedProcedure = t.procedure.use(isAuthed)

export const sharedProcedure = t.procedure.input(z.string()).use(
	t.middleware(async ({ ctx, next, input }) => {
		if (!input) throw new TRPCError({ code: "BAD_REQUEST" })
		const user = await prisma.user.findUnique({
			where: {
				id: input as string,
			},
			select: {
				public: true,
			},
		})

		if (!user?.public) throw new TRPCError({ code: "NOT_FOUND" })
		
		return next()
	})
)
