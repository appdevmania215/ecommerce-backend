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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExchangeRateService = void 0;
const helpers_1 = require("../../../libs/helpers");
const swipeCurrency_1 = require("../../../libs/helpers/swipeCurrency");
const constant_1 = require("../constant");
const models_1 = require("../models");
class ExchangeRateService {
    static generateExchangeRate() {
        var _a, e_1, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            yield models_1.Rates.deleteMany();
            const rates = [{ name: "USD", rate: 1, symbol: "$" }];
            try {
                for (var _d = true, exchangeCurrency_1 = __asyncValues(constant_1.exchangeCurrency), exchangeCurrency_1_1; exchangeCurrency_1_1 = yield exchangeCurrency_1.next(), _a = exchangeCurrency_1_1.done, !_a;) {
                    _c = exchangeCurrency_1_1.value;
                    _d = false;
                    try {
                        const rate = _c;
                        const response = yield (0, swipeCurrency_1.StripeRates)(rate.label);
                        rates.push({
                            name: rate.value,
                            symbol: rate.symbol,
                            rate: Number(response.toFixed(4)),
                        });
                    }
                    finally {
                        _d = true;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = exchangeCurrency_1.return)) yield _b.call(exchangeCurrency_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            yield models_1.Rates.create(rates);
            helpers_1.logger.info(`Rate created`);
        });
    }
    static getRates() {
        return __awaiter(this, void 0, void 0, function* () {
            helpers_1.logger.info(`Get rates endpoint was called now`);
            const rates = yield models_1.Rates.find();
            return rates;
        });
    }
}
exports.ExchangeRateService = ExchangeRateService;
