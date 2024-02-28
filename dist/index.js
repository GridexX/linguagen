"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors_1 = __importDefault(require("cors"));
const utils_1 = require("./utils");
const app = (0, express_1.default)();
const port = 3000;
app.use((0, cors_1.default)({ origin: true }));
app.use(express_1.default.json());
if (!(0, utils_1.variablesFilled)()) {
    process.exit(1);
}
app.get('/', async (_, res) => {
    res.send('Welcome to the linguagen API');
});
app.get('/random', async (req, res) => {
    const word = await (0, utils_1.getRandomEnglishWord)();
    res.send({ word });
});
app.post('/translate', async (req, res) => {
    res.setHeader('content-type', 'application/json');
    const { text } = req.body;
    let { target } = req.body; // The targeted language to translate
    // Default to english
    if (!target) {
        target = 'fr';
    }
    if (!text) {
        res.status(404).send({ error: 'Text field in body not found' });
    }
    else {
        const translation = await (0, utils_1.translateWord)(text, target);
        res.send({ translation });
    }
});
app.use((0, cors_1.default)());
app.use('/app', createProxyMiddleware({
    target: 'https://api-definition.fgainza.fr',
    logLevel: 'debug',
    changeOrigin: true,
}));
app.use('/wiki', createProxyMiddleware({
    target: 'https://fr.wiktionary.org',
    logLevel: 'debug',
    changeOrigin: true,
}));
app.post('/french', async (req, res) => {
    // Retrieve a random word
    const word = await (0, utils_1.getRandomEnglishWord)();
    // Translate it to French
    const translation = req.body.text ?? (await (0, utils_1.translateWord)(word, 'fr'));
    const singularWordDefinition = await (0, utils_1.getSingularWordDefinition)(translation);
    console.log(`[french] Contain plural: ${singularWordDefinition.pluralDetected}`);
    if (singularWordDefinition.definitions.length > 0 && !singularWordDefinition.pluralDetected) {
        console.log(`[french] Definition found for ${translation}`);
        console.log(`[french] send to client: ${JSON.stringify(singularWordDefinition)}`);
        return res.send({ word, ...singularWordDefinition });
        // Retry with the singular form
    }
    else {
        console.log(`[french] No definition found for ${translation}, try with the singular form...`);
        // If the definition is not found, take only the last word of the translation and try to get the definition of it
        const lastWord = translation.split(' ').pop() ?? '';
        // Singularize the last word
        let singularLastWord = lastWord;
        if (lastWord.endsWith('s') || lastWord.endsWith('x')) {
            singularLastWord = lastWord.slice(0, -1);
        }
        const lastWordDefinition = await (0, utils_1.getSingularWordDefinition)(singularLastWord);
        console.log(`[french] send to client: ${JSON.stringify(lastWordDefinition)}`);
        return res.send({ word, ...lastWordDefinition });
    }
});
app.listen(port, () => {
    console.log(`[server] Server is running at http://localhost:${port}`);
});
