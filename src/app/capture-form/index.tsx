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
    setPublished({ isRight: true, right: await publishTask(task) })
  },[])
  return <>
    Capture form
    <><Form onSubmit={handleSubmit}/></>
  </>
}