import { FC } from "react";
import { Task } from "./endpoint-data";
import { Checkbox, Form, Radio } from "antd";

export type TaskFormProps = {
  onSubmit: (submitted: Task) => void,
}

export const TaskForm: FC<TaskFormProps> = () => {
  
  return <Form>
    <Form.Item label="Checkbox" name="disabled" valuePropName="checked">
      <Checkbox>Checkbox</Checkbox>
    </Form.Item>
    <Form.Item label="Radio">
      <Radio.Group>
        <Radio value="apple"> Apple </Radio>
        <Radio value="pear"> Pear </Radio>
      </Radio.Group>
    </Form.Item>
  </Form>
}