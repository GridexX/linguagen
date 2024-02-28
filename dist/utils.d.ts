import { FrenchDefinition, FrenchWikiSchema, Meaning } from './types';
export declare function getRandomEnglishWord(): Promise<string>;
export declare function translateWord(text: string, target: string): Promise<string>;
export declare function variablesFilled(): boolean;
export declare function getFirstImageSrc(word: string): Promise<string | undefined>;
export declare function getDefinitionAndPicture(translation: string): Promise<{
    defData: import("axios").AxiosResponse<any, any>;
    image: string | undefined;
}>;
export declare function transformToDef(data: FrenchWikiSchema, imageUrl?: string): {
    fd: FrenchDefinition;
    pluralDetected: boolean;
};
export declare function getSchemaAndDef(defData: any): {
    wikiSchema: import("zod").SafeParseReturnType<{
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
    defNotFound: boolean;
};
export declare const getSingularWordDefinition: (word: string) => Promise<{
    translation: string;
    definitions: Meaning[];
    pluralDetected: boolean;
    defNotFound: boolean;
    imageUrl: string;
}>;
