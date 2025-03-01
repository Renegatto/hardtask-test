import {z} from 'zod';

const taskSchema = z.object({
  token: z.string().uuid(), //uuid
  title: z.string(),
  description: z.string(),
  tags: z.array(z.string()),
  budget_from: z.number().nonnegative(),
  budget_to: z.number().nonnegative(),
  deadline: z.number().positive(),
  reminds: z.number().nonnegative(),
  all_auto_responses: z.boolean().optional(),
  rules: z.object({
    budget_from: z.number().nonnegative(),
    budget_to: z.number().nonnegative(),
    qty_freelancers: z.number().positive(),
    deadline_days: z.number().positive(),
  }),
})

export type Task = z.infer<typeof taskSchema>
//  {
//   token: string, //uuid
//   title: string,
//   description?: string,
//   tags: string[],
//   budget_from: number,
//   budget_to: number,
//   deadline: number,
//   reminds?: number,
//   all_auto_responses: boolean,
//   rules: {
//     budget_from: number,
//     budget_to: number,
//     qty_freelancers: number,
//     deadline_days: number,
//   },
// }

export const publishedTaskSchema = z.object({
  ok: z.string(),
  task: z.object({
    title: z.string(),
    description: z.string(),
    tags: z.array(z.string()),
    budget_from: z.number().nonnegative(),
    budget_to: z.number().nonnegative(),
    deadline_days: z.number().int().positive(),
    number_of_reminders: z.number().int().nonnegative(),
    private_content: z.null(),
    is_hard: z.boolean(),
    all_auto_responses: z.boolean(),
    rules: z.object({
      budget_from: z.number().positive().nonnegative(),
      budget_to: z.number().positive().nonnegative(),
      deadline_days: z.number().int().positive(),
      qty_freelancers: z.number().int().nonnegative(),
      task_id: z.number().nonnegative(),
    }),
  }),
})

export type PublishedTask = z.infer<typeof publishedTaskSchema>

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
  reminds: Math.round(task.reminds).toString(),
  ...optional(
    'all_auto_responses',
    typeof task.all_auto_responses !== 'undefined' ? task.all_auto_responses.toString() : undefined
  ),
  rules: JSON.stringify(task.rules),
})

export const makeQuery = (toPublish: Task): string =>
  `${
    ENDPOINT_URL
  }?${
    Object.entries(taskQueryParams(toPublish))
    .filter(([_, value]) => typeof value !== 'undefined')
    .map(([queryParam, value]: [string,string]) => `${queryParam}=${encodeURIComponent(value)}`)
    .join('&')
  }`

export const publishTask = async (task: Task): Promise<Either<Error,PublishedTask>> => {
  const outcome = await fetch(makeQuery(task))
  if (outcome.ok) {
    return parsePublishedTask(await outcome.json())
  } else {
    return { isRight: false, left: new Error(outcome.statusText) }
  }
}

const parsePublishedTask = (published: unknown): Either<Error,PublishedTask> => {
  const parsed = publishedTaskSchema.safeParse(published)
  return parsed.success
    ? { isRight: true, right: parsed.data }
    : { isRight: false, left: parsed.error }
}

const optional = <K extends string,T>(
  key: K,
  value: T,
): { [key in K]?: NonNullable<T> } => {
  if (value != undefined) {
    return { [key as K]: value } as { [key in K]?: NonNullable<T>}
  } else {
    return {}
  }
}