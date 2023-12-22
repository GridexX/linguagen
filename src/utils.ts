import axios from 'axios';
import { RandomWordResponse, randomWordResponse } from './types';
import { v2 } from '@google-cloud/translate';
import { exit } from 'process';
import { apiKey, projectId, randomWordApi } from './constants';

// Instantiates a client
const { Translate } = v2;
const translate = new Translate({ projectId, key: apiKey });

/**
 * Read clouds.yaml file and extract fields based on auth_type.
 * @param {string} filePath - Path to the clouds.yaml file.
 * @param {string} cloudName - Name of the cloud configuration to extract.
 * @returns {null} - The OpenStackClient
 */

async function getRandomEnglishWord(): Promise<string> {
  try {
    const { data: words } = await axios.get<RandomWordResponse>(randomWordApi);
    const wordsParsed = randomWordResponse.parse(words);
    console.log(`Random word picked: ${wordsParsed[0]}`);
    return wordsParsed[0];
  } catch (err) {
    console.error(`Error trying query the API: ${err}`);
  }
  return '';
}

export async function translateWord(): Promise<{ text: string; translation: string }> {
  const text = await getRandomEnglishWord();
  if (text.length < 1) {
    return { text: '', translation: '' };
  }
  const target = 'fr';
  const [translation] = await translate.translate(text, target);
  console.log(`Translation: ${translation}`);
  return { text, translation };
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
