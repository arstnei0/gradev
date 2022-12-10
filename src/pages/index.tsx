import { type NextPage } from "next"
import Head from "next/head"
import Link from "next/link"
import { signOut, useSession } from "next-auth/react"

import { Subjects } from "../components/Subjects"
import { Grades } from "../components/Grades"
import { Button } from "antd"

const Home: NextPage = () => {
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
					</Link><br></br>
					<Button onClick={() => signOut()}>Logout</Button>
					<Subjects></Subjects>
					<Grades></Grades>
				</div>
			</main>
		</>
	)
}

export default Home
