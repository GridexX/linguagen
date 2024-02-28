import express, { Express, Request, Response } from 'express';
const { createProxyMiddleware } = require('http-proxy-middleware');
import cors from 'cors';
import { getRandomEnglishWord, getSingularWordDefinition, translateWord, variablesFilled } from './utils';
import { ReturnDefinition } from './types';

const app: Express = express();
const port = 3000;
app.use(cors({ origin: true }));
app.use(express.json());

if (!variablesFilled()) {
  process.exit(1);
}

app.get('/', async (_, res: Response) => {
  res.send('Welcome to the linguagen API');
});

app.get('/random', async (req: Request, res: Response) => {
  const word = await getRandomEnglishWord();
  res.send({ word });
});

app.post('/translate', async (req: Request, res: Response) => {
  res.setHeader('content-type', 'application/json');
  const { text } = req.body;
  let { target } = req.body; // The targeted language to translate
  // Default to english
  if (!target) {
    target = 'fr';
  }
  if (!text) {
    res.status(404).send({ error: 'Text field in body not found' });
  } else {
    const translation = await translateWord(text, target);
    res.send({ translation });
  }
});

app.use(cors());
app.use(
  '/app',
  createProxyMiddleware({
    target: 'https://api-definition.fgainza.fr',
    logLevel: 'debug',
    changeOrigin: true,
  }),
);

app.use(
  '/wiki',
  createProxyMiddleware({
    target: 'https://fr.wiktionary.org',
    logLevel: 'debug',
    changeOrigin: true,
  }),
);

app.post('/french', async (req: Request, res: Response): Promise<Response<ReturnDefinition>> => {
  // Retrieve a random word
  const word = await getRandomEnglishWord();
  // Translate it to French
  const translation = req.body.text ?? (await translateWord(word, 'fr'));
  const singularWordDefinition = await getSingularWordDefinition(translation);

  console.log(`[french] Contain plural: ${singularWordDefinition.pluralDetected}`);

  if (singularWordDefinition.definitions.length > 0 && !singularWordDefinition.pluralDetected) {
    console.log(`[french] Definition found for ${translation}`);
    console.log(`[french] send to client: ${JSON.stringify(singularWordDefinition)}`);
    return res.send({ word, ...singularWordDefinition });
    // Retry with the singular form
  } else {
    console.log(`[french] No definition found for ${translation}, try with the singular form...`);
    // If the definition is not found, take only the last word of the translation and try to get the definition of it
    const lastWord = translation.split(' ').pop() ?? '';

    // Singularize the last word
    let singularLastWord = lastWord;
    if (lastWord.endsWith('s') || lastWord.endsWith('x')) {
      singularLastWord = lastWord.slice(0, -1);
    }

    const lastWordDefinition = await getSingularWordDefinition(singularLastWord);
    console.log(`[french] send to client: ${JSON.stringify(lastWordDefinition)}`);
    return res.send({ word, ...lastWordDefinition });
  }
});

app.listen(port, () => {
  console.log(`[server] Server is running at http://localhost:${port}`);
});
