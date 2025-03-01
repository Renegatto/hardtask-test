"use client"
import { FC, useCallback, useState } from "react";
import { Either, PublishedTask, Task } from "./endpoint-data";

export type CaptureFormProps = {
  publishTask: (task: Task) => Promise<Either<Error,PublishedTask>>,
  Form: FC<{ onSubmit: (submitted: Task) => void, }>
}
type Option<A> = Either<null,A>

export const CaptureForm: FC<CaptureFormProps> = ({publishTask, Form}) => {
  const [published, setPublished] = useState<Option<Either<Error,PublishedTask>>>({
     isRight: false,
     left: null,
  })
  const handleSubmit = useCallback(async (task: Task) => {
    console.log('publishing',task)
    const newPublished: Option<Either<Error,PublishedTask>> =
      { isRight: true, right: await publishTask(task) }
    setPublished(newPublished)
    console.log('new',newPublished)
  },[])
  return <>
    Capture form
    <><Form onSubmit={handleSubmit}/></>
  </>
}