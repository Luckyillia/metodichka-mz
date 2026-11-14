import { z } from "zod"

export const constructorBlockSchema = z.discriminatedUnion("type", [
  z.object({
    id: z.string(),
    type: z.literal("heading"),
    data: z.object({ text: z.string().min(1), level: z.union([z.literal(2), z.literal(3), z.literal(4)]).default(2) }),
  }),
  z.object({
    id: z.string(),
    type: z.literal("text"),
    data: z.object({ text: z.string() }),
  }),
  z.object({
    id: z.string(),
    type: z.literal("note"),
    data: z.object({
      title: z.string().optional(),
      text: z.string().min(1),
      tone: z.enum(["info", "warning", "success"]).default("info"),
    }),
  }),
])

export const constructorContentSchema = z.object({
  blocks: z.array(constructorBlockSchema).default([]),
})

export type ConstructorBlock = z.infer<typeof constructorBlockSchema>
export type ConstructorContent = z.infer<typeof constructorContentSchema>

export const emptyConstructorContent: ConstructorContent = { blocks: [] }
