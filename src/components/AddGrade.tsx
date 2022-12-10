import { DatePicker, InputNumber, Modal, Select } from "antd"
import type { FC } from "react"
import { useState } from "react"
import { trpc } from "../utils/trpc"
import dayjs from 'dayjs';

export const AddGrade: FC<{
	open: boolean
	setOpen: (open: boolean) => void
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	refetchGrades: any
	defaultSubject?: string
}> = ({ open, setOpen, refetchGrades, defaultSubject }) => {
	const [mark, setMark] = useState(0)
	const [subjectId, setSubjectId] = useState(defaultSubject || "")
	const [gradeDate, setGradeDate] = useState<string | null>(null)

	const addGrade = trpc.grade.add.useMutation()

	const { data: subjects, isLoading: isSubjectsLoading } =
		trpc.subject.all.useQuery()

	if (isSubjectsLoading) return <></>

	const handleOk = async () => {
		await addGrade.mutateAsync({
			mark,
			subjectId,
			...(gradeDate
				? {
						gradeAt: dayjs(gradeDate).toDate(),
				  }
				: {}),
		})
		refetchGrades?.()
		setOpen(false)
	}

	const handleCancel = () => {
		setOpen(false)
	}

	return (
		<>
			<Modal
				title="Add a new grade"
				open={open}
				onOk={handleOk}
				onCancel={handleCancel}
			>
				<div>
					Subject:{" "}
					<Select
						showSearch
						placeholder="Select a subject"
						optionFilterProp="children"
						onChange={(k) => setSubjectId(k)}
						filterOption={(input, option) =>
							(option?.label ?? "")
								.toLowerCase()
								.includes(input.toLowerCase())
						}
						options={subjects?.map((s) => ({
							value: s.id,
							label: s.name,
						}))}
						defaultValue={defaultSubject}
					/>
					<br></br>
					Mark:{" "}
					<InputNumber
						value={mark}
						onChange={(n) => n && setMark(n)}
						max={
							subjects?.find(
								(subject) => subject.id === subjectId
							)?.fullMark
						}
					></InputNumber>
					<br></br>
					Grade Date:{" "}
					<DatePicker
						onChange={(d, s) => {
							setGradeDate(s)
						}}
						defaultValue={dayjs()}
					/>
				</div>
			</Modal>
		</>
	)
}
