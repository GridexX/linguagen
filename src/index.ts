import express, { Express, Request, Response } from 'express';
const { createProxyMiddleware } = require('http-proxy-middleware');
import cors from 'cors';
import serverless from 'serverless-http';
import { getRandomEnglishWord, translateWord, variablesFilled } from './utils';

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
  if (!text) {
    res.status(404).send({ error: 'Text field in body not found' });
  } else {
    const translation = await translateWord(text);
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

app.listen(port, () => {
  console.log(`[server] Server is running at http://localhost:${port}`);
});

export const handler = serverless(app);
