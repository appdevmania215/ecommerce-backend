"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rates = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const exchangeRateSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
    },
    symbol: {
        type: String,
    },
    rate: {
        type: Number,
    },
}, {
    timestamps: true,
});
exports.Rates = mongoose_1.default.model("exchange-rate", exchangeRateSchema);
