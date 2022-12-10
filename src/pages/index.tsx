import { type NextPage } from "next"
import Head from "next/head"
import Link from "next/link"
import { signOut, useSession } from "next-auth/react"

import { Subjects } from "../components/Subjects"
import { Grades } from "../components/Grades"
import { Button, Switch } from "antd"
import { trpc } from "../utils/trpc"

const Home: NextPage = () => {
	const editUserPublicity = trpc.editUserPublicity.useMutation()
	const session = useSession({ required: true })

	return (
		<>
			<Head>
				<title>Visualize your grades!</title>
			</Head>

			<main
				style={{
					display: "flex",
					justifyContent: "center",
				}}
			>
				<div
					style={{
						minWidth: "700px",
						textAlign: "center",
					}}
				>
					<Link href="/visualize">
						<Button type="primary">Visualize my grades</Button>
					</Link>
					<br></br>
					Allow sharing: <Switch onChange={(v) => {
						editUserPublicity.mutate(v)
					}}></Switch>
					<br></br>
					<Button onClick={() => signOut()}>Logout</Button>
					<Subjects></Subjects>
					<Grades></Grades>
				</div>
			</main>
		</>
	)
}

export default Home
