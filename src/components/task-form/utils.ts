import { z } from "zod";
import { SubmittedForm } from "./task-form";

export const formSchema = z.object({
  token: z.string().uuid(), //uuid
  title: z.string(),
  description: z.string(),
  tags: z.array(z.string()),
  budgetFrom: z.number().nonnegative(),
  budgetTo: z.number().nonnegative(),
  deadlineDays: z.number().positive(),
  reminds: z.number().nonnegative(),
  allAutoResponses: z.boolean().optional(),
  freelancers: z.number().positive(),
});

export const formFields: { [key in keyof Required<SubmittedForm>]: key } = {
  token: "token",
  title: "title",
  description: "description",
  tags: "tags",
  budgetFrom: "budgetFrom",
  budgetTo: "budgetTo",
  deadlineDays: "deadlineDays",
  reminds: "reminds",
  allAutoResponses: "allAutoResponses",
  freelancers: "freelancers",
};
