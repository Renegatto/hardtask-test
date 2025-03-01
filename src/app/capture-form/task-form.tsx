import { FC, useEffect } from "react";
import { Task } from "./endpoint-data";
import { Button, Checkbox, Flex, Form, Input, InputNumber } from "antd";
import { z } from "zod";
import { TaskTags } from "./tags";

export type TaskFormProps = {
  onSubmit: (submitted: Task) => void,
}
const UUID_PLACEHOLDER = "317ad1fc-e0a9-11ef-a978-0242ac120007"

export const TaskForm: FC<TaskFormProps> = ({onSubmit}) => {
  const [form] = Form.useForm()
  useEffect(() => {
    form.setFieldValue('tags',[])
  },[])
  const minBudget = Form.useWatch<number | undefined>(formFields.budgetFrom, form);
  console.log(minBudget)
  const handleSubmit = (o: unknown): void => {
    const task = formToTask(formSchema.parse(o))
    console.log(task)
    onSubmit(task)
  }
  return <Form form={form} onFinish={handleSubmit}>
    <Form.Item
      name={formFields.token}
      label="Token"
      tooltip="UUID v4 token of the task"
      rules={[{required: true, message: 'Please specify task ID'}]}
    >
      <Input
        placeholder={UUID_PLACEHOLDER}
        style={{width: `${UUID_PLACEHOLDER.length}ch`}}
      />
    </Form.Item>
    <Form.Item
      name={formFields.title}
      label="Title"
      tooltip="Hardtask title"
      rules={[{required: true, message: 'Please specify the task title'}]}
    >
      <Input
        placeholder='A title'
      />
    </Form.Item>
    <Form.Item
      name={formFields.description}
      label="Description"
      tooltip="Detailed description of the task."
      rules={[{required: true, message: 'Please specify the task description'}]}
    >
      <Input
        placeholder='A hardtask description.'
      />
    </Form.Item>
    <Form.Item
      name={formFields.tags}
    >
      <TaskTags
        setValues={tags =>
          form.setFieldValue(formFields.tags,tags)
        }
      />
    </Form.Item>
    <Flex>
      <Form.Item
        name={formFields.budgetFrom}
        rules={[{required: true, message: 'Please specify the minimal budget'}]}
      >
        <InputNumber
          addonBefore={<div style={{width: `3ch`}}>from</div>}
          style={{gridArea: 'from'}}
          min={0}
          step={1000}
          addonAfter="₽"
          placeholder='5000'
        />
      </Form.Item>
      <Form.Item
        name={formFields.budgetTo}
        rules={[{
          required: true,
          message: 'Please specify the maximal budget',
        }, {
          min: minBudget || 0,
          type: 'number',
          message: 'Max budget can not be less than min budget'
        }]}
      >
        <InputNumber
          addonBefore={<div style={{width: `3ch`}}>to</div>}
          style={{gridArea: 'to'}}
          step={1000} // maybe sync values with 'from' so it is never less
          addonAfter="₽"
          min={0}
          placeholder='50000'
        />
      </Form.Item>
    </Flex>
    <Form.Item
      name={formFields.deadlineDays}
      label='Deadline'
      tooltip='Deadline in days.'
      rules={[{required: true, message: 'Please specify the task deadline'}]}
    >
      <InputNumber min={1} placeholder='3' addonAfter={<>days</>} />
    </Form.Item>
    <Form.Item
      name={formFields.reminds}
      label='Reminds'
      initialValue={3}
      tooltip='How many times to remind the applicant about the deadline.'
    >
      <InputNumber min={0}  addonAfter='times' />
    </Form.Item>
    <Form.Item
      name={formFields.allAutoResponses}
      label='Auto-response'
      tooltip='Whether to automatically response to freelancers or not.'
    >
      <Checkbox checked={false}>Automatically respond to freelancers</Checkbox>
    </Form.Item>
    <Form.Item
      name={formFields.freelancers}
      label='Workload'
      initialValue={1}
      tooltip='How many freelancers needed to get the work done.'
    >
      <InputNumber min={1} addonAfter='freelancers required' />
    </Form.Item>
    <Form.Item label={null}>
      <Button type="primary" htmlType="submit">
        Publish task
      </Button>
    </Form.Item>
  </Form>
}

const formSchema = z.object({
  token: z.string().uuid(), //uuid
  title: z.string(),
  description: z.string(),
  tags: z.array(z.string()),
  budgetFrom: z.number().nonnegative(),
  budgetTo: z.number().nonnegative(),
  deadlineDays: z.number().positive(),
  reminds: z.number().nonnegative(),
  allAutoResponses: z.boolean().optional(),
  freelancers: z.number().positive(),
})
type SubmittedForm = z.infer<typeof formSchema>
const formFields: { [key in keyof Required<SubmittedForm>]: key } = ({
  token: "token",
  title: "title",
  description: "description",
  tags: "tags",
  budgetFrom: "budgetFrom",
  budgetTo: "budgetTo",
  deadlineDays: "deadlineDays",
  reminds: "reminds",
  allAutoResponses: "allAutoResponses",
  freelancers: "freelancers",
})

const formToTask = (submitted: SubmittedForm): Task => ({
  ...submitted,
  budget_from: submitted.budgetFrom,
  budget_to: submitted.budgetTo,
  deadline: submitted.deadlineDays,
  rules: {
      budget_from: submitted.budgetFrom,
      budget_to: submitted.budgetTo,
      qty_freelancers: submitted.freelancers,
      deadline_days: submitted.deadlineDays,
  },
  reminds: submitted.reminds,
  all_auto_responses: submitted.allAutoResponses,
})