// YOUR_BASE_DIRECTORY/netlify/functions/api.ts

import express, { Router } from 'express';
import serverless from 'serverless-http';
import { translateWord } from '../../src/utils';

const api = express();

const router = Router();
router.get('/hello', async (req, res) => {
  const words = await translateWord();
  res.send(words);
});

api.use('/api/', router);

export const handler = serverless(api);
