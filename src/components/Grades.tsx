import { DeleteOutlined } from "@ant-design/icons"
import { Button, Spin, Table } from "antd"
import type { FC } from "react"
import { useState } from "react"
import { trpc } from "../utils/trpc"
import { AddGrade } from "./AddGrade"

export let refetchGrades: any

export const Grades: FC = () => {
	const deleteGrade = trpc.grade.delete.useMutation()
	const [isModalOpen, setIsModalOpen] = useState(false)
	const {
		data: grades,
		isLoading,
		refetch: _refetchGrades,
	} = trpc.grade.all.useQuery()
	refetchGrades = _refetchGrades

	return (
		<>
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
				}}
			>
				<h2>Grades</h2>
				<Button onClick={() => setIsModalOpen(true)}>
					Add a new grade
				</Button>
			</div>
			{isLoading ? (
				<Spin></Spin>
			) : (
				<>
					<AddGrade
						open={isModalOpen}
						setOpen={setIsModalOpen}
						refetchGrades={refetchGrades}
					></AddGrade>
					<Table
						dataSource={grades?.map((grade) => ({
							...grade,
							subjectName: grade.subject.name,
							gradedAt: grade.gradedAt.toLocaleDateString(),
						}))}
						columns={[
							{
								key: "subjectName",
								dataIndex: "subjectName",
								title: "Subject",
							},
							{ key: "mark", dataIndex: "mark", title: "Mark" },
							{
								key: "gradedAt",
								dataIndex: "gradedAt",
								title: "Grade Date",
							},
							{
								key: "actions",
								dataIndex: "",
								title: "Actions",
								render: (_, record) => (
									<Button
										onClick={async () => {
											await deleteGrade.mutateAsync(
												record.id
											)
											refetchGrades()
										}}
										danger
										icon={<DeleteOutlined />}
									></Button>
								),
							},
						]}
					></Table>
				</>
			)}
		</>
	)
}
