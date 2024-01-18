import { z } from 'zod';
export declare const randomWordResponse: z.ZodArray<z.ZodString, "many">;
export type RandomWordResponse = z.infer<typeof randomWordResponse>;
