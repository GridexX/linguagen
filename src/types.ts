import { z } from 'zod';

export const randomWordResponse = z.array(z.string()).length(1);

export type RandomWordResponse = z.infer<typeof randomWordResponse>;

export const frenchWikiSchema = z.object({
  direct_link_comp: z.string(),
  motWikiComplement: z.string(),
  natureComp: z.array(z.string()),
  genreComp: z.array(z.union([z.string(), z.array(z.string())])),
  natureDefComp: z.array(z.array(z.any())), //.or(z.array(z.array(z.string())))))
  error: z.string(),
});

export type FrenchWikiSchema = z.infer<typeof frenchWikiSchema>;

export type Meaning = {
  partOfSpeech: string;
  definitions: string[];
};

export type FrenchDefinition = {
  imageUrl?: string;
  meanings: Meaning[];
};

export type ReturnDefinition = {
  translation: string;
  word: string;
  definitions: Meaning[];
  pluralDetected: boolean;
  defNotFound: boolean;
  imageUrl: string;
};
