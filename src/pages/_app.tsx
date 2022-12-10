import { type AppType } from "next/app"
import { type Session } from "next-auth"
import { SessionProvider, useSession } from "next-auth/react"

import { trpc } from "../utils/trpc"

import "../styles/globals.css"
import { Menu } from "../components/Menu"

const MyApp: AppType<{ session: Session | null }> = ({
	Component,
	pageProps: { session, ...pageProps },
}) => {
	return (
		<SessionProvider session={session}>
			<Menu></Menu>
			<Component {...pageProps} />
		</SessionProvider>
	)
}

export default trpc.withTRPC(MyApp)
