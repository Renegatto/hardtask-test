
export type Task = {
  token: string; // uuid
  title: string;
  description: string;
  tags: string;
  budget_from: bigint;
  budget_to: bigint;
  deadline: bigint;
  reminds: bigint;
  all_auto_responses: boolean;
  rules: string;
}
export type PublishedTask = {
  foo: number,
}

export type Result<E,A> =
  | { success: true, value: A }
  | { success: false, failure: E }

const ENDPOINT_URL = "https://deadlinetaskbot.productlove.ru/api/v1/tasks/client/newhardtask"

export const makeQuery = (toPublish: Task): string =>
  `${
    ENDPOINT_URL
  }?${
    Object.entries(toPublish)
    .map(([queryParam, value]) => `${queryParam}=${value.toString()}`)
    .join('&')
  }`

export const publishTask = async (task: Task): Promise<Result<Error,PublishedTask>> => {
  const outcome = await fetch(makeQuery(task))
  var result: Uint8Array[] = [] //new Uint8Array()
  while (true) {
    const chunk = await outcome.body?.getReader()?.read()
    if (chunk?.value) result.push(chunk.value)
    if (chunk?.done) break
  }
  const fullResponseBody = Buffer.from(Uint8Array.from(result))
    .toString('utf8')
  return parsePublishedTask(JSON.parse(fullResponseBody))
}

const parsePublishedTask = (task: unknown): Result<Error,PublishedTask> => {
  throw new Error('Not implemented')
}