import { z } from "zod";

export const authSchema = z.object({
  authorization: z.string().optional(),
});
