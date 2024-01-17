"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const express_1 = __importDefault(require("express"));
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors_1 = __importDefault(require("cors"));
const serverless_http_1 = __importDefault(require("serverless-http"));
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
app.listen(port, () => {
    console.log(`[server] Server is running at http://localhost:${port}`);
});
exports.handler = (0, serverless_http_1.default)(app);
