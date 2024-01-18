"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.variablesFilled = exports.translateWord = exports.getRandomEnglishWord = void 0;
const axios_1 = __importDefault(require("axios"));
const types_1 = require("./types");
const translate_1 = require("@google-cloud/translate");
const constants_1 = require("./constants");
// Instantiates a client
const { Translate } = translate_1.v2;
const translate = new Translate({ projectId: constants_1.projectId, key: constants_1.apiKey });
async function getRandomEnglishWord() {
    try {
        const { data: words } = await axios_1.default.get(constants_1.randomWordApi);
        const wordsParsed = types_1.randomWordResponse.parse(words);
        console.log(`[random] Random word picked: ${wordsParsed[0]}`);
        return wordsParsed[0];
    }
    catch (err) {
        console.error(`Error trying query the API: ${err}`);
    }
    return '';
}
exports.getRandomEnglishWord = getRandomEnglishWord;
async function translateWord(text, target) {
    console.log(`[translation] Translate ${text} in ${target}...`);
    const [translation] = await translate.translate(text, target);
    console.log(`[translation] Translation: ${translation}`);
    return translation;
}
exports.translateWord = translateWord;
function variablesFilled() {
    let areVariableFilled = true;
    if (!constants_1.projectId) {
        console.error('The variable PROJECT_ID must be set');
        areVariableFilled = false;
    }
    if (!constants_1.apiKey) {
        console.error('The variable API_KEY must be set');
        areVariableFilled = false;
    }
    if (!constants_1.randomWordApi) {
        console.error('The variable RANDOM_WORD_API_URL must be set');
        areVariableFilled = false;
    }
    return areVariableFilled;
}
exports.variablesFilled = variablesFilled;
