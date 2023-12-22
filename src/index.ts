import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import serverless from 'serverless-http';
import { translateWord, variablesFilled } from './utils';

const app: Express = express();
const port = 3000;
app.use(cors({ origin: true }));

if (!variablesFilled()) {
  process.exit(1);
}

app.get('/', async (req: Request, res: Response) => {
  req.headers['content-type'] = 'application/json';
  const words = await translateWord();
  res.send(words);
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

export const handler = serverless(app);
