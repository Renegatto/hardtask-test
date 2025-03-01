"use client";
import { FC, ReactElement, useCallback, useState, useTransition } from "react";
import { FailedToPublish, PublishedTask, Task } from "../endpoint-data";
import { Alert, Flex } from "antd";
import { Either } from "../../utils";
import { SubmittedForm } from "./task-form";
import { useReset } from "@/app/hooks";

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
        if (!published.isRight) console.error(published.left);
        resetForm();
        setPublished(newPublished);
      }),
    [publishTask, resetForm],
  );
  return (
    <>
      Capture form
      <Flex vertical={true}>
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
    </>
  );
};

const SubmissionResult: FC<{
  result: Either<FailedToPublish, PublishedTask>;
}> = ({ result }) => {
  return (
    <>
      {result.isRight ? (
        <Alert
          message="Published successfully"
          type="success"
          description={result.right.ok}
        />
      ) : (
        <Alert
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
