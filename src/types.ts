import { z } from 'zod';

export const randomWordResponse = z.array(z.string()).length(1);

export type RandomWordResponse = z.infer<typeof randomWordResponse>;
