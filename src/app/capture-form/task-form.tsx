import { FC } from "react";
import { Task } from "./endpoint-data";
import { Button, Checkbox, Form, Input, InputNumber, Radio, Tag, Tooltip } from "antd";

export type TaskFormProps = {
  onSubmit: (submitted: Task) => void,
}
const UUID_PLACEHOLDER = "317ad1fc-e0a9-11ef-a978-0242ac120007"

export const TaskForm: FC<TaskFormProps> = () => {
  
  return <Form>
    <Form.Item
      label="Token"
      tooltip="UUID v4 token of the task"
      required={true}
    >
      <Input
        placeholder={UUID_PLACEHOLDER}
        style={{width: `${UUID_PLACEHOLDER.length}ch`}}
      />
    </Form.Item>
    <Form.Item
      label="Title"
      tooltip="Hardtask title"
      required={true}
    >
      <Input
        placeholder='A title'
      />
    </Form.Item>
    <Form.Item
      label="Description"
      tooltip="Detailed description of the task."
    >
      <Input
        placeholder='A hardtask description.'
      />
    </Form.Item>
    <Form.Item
      label="Tags"
      tooltip="Tags that can help to find this task."
    >
      <Tag>HTML</Tag>
      <Tag>CSS</Tag>
      <Tag>Necromancy</Tag>
    </Form.Item>
    <Form.Item
      label="Budget"
      tooltip="An acceptable budget for the task."
      required={true}
    > 
      <InputNumber
        addonBefore={<div style={{width: `3ch`}}>from</div>}
        style={{gridArea: 'from'}}
        step={1000}
        addonAfter="₽"
        placeholder='5000'
      />
      <InputNumber
        addonBefore={<div style={{width: `3ch`}}>to</div>}
        style={{gridArea: 'to'}}
        step={1000} // maybe sync values with 'from' so it is never less
        addonAfter="₽"
        placeholder='50000'
      />
    </Form.Item>
    <Form.Item
      label='Deadline'
      tooltip='Deadline in days.'
      required={true}
    >
      <InputNumber placeholder='3' addonAfter={<>days</>} />
    </Form.Item>
    <Form.Item
      label='Reminders'
      required={false}
      tooltip='How many times to remind the applicant about the deadline.'
    >
      <InputNumber placeholder='3' addonAfter={<>times</>} />
    </Form.Item>
    <Form.Item
      label='Auto-response'
      required={false}
      tooltip='Whether to automatically response to freelancers or not.'
    >
      <Checkbox>Automatically respond to freelancers</Checkbox>
    </Form.Item>
    <Form.Item
      label='Workload'
      required={false}
      tooltip='How many freelancers needed to get the work done.'
    >
      <InputNumber placeholder='1' addonAfter='freelancers required' />
    </Form.Item>
    <Form.Item label={null}>
      <Button type="primary" htmlType="submit">
        Publish task
      </Button>
    </Form.Item>
  </Form>
}