"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomWordResponse = void 0;
const zod_1 = require("zod");
exports.randomWordResponse = zod_1.z.array(zod_1.z.string()).length(1);
