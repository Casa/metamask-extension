import z from 'zod'

export const ExampleCreateBody = z.object({
  firstName: z.string(),
  lastName: z.string().nullable(),
  examplesGroupId: z.string().optional(),
})
export type ExampleCreateBody = z.infer<typeof ExampleCreateBody>

export const ExampleGetParams = z.object({
  exampleId: z.string(),
})
export type ExampleGetParams = z.infer<typeof ExampleGetParams>

export const ExampleGetQuery = z.object({
  group: z.enum(['true', 'false']),
})
export type ExampleGetQuery = z.infer<typeof ExampleGetQuery>
