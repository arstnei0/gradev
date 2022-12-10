import { Button, Spin } from "antd"
import { type NextPage } from "next"
import { useSession } from "next-auth/react"
import Head from "next/head"
import Link from "next/link"
import { Charts } from "../components/Charts"
import { trpc } from "../utils/trpc"

const Visualize: NextPage = () => {
	const session = useSession({ required: true })
	const { data: grades, isLoading } = trpc.grade.all.useQuery()
	const { data: subjects, isLoading: isSubjectsLoading } =
		trpc.subject.all.useQuery()

	if (isLoading || isSubjectsLoading || !grades || !subjects)
		return <Spin></Spin>

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
					<Link href="/">
						<Button type="primary">Go back to Home</Button>
					</Link>
					<br></br>

					<span>
						Share with others by this link:{" "}
						<strong style={{
							fontFamily: 'Roboto, sans-serif'
						}}>
							https://gradev.zihan.ga/share/
							{session.data?.user?.id}
						</strong>
					</span>

					<Charts grades={grades} subjects={subjects}></Charts>
				</div>
			</main>
		</>
	)
}

export default Visualize
