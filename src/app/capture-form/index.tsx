"use client"
import { FC, useCallback, useState, useTransition } from "react";
import { FailedToPublish, PublishedTask, Task } from "./endpoint-data";
import { Alert, Flex } from "antd";
import { Either } from "./utils";

export type CaptureFormProps = {
  publishTask: (task: Task) => Promise<Either<FailedToPublish,PublishedTask>>,
  Form: FC<{ onSubmit: (submitted: Task) => void, isTransition: boolean }>
}
type Option<A> = Either<null,A>

export const CaptureForm: FC<CaptureFormProps> = ({publishTask, Form}) => {
  const [published, setPublished] =
    useState<Option<Either<FailedToPublish,PublishedTask>>>({
      isRight: false,
      left: null,
    })
  const [isTransition,startTransition] = useTransition()
  const handleSubmit = useCallback(async (task: Task) => startTransition(async () => {
    console.log('publishing',task)
    const published = await publishTask(task) 
    const newPublished: Option<Either<FailedToPublish,PublishedTask>> =
      { isRight: true, right: published }
    if (!published.isRight)
      console.error(published.left)
    setPublished(newPublished)
    console.log('new',newPublished)
  }),[])
  return <>
    Capture form
    <Flex vertical={true}>
      <Form onSubmit={handleSubmit} isTransition={isTransition} />
      { published.isRight
        ? <SubmissionResult result={published.right}/>
        : <></>
      }
    </Flex>
  </>
}

const SubmissionResult: FC<{
  result: Either<FailedToPublish,PublishedTask>
}> = ({result}) => {
  return <>
    {result.isRight
      ? 
      <Alert
        message="Published successfully"
        type="success"
        description={result.right.ok}
      />
      : <Alert
        message="Failed to publish"
        type="error"
        description={FailedToPublish.prettyPrint(result.left)}
      />
    }
  </>
}