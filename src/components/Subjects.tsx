import { FC, useRef } from "react"
import { useState } from "react"
import { trpc } from "../utils/trpc"
import {
	Button,
	Input,
	InputNumber,
	InputRef,
	Modal,
	Popconfirm,
	Spin,
	Table,
} from "antd"
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons"
import { AddGrade } from "./AddGrade"
import { refetchGrades } from "./Grades"

const SubjectActions: FC<{
	deleteSubject: any
	subject: any
	refetchSubjects: any
	refetchGrades: any
}> = ({ deleteSubject, subject, refetchSubjects, refetchGrades }) => {
	const [open, setOpen] = useState(false)
	const [showDelete, setShowDelete] = useState(false)

	const confirm = async () => {
		await deleteSubject.mutateAsync(subject.id)
		refetchSubjects()
		setShowDelete(false)
	}

	const cancel = () => {
		setShowDelete(false)
	}

	return (
		<>
			<Button
				color="primary"
				icon={<PlusOutlined />}
				onClick={async () => {
					setOpen(true)
				}}
			></Button>
			<AddGrade
				open={open}
				setOpen={setOpen}
				defaultSubject={subject.id}
				refetchGrades={refetchGrades}
			></AddGrade>
			<Popconfirm
				title="Are you sure to delete this subject?"
				onConfirm={() => confirm()}
				onCancel={() => cancel()}
				okText="Yes"
				cancelText="No"
			>
				<Button
					danger
					onClick={() => setShowDelete(true)}
					icon={<DeleteOutlined />}
				></Button>
			</Popconfirm>
		</>
	)
}

export const Subjects: FC = () => {
	const deleteSubject = trpc.subject.delete.useMutation()
	const createSubject = trpc.subject.create.useMutation()
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [newSubjectName, setNewSubjectName] = useState("")
	const [newSubjectFullMark, setNewSubjectFullMark] = useState(8)
	
	const {
		data: subjects,
		isLoading,
		refetch: refetchSubjects,
	} = trpc.subject.all.useQuery()

	const showModal = () => {
		setIsModalOpen(true)
	}

	const handleOk = async () => {
		await createSubject.mutateAsync({
			fullMark: newSubjectFullMark,
			name: newSubjectName,
		})
		refetchSubjects()
		setIsModalOpen(false)
	}

	const handleCancel = () => {
		setIsModalOpen(false)
	}

	return (
		<>
			<div>
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
					}}
				>
					<h2>Subjects</h2>
					<Button onClick={showModal}>Create a new subject</Button>
				</div>

				{isLoading ? (
					<Spin></Spin>
				) : (
					<>
						<Modal
							title="Create a new subject"
							open={isModalOpen}
							onOk={handleOk}
							onCancel={handleCancel}
						>
							Name:{" "}
							<Input
								value={newSubjectName}
								placeholder="Subject Name"
								onChange={(e) =>
									setNewSubjectName(e.target.value)
								}
							></Input>
							Full mark:{" "}
							<InputNumber
								value={newSubjectFullMark}
								min={0}
								defaultValue={8}
								onChange={(n) => n && setNewSubjectFullMark(n)}
							></InputNumber>
						</Modal>

						<Table
							size="large"
							dataSource={subjects}
							columns={[
								{
									key: "name",
									dataIndex: "name",
									title: "Name",
								},
								{
									key: "fullMark",
									dataIndex: "fullMark",
									title: "Full mark",
								},
								{
									title: "Actions",
									dataIndex: "",
									key: "x",
									render: (_, record) => (
										<SubjectActions
											deleteSubject={deleteSubject}
											subject={record}
											refetchSubjects={refetchSubjects}
											refetchGrades={refetchGrades}
										></SubjectActions>
									),
								},
							]}
						/>
					</>
				)}
			</div>
		</>
	)
}