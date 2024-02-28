"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSingularWordDefinition = exports.getSchemaAndDef = exports.transformToDef = exports.getDefinitionAndPicture = exports.getFirstImageSrc = exports.variablesFilled = exports.translateWord = exports.getRandomEnglishWord = void 0;
const axios_1 = __importDefault(require("axios"));
const cheerio = __importStar(require("cheerio"));
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
async function getFirstImageSrc(word) {
    try {
        const { data } = await axios_1.default.get(`${constants_1.frenchWikiUrl}/wiki/${word}`);
        if (typeof data !== 'string') {
            throw new Error();
        }
        const $ = cheerio.load(data);
        // Find the first img element with class mw-file-element
        // const aElem = $("a.mw-file-secription").first();
        const imgElement = $('a.mw-file-description img.mw-file-element').first();
        // Retrieve the src attribute
        const src = imgElement.attr('src') || undefined;
        if (src)
            return `https:${src}`;
    }
    catch (error) {
        console.error('Error fetching or parsing the HTML:', error);
        return undefined;
    }
}
exports.getFirstImageSrc = getFirstImageSrc;
async function getDefinitionAndPicture(translation) {
    // Gather the definition
    const data = new FormData();
    data.append('motWikiComplement', translation);
    const axiosPromise = axios_1.default.request({
        method: 'POST',
        url: `${constants_1.frenchDefinitionUrl}/app/api_wiki_complement.php`,
        data,
        validateStatus: (status) => status < 500,
    });
    // TODO : Add the zod validation
    const imagePromise = getFirstImageSrc(translation);
    const [defData, image] = await Promise.all([axiosPromise, imagePromise]);
    return { defData, image };
}
exports.getDefinitionAndPicture = getDefinitionAndPicture;
function transformToDef(data, imageUrl) {
    const n = data.natureComp.length;
    const m = data.natureDefComp.length;
    const def = { imageUrl, meanings: [] };
    let pluralDetected = false;
    if (n !== m) {
        console.error(`The size between natures ${n} and definitions ${m} is not the same`);
    }
    try {
        for (let i = 0; i < n; i++) {
            let definitions = Object.values(data.natureDefComp[i][0]);
            console.log('definitions:', JSON.stringify(definitions));
            if (definitions.some((def) => def?.includes('Pluriel de'))) {
                pluralDetected = true;
            }
            // Remove each definitions that is not of type string
            let definitionsClean = definitions.filter((def) => typeof def === 'string');
            // For each definitions, delete the &#160; tag
            definitionsClean = definitionsClean.map((def) => def?.replace(/&#160;/g, ''));
            const meaning = {
                partOfSpeech: data.natureComp[i],
                definitions: definitionsClean,
            };
            def.meanings.push(meaning);
        }
    }
    catch (error) {
        console.error('Error parsing the definition:', error);
    }
    return { fd: def, pluralDetected };
}
exports.transformToDef = transformToDef;
function getSchemaAndDef(defData) {
    const wikiSchema = types_1.frenchWikiSchema.safeParse(defData.data);
    const defNotFound = !wikiSchema.success || wikiSchema.data.error.length > 0 || wikiSchema.data.natureDefComp.length === 0;
    return { wikiSchema, defNotFound };
}
exports.getSchemaAndDef = getSchemaAndDef;
const getSingularWordDefinition = async (word) => {
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
exports.getSingularWordDefinition = getSingularWordDefinition;
