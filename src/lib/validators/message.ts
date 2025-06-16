import { z } from "zod";

export const messageSchema = z.object({
    id: z.string(),
    content: z.string(),
    role: z.enum(["user", "assistant", "system", "data"]),
    createdAt: z.date().optional(),
});

export type Message = z.infer<typeof messageSchema>; 