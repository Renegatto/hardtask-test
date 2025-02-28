
/*
token=317ad1fc-e0a9-11ef-a978-0242ac120007
title=<>
description=<>
tags=<>
budget_from=1000
budget_to=5000
deadline=1
reminds=3
all_auto_responses=false
rules=%7B%22budget_from%22%3A5000%2C%22budget_to%22%3A8000%2C%22deadline_days%22%3A5%2C%22qty_freelancers%22%3A1%7D'
*/
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
const ENDPOINT_URL = "https://deadlinetaskbot.productlove.ru/api/v1/tasks/client/newhardtask"

export const makeQuery = (toPublish: Task): string =>
  `${
    ENDPOINT_URL
  }?${
    Object.entries(toPublish)
    .map(([queryParam, value]) => `${queryParam}=${value.toString()}`)
    .join('&')
  }`
