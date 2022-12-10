import { Spin } from "antd"
import { FC } from "react"
import {
	Legend,
	ResponsiveContainer,
	Scatter,
	ScatterChart,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts"

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

export const Charts: FC<{
	subjects: any[]
	grades: any[]
}> = ({ subjects, grades }) => {
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
			<h1>Scatter Chart: </h1>
			<ResponsiveContainer width={1000} height={500}>
				<ScatterChart width={800} height={400}>
					<YAxis type="number" dataKey="mark" name="Mark" />
					<XAxis type="number" dataKey="gradedAt" name="Grate Date" />
					<Legend />
					<Tooltip cursor={{ strokeDasharray: "10 10" }} />
					{subjects?.map((subject, i) => {
						return (
							<Scatter
								key={subject.id}
								name={subject.name}
								data={gradesAligned
									.filter((g) => g.subject.id !== subject.id)
									?.map((grade) => ({
										mark: grade.mark,
										gradedAt: grade.gradedAt.valueOf(),
									}))}
								fill={COLORS[i]}
							/>
						)
					})}
				</ScatterChart>
			</ResponsiveContainer>
		</>
	)
}
