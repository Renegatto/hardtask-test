import {z} from 'zod';
import { Either, optionalField } from './utils';

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

export type FailedToPublish =
  | FailedToPublish.AccessDenied
  | FailedToPublish.ConnectionFailed
  | FailedToPublish.InternalServerError
  | FailedToPublish.InvalidResponse
  | FailedToPublish.InvalidRequest

export namespace FailedToPublish {
  export type InvalidResponse = { type: 'invalid-response', error: z.ZodError<any> };
  export type ConnectionFailed = { type: 'connection-failed', error: Error }
  export type InvalidRequest = { type: 'invalid-request', body: unknown }
  export type InternalServerError = { type: 'internal-server-error', body: unknown }
  export type AccessDenied = { type: 'access-denied' }
  export const prettyPrint = (err: FailedToPublish): string => {
    switch (err.type) {
      case 'access-denied': return "Access denied. Check your token."
      case 'connection-failed': return "Failed to connect."
      case 'internal-server-error': return 'Something went wrong on the server side'
      case 'invalid-response': return 'Got unexpected response from the server. Please report a bug.'
      case 'invalid-request': return 'Made incorrect request to the server. Please report a bug.'
    }
  }
}

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
  ...optionalField(
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

export const publishTask = async (task: Task): Promise<Either<FailedToPublish,PublishedTask>> => {
  let outcome: Either<FailedToPublish.ConnectionFailed,Response>;
  try {
    outcome = Either.Right(await fetch(makeQuery(task)))
  } catch (e) {
    if (e instanceof Error) {
      outcome = Either.Left({type: 'connection-failed', error: e})
    } else {
      throw e
    }
  }

  if (!outcome.isRight) return outcome
  if (outcome.right.ok) {
    return parsePublishedTask(await outcome.right.json())
  } else {
    switch (Math.floor(outcome.right.status/100)) {
      case 5: return Either.Left({
        type: 'internal-server-error',
        body: await outcome.right.json()
      });
      default:
        throw new Error('FIXME: handle other status codes')
    }
  }
}

const parsePublishedTask = (published: unknown): Either<FailedToPublish.InvalidResponse,PublishedTask> => {
  const parsed = publishedTaskSchema.safeParse(published)
  return parsed.success
    ? Either.Right(parsed.data)
    : Either.Left({ type: 'invalid-response', error: parsed.error })
}
