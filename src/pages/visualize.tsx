import { type NextPage } from "next"
import { useSession } from "next-auth/react"
import Head from "next/head"
import { trpc } from "../utils/trpc"
import {
	ScatterChart,
	Scatter,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	Legend,
} from "recharts"
import { Button, Spin } from "antd"
import Link from "next/link"

const shuffle = (array: any[]) => {
	let currentIndex = array.length,
		randomIndex

	// While there remain elements to shuffle.
	while (currentIndex != 0) {
		// Pick a remaining element.
		randomIndex = Math.floor(Math.random() * currentIndex)
		currentIndex--

		// And swap it with the current element.
		;[array[currentIndex], array[randomIndex]] = [
			array[randomIndex],
			array[currentIndex],
		]
	}

	return array
}

const COLORS = shuffle([
	"red",
	"blue",
	"black",
	"green",
	"grey",
	"#181D31",
	"#251749",
	"#62B6B7",
	"#F2F7A1",
	"#FFFBE9",
	"#FFBF00",
	"#FB2576",
])

const Visualize: NextPage = () => {
	const session = useSession({ required: true })
	const { data: grades, isLoading } = trpc.grade.all.useQuery()
	const { data: subjects, isLoading: isSubjectsLoading } =
		trpc.subject.all.useQuery()

	if (isLoading || isSubjectsLoading) return <Spin></Spin>

	const firstGrade = grades?.[0]
	if (!firstGrade) return <Spin></Spin>
	const gradesAligned = grades?.map((grade) => ({
		...grade,
		gradedAt: new Date(
			grade.gradedAt.valueOf() - firstGrade.gradedAt.valueOf()
		),
	}))

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
					<h1>Scatter Chart: </h1>

					<ResponsiveContainer width={1000} height={500}>
						<ScatterChart width={800} height={400}>
							<YAxis type="number" dataKey="mark" name="Mark" />
							<XAxis
								type="number"
								dataKey="gradedAt"
								name="Grate Date"
							/>
							<Legend />
							<Tooltip cursor={{ strokeDasharray: "10 10" }} />
							{subjects?.map((subject, i) => {
								return (
									<Scatter
										key={subject.id}
										name={subject.name}
										data={gradesAligned
											.filter(
												(g) =>
													g.subject.id !== subject.id
											)
											?.map((grade) => ({
												mark: grade.mark,
												gradedAt:
													grade.gradedAt.valueOf(),
											}))}
										fill={COLORS[i]}
									/>
								)
							})}
						</ScatterChart>
					</ResponsiveContainer>
				</div>
			</main>
		</>
	)
}

export default Visualize
