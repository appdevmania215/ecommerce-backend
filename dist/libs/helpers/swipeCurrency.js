"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeRates = void 0;
const axios_1 = __importDefault(require("axios"));
const logger_1 = require("./logger");
const key = process.env.STRIPE;
const StripeRates = (currency) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.get(`https://api.striperates.com/rates/${currency}`, {
            headers: {
                "x-api-key": String(key),
            },
        });
        const data = response.data;
        return data.data[0].rates.usd;
    }
    catch (error) {
        logger_1.logger.error(`Strip rate endpoint error ${JSON.stringify(error)}`);
    }
});
exports.StripeRates = StripeRates;
