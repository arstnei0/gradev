import { Button, Spin } from "antd"
import { type NextPage } from "next"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { Charts } from "../../components/Charts"
import { trpc } from "../../utils/trpc"

const Share: NextPage = (props) => {
	const router = useRouter()
	if (!router.query.userId) return <></>
	const userId = router.query?.userId as string
	const { data: grades, isLoading } = trpc.grade.share.useQuery(userId)
	const { data: subjects, isLoading: isSubjectsLoading } =
		trpc.subject.share.useQuery(userId)
	const { data: user, isLoading: isUserLoading } = trpc.user.useQuery(userId)

	if (
		isLoading ||
		isSubjectsLoading ||
		isUserLoading ||
		!user ||
		!grades ||
		!subjects
	)
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
					<h1>{user.name}{"'"}s Grades</h1>

					<Charts grades={grades} subjects={subjects}></Charts>
				</div>
			</main>
		</>
	)
}

export default Share
