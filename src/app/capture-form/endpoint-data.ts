
export type Task = {
  token: string, //uuid
  title: string,
  description: string,
  tags: string[],
  budget_from: number,
  budget_to: number,
  deadline: number,
  reminds?: number,
  private_content?: never,
  all_auto_responses: boolean,
  rules: {
    budget_from: number,
    budget_to: number,
    qty_freelancers: number,
    deadline_days: number,
  },
}

export type PublishedTask = {
  ok: string,
  task: {
    ok: string,
    task: {
      title: string,
      description: string,
      tags: string[],
      budget_from: number,
      budget_to: number,
      deadline_days: number,
      number_of_reminders: number,
      private_content: null,
      is_hard: boolean,
      all_auto_responses: number,
      rules: {
        budget_from: number,
        budget_to: number,
        deadline_days: number,
        qty_freelancers: number,
        task_id: number,
      },
    },
  },
}

export type Either<E,A> =
  | { isRight: true, right: A }
  | { isRight: false, left: E }

const ENDPOINT_URL = "https://deadlinetaskbot.productlove.ru/api/v1/tasks/client/newhardtask"

type TaskQueryParams = { [key in keyof Task]: string }
const taskQueryParams = (task: Task): TaskQueryParams => ({
  token: task.token,
  title: task.title,
  description: task.description,
  tags: task.tags.join(','),
  budget_from: task.budget_from.toString(),
  budget_to: task.budget_to.toString(),
  deadline: task.deadline.toString(),
  ...task.reminds ? { reminds: Math.round(task.reminds).toString() } : {},
  all_auto_responses: task.all_auto_responses.toString(),
  rules: JSON.stringify(task.rules),
})

export const makeQuery = (toPublish: Task): string =>
  `${
    ENDPOINT_URL
  }?${
    Object.entries(taskQueryParams(toPublish))
    .map(([queryParam, value]) => `${queryParam}=${encodeURIComponent(value)}`)
    .join('&')
  }`

export const publishTask = async (task: Task): Promise<Either<Error,PublishedTask>> => {
  const outcome = await fetch(makeQuery(task))
  var result: Uint8Array[] = []
  while (true) {
    const chunk = await outcome.body?.getReader()?.read()
    if (chunk?.value) result.push(chunk.value)
    if (chunk?.done) break
  }
  const fullResponseBody = Buffer.from(Uint8Array.from(result))
    .toString('utf8')
  return parsePublishedTask(JSON.parse(fullResponseBody))
}

const parsePublishedTask = (_: unknown): Either<Error,PublishedTask> => {
  throw new Error('Not implemented')
}