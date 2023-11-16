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
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateRate = exports.handleRateChange = exports.key = void 0;
const constant_1 = require("../components/currency/constant");
const models_1 = require("../components/currency/models");
exports.key = process.env.STRIPE || "";
const handleRateChange = () => __awaiter(void 0, void 0, void 0, function* () {
    const pounds = yield (0, exports.calculateRate)("gbp");
    const euro = yield (0, exports.calculateRate)("eur");
    const aud = yield (0, exports.calculateRate)("aud");
    const bgn = yield (0, exports.calculateRate)("bgn");
    const cad = yield (0, exports.calculateRate)("cad");
    const hrk = yield (0, exports.calculateRate)("hrk");
    const czk = yield (0, exports.calculateRate)("czk");
    const dkk = yield (0, exports.calculateRate)("dkk");
    const huf = yield (0, exports.calculateRate)("huf");
    const mxn = yield (0, exports.calculateRate)("mxn");
    const nzd = yield (0, exports.calculateRate)("nzd");
    const nok = yield (0, exports.calculateRate)("nok");
    const pln = yield (0, exports.calculateRate)("pln");
    const sek = yield (0, exports.calculateRate)("sek");
    const chf = yield (0, exports.calculateRate)("chf");
    return {
        Pounds: pounds,
        EUR: euro,
        USD: 1,
        AUD: aud,
        BGN: bgn,
        CAD: cad,
        HRK: hrk,
        CZK: czk,
        DKK: dkk,
        HUF: huf,
        MXN: mxn,
        NZD: nzd,
        NOK: nok,
        PLN: pln,
        SEK: sek,
        CHF: chf
    };
});
exports.handleRateChange = handleRateChange;
const calculateRate = (label) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const value = (_b = (_a = (constant_1.exchangeCurrency.find(c => c.label === label))) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : "USD";
    try {
        const data = yield models_1.Rates.findOne({
            name: value,
        });
        if (data) {
            return Number(data.rate);
        }
        else {
            throw new Error("Exchange rate data not found");
        }
    }
    catch (e) {
        console.log(e);
        throw new Error("Error fetching exchange rate");
    }
});
exports.calculateRate = calculateRate;
