import axios from 'axios';
import * as cheerio from 'cheerio';
import {
  FrenchDefinition,
  FrenchWikiSchema,
  Meaning,
  RandomWordResponse,
  frenchWikiSchema,
  randomWordResponse,
} from './types';
import { v2 } from '@google-cloud/translate';
import { apiKey, frenchDefinitionUrl, frenchWikiUrl, projectId, randomWordApi } from './constants';

// Instantiates a client
const { Translate } = v2;
const translate = new Translate({ projectId, key: apiKey });

export async function getRandomEnglishWord(): Promise<string> {
  try {
    const { data: words } = await axios.get<RandomWordResponse>(randomWordApi);
    const wordsParsed = randomWordResponse.parse(words);
    console.log(`[random] Random word picked: ${wordsParsed[0]}`);
    return wordsParsed[0];
  } catch (err) {
    console.error(`Error trying query the API: ${err}`);
  }
  return '';
}

export async function translateWord(text: string, target: string): Promise<string> {
  console.log(`[translation] Translate ${text} in ${target}...`);
  const [translation] = await translate.translate(text, target);
  console.log(`[translation] Translation: ${translation}`);
  return translation;
}

export function variablesFilled(): boolean {
  let areVariableFilled = true;

  if (!projectId) {
    console.error('The variable PROJECT_ID must be set');
    areVariableFilled = false;
  }
  if (!apiKey) {
    console.error('The variable API_KEY must be set');
    areVariableFilled = false;
  }
  if (!randomWordApi) {
    console.error('The variable RANDOM_WORD_API_URL must be set');
    areVariableFilled = false;
  }

  return areVariableFilled;
}

export async function getFirstImageSrc(word: string): Promise<string | undefined> {
  try {
    const { data } = await axios.get(`${frenchWikiUrl}/wiki/${word}`);
    if (typeof data !== 'string') {
      throw new Error();
    }
    const $ = cheerio.load(data);

    // Find the first img element with class mw-file-element
    // const aElem = $("a.mw-file-secription").first();
    const imgElement = $('a.mw-file-description img.mw-file-element').first();

    // Retrieve the src attribute
    const src = imgElement.attr('src') || undefined;
    if (src) return `https:${src}`;
  } catch (error) {
    console.error('Error fetching or parsing the HTML:', error);
    return undefined;
  }
}

export async function getDefinitionAndPicture(translation: string) {
  // Gather the definition
  const data = new FormData();
  data.append('motWikiComplement', translation);
  const axiosPromise = axios.request({
    method: 'POST',
    url: `${frenchDefinitionUrl}/app/api_wiki_complement.php`,
    data,
    validateStatus: (status) => status < 500,
  });
  // TODO : Add the zod validation
  const imagePromise = getFirstImageSrc(translation);
  const [defData, image] = await Promise.all([axiosPromise, imagePromise]);
  return { defData, image };
}

export function transformToDef(
  data: FrenchWikiSchema,
  imageUrl?: string,
): { fd: FrenchDefinition; pluralDetected: boolean } {
  const n = data.natureComp.length;
  const m = data.natureDefComp.length;

  const def: FrenchDefinition = { imageUrl, meanings: [] };
  let pluralDetected = false;
  if (n !== m) {
    console.error(`The size between natures ${n} and definitions ${m} is not the same`);
  }
  try {
    for (let i = 0; i < n; i++) {
      let definitions = Object.values(data.natureDefComp[i][0]) as string[] | Array<Array<string>>;
      console.log('definitions:', JSON.stringify(definitions));
      if (definitions.some((def) => def?.includes('Pluriel de'))) {
        pluralDetected = true;
      }

      // Remove each definitions that is not of type string
      let definitionsClean = definitions.filter((def) => typeof def === 'string') as string[];

      // For each definitions, delete the &#160; tag
      definitionsClean = definitionsClean.map((def) => def?.replace(/&#160;/g, ''));

      const meaning: Meaning = {
        partOfSpeech: data.natureComp[i],
        definitions: definitionsClean,
      };
      def.meanings.push(meaning);
    }
  } catch (error) {
    console.error('Error parsing the definition:', error);
  }
  return { fd: def, pluralDetected };
}

export function getSchemaAndDef(defData: any) {
  const wikiSchema = frenchWikiSchema.safeParse(defData.data);

  const defNotFound =
    !wikiSchema.success || wikiSchema.data.error.length > 0 || wikiSchema.data.natureDefComp.length === 0;
  return { wikiSchema, defNotFound };
}

export const getSingularWordDefinition = async (word: string) => {
  // Remove articles from the word
  const translation = word.replace(/(un |une |le |la |les |l'|d')/g, '');

  const { defData, image } = await getDefinitionAndPicture(translation);
  const { wikiSchema, defNotFound } = getSchemaAndDef(defData);
  // let def:
  const { fd, pluralDetected } = wikiSchema.success
    ? transformToDef(wikiSchema.data, image)
    : { fd: { meanings: [] }, pluralDetected: false };
  return {
    translation,
    definitions: fd.meanings,
    pluralDetected,
    defNotFound,
    imageUrl: image ?? '',
  };
};
