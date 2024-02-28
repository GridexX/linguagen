import { z } from 'zod';
export declare const randomWordResponse: z.ZodArray<z.ZodString, "many">;
export type RandomWordResponse = z.infer<typeof randomWordResponse>;
export declare const frenchWikiSchema: z.ZodObject<{
    direct_link_comp: z.ZodString;
    motWikiComplement: z.ZodString;
    natureComp: z.ZodArray<z.ZodString, "many">;
    genreComp: z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodString, "many">]>, "many">;
    natureDefComp: z.ZodArray<z.ZodArray<z.ZodAny, "many">, "many">;
    error: z.ZodString;
}, "strip", z.ZodTypeAny, {
    error: string;
    direct_link_comp: string;
    motWikiComplement: string;
    natureComp: string[];
    genreComp: (string | string[])[];
    natureDefComp: any[][];
}, {
    error: string;
    direct_link_comp: string;
    motWikiComplement: string;
    natureComp: string[];
    genreComp: (string | string[])[];
    natureDefComp: any[][];
}>;
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
