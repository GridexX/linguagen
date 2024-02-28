"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.frenchWikiSchema = exports.randomWordResponse = void 0;
const zod_1 = require("zod");
exports.randomWordResponse = zod_1.z.array(zod_1.z.string()).length(1);
exports.frenchWikiSchema = zod_1.z.object({
    direct_link_comp: zod_1.z.string(),
    motWikiComplement: zod_1.z.string(),
    natureComp: zod_1.z.array(zod_1.z.string()),
    genreComp: zod_1.z.array(zod_1.z.union([zod_1.z.string(), zod_1.z.array(zod_1.z.string())])),
    natureDefComp: zod_1.z.array(zod_1.z.array(zod_1.z.any())), //.or(z.array(z.array(z.string())))))
    error: zod_1.z.string(),
});
