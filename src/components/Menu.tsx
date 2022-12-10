import { useSession } from "next-auth/react"

export const Menu: React.FC = (props) => {
	const session = useSession()
	return (
		<div
			style={{
				display: "flex",
				justifyContent: "center",
			}}
		>
			{session.status === "authenticated" ? (
				<>
					<div>
						<h1>Hi, {session.data.user?.name}!</h1>
					</div>
				</>
			) : undefined}
		</div>
	)
}
