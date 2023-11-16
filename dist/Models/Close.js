"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const closeSchema = new mongoose_1.default.Schema({
    reason: {
        required: true,
        type: String,
        minLength: 4,
        trim: true
    },
    comment: {
        required: true,
        type: String,
        minLength: 4,
        trim: true
    }
});
const Close = mongoose_1.default.model('close', closeSchema);
exports.default = Close;
