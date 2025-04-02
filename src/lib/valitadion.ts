import { z } from "zod";

export const urlSchema =z.object({
  productUrl: z.string().url("Insira uma url válida"),
})

export type UrlFormData = z.infer<typeof urlSchema>;