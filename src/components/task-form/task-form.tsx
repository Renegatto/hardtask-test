import { FC, useEffect } from "react";
import { Button, Form, Input, InputNumber, Spin } from "antd";
import { z } from "zod";
import { TaskTags } from "../task-tags/task-tags";
import { validateViaZod } from "@/utils";
import TextArea from "antd/es/input/TextArea";
import { formFields, formSchema } from "./utils";
import { formItemLayout } from "./styles";

export type TaskFormProps = {
  onSubmit: (submitted: SubmittedForm) => void;
  isTransition: boolean;
  token: string | undefined;
};

export type SubmittedForm = {
  title: string;
  description: string;
  tags: string[];
  token: string;
  reminds: number;
  budgetFrom: number;
  budgetTo: number;
  deadlineDays: number;
  freelancers: number;
  allAutoResponses?: boolean | undefined;
};

const UUID_PLACEHOLDER = "317ad1fc-e0a9-11ef-a978-0242ac120007";

export const TaskForm: FC<TaskFormProps> = ({
  onSubmit,
  isTransition,
  token,
}) => {
  const [form] = Form.useForm();
  const { Item } = Form;

  useEffect(() => {
    form.setFieldValue("tags", []);
  }, [form]);

  const handleSubmit = (submittedForm: unknown): void =>
    onSubmit(formSchema.parse(submittedForm));

  const budgetFrom: number | undefined = Form.useWatch(
    formFields.budgetFrom,
    form,
  );

  return (
    <Form
      form={form}
      {...formItemLayout}
      onFinish={handleSubmit}
      disabled={isTransition}
    >
      <Item
        validateDebounce={100}
        name={formFields.token}
        label="API token"
        preserve
        initialValue={token}
        tooltip="UUID v4 token that provides an access to the API"
        rules={[
          { required: true, message: "Please specify API token" },
          {
            validator: (_, value) =>
              validateViaZod(
                z.string().uuid().optional(),
                "Invalid UUID",
              )(value),
          },
        ]}
      >
        <Input
          placeholder={UUID_PLACEHOLDER}
          style={{ width: `${UUID_PLACEHOLDER.length}ch` }}
        />
      </Item>
      <Item
        name={formFields.title}
        label="Title"
        tooltip="Hardtask title"
        validateDebounce={100}
        rules={[
          { required: true, message: "Please specify the task title" },
          {
            validator: (_, value) =>
              validateViaZod(z.string().optional(), "Invalid string")(value),
          },
        ]}
      >
        <Input placeholder="A title" />
      </Item>
      <Item
        name={formFields.description}
        label="Description"
        tooltip="Detailed description of the task."
        validateDebounce={100}
        rules={[
          { required: true, message: "Please specify the task description" },
          {
            validator: (_, value) =>
              validateViaZod(z.string().optional(), "Invalid string")(value),
          },
        ]}
      >
        <TextArea placeholder="A hardtask description." rows={3} />
      </Item>
      <Item
        name={formFields.tags}
        label="Tags"
        validateDebounce={100}
        rules={[
          {
            validator: (_, value) =>
              validateViaZod(z.array(z.string()), "Invalid tags")(value),
          },
        ]}
      >
        <TaskTags
          setValues={(tags) => form.setFieldValue(formFields.tags, tags)}
        />
      </Item>
      <Item label="Budget" required>
        <Item
          name={formFields.budgetFrom}
          validateDebounce={100}
          rules={[
            { required: true, message: "Please specify the minimal budget" },
            {
              validator: (_, value) =>
                validateViaZod(
                  z.number().nonnegative().optional(),
                  "Invalid nonnegative number",
                )(value),
            },
          ]}
        >
          <InputNumber
            addonBefore={<div style={{ width: `3ch` }}>from</div>}
            style={{ gridArea: "from" }}
            min={0}
            step={1000}
            addonAfter="₽"
            placeholder="5000"
          />
        </Item>
        <Item
          name={formFields.budgetTo}
          validateDebounce={100}
          rules={[
            {
              required: true,
              message: "Please specify the maximal budget",
            },
            ({ getFieldValue }) => ({
              validator: async (_, value) => {
                await validateViaZod(
                  z.number().nonnegative().optional(),
                  "Invalid nonnegative number",
                )(value);
                if (value <= getFieldValue(formFields.budgetFrom))
                  await Promise.reject(
                    "Max budget can not be less than min budget",
                  );
              },
            }),
          ]}
        >
          <InputNumber
            addonBefore={<div style={{ width: `3ch` }}>to</div>}
            style={{ gridArea: "to" }}
            step={1000} // maybe sync values with 'from' so it is never less
            addonAfter="₽"
            min={budgetFrom || 0}
            placeholder="50000"
          />
        </Item>
      </Item>
      <Item
        name={formFields.deadlineDays}
        validateDebounce={100}
        label="Deadline"
        tooltip="Deadline in days."
        rules={[
          { required: true, message: "Please specify the task deadline" },
          {
            validator: (_, value) =>
              validateViaZod(
                z.number().positive().optional(),
                "Invalid positive number",
              )(value),
          },
        ]}
      >
        <InputNumber min={1} placeholder="3" addonAfter={<>days</>} />
      </Item>
      <Item
        name={formFields.reminds}
        validateDebounce={100}
        label="Reminds"
        initialValue={3}
        tooltip="How many times to remind the applicant about the deadline."
        rules={[
          {
            validator: (_, value) =>
              validateViaZod(
                z.number().nonnegative(),
                "Invalid non-negative number",
              )(value),
          },
        ]}
      >
        <InputNumber min={0} addonAfter="times" />
      </Item>
      {/*
    // TODO: Figure out how it works
    <Form.Item
      name={formFields.allAutoResponses}
      label='Auto-response'
      tooltip='Whether to automatically response to freelancers or not.'
      valuePropName="checked"
      rules={[
        { validator: (_,value) => 
          validateViaZod(
            z.boolean(),'Invalid logical value'
          )(value)
        },
      ]}
    >
      <Checkbox checked={false}>Automatically respond to freelancers</Checkbox>
    </Form.Item> */}
      <Item
        name={formFields.freelancers}
        label="Workload"
        initialValue={1}
        validateDebounce={100}
        tooltip="How many freelancers needed to get the work done."
        rules={[
          {
            validator: (_, value) =>
              validateViaZod(
                z.number().positive(),
                "Invalid positive value",
              )(value),
          },
        ]}
      >
        <InputNumber min={1} addonAfter="freelancers required" />
      </Item>
      <Item>
        <Button type="primary" htmlType="submit">
          Publish task {isTransition && <Spin />}
        </Button>
      </Item>
    </Form>
  );
};
