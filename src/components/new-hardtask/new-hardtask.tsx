"use client";
import { FC, ReactElement, useCallback, useState, useTransition } from "react";
import {
  FailedToPublish,
  PublishedTask,
  Task,
} from "../../service/api/newhardtask";
import { Alert, Flex, message } from "antd";
import { Either } from "../../utils";
import { useReset } from "@/hooks";
import { Typography } from "antd";
import { SubmittedForm } from "../task-form/task-form";

export type NewHardtaskProps = {
  publishTask: (task: Task) => Promise<Either<FailedToPublish, PublishedTask>>;
  TaskForm(
    key: number,
    onSubmit: (submitted: Task) => void,
    isTransition: boolean,
    token: string | undefined,
  ): ReactElement;
};
type Option<A> = Either<null, A>;

const Some = <A,>(a: A): Option<A> => Either.Right(a);

export const NewHardtask: FC<NewHardtaskProps> = ({
  publishTask,
  TaskForm,
}) => {
  const [messageApi, contextHolder] = message.useMessage({duration: 10});

  const [formKey, resetForm] = useReset();
  const [published, setPublished] = useState<
    Option<{ task: Task; result: Either<FailedToPublish, PublishedTask> }>
  >(Either.Left(null));
  const [isTransition, startTransition] = useTransition();

  const handleSubmit = useCallback(
    async (task: Task) =>
      startTransition(async () => {
        const published = await publishTask(task);
        const newPublished = Some({ task, result: published });
        if (published.isRight) {
          messageApi.success("Published successfully");
        } else {
          messageApi.error(
            `Failed to publish: ${FailedToPublish.prettyPrint(published.left)}`,
          );
        }
        resetForm();
        setPublished(newPublished);
      }),
    [publishTask, resetForm, messageApi],
  );
  // https://ant.design/docs/react/use-with-next (warning)
  const { Title } = Typography;

  return (
    <Flex vertical={true} align="flex-start">
      {contextHolder}
      <Title level={3}>Capture form</Title>
      {TaskForm(
        formKey,
        handleSubmit,
        isTransition,
        (published.isRight && published.right.task.token) || undefined,
      )}
      {published.isRight ? (
        <SubmissionResult result={published.right.result} />
      ) : (
        <></>
      )}
    </Flex>
  );
};

const SubmissionResult: FC<{
  result: Either<FailedToPublish, PublishedTask>;
}> = ({ result }) => {
  return (
    <>
      {result.isRight ? (
        <Alert
          style={{width: '100%'}}
          message="Published successfully"
          type="success"
          description={result.right.ok}
        />
      ) : (
        <Alert
          style={{width: '100%'}}
          message="Failed to publish"
          type="error"
          description={FailedToPublish.prettyPrint(result.left)}
        />
      )}
    </>
  );
};

export const submittedFormToTask = (submitted: SubmittedForm): Task => ({
  token: submitted.token,
  title: submitted.title,
  description: submitted.description,
  tags: submitted.tags,
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
});
