import { FC } from "react";
import { Task } from "./endpoint-data";

export type TaskFormProps = {
  onSubmit: (submitted: Task) => void,
}

export const TaskForm: FC<TaskFormProps> = () => {

  return <div>A task form</div>
}