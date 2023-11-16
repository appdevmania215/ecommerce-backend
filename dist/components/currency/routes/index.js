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
const express_1 = require("express");
const models_1 = require("../models");
const errors_1 = require("../../../libs/helpers/errors");
const controller_1 = require("../controller");
const router = (0, express_1.Router)();
router.get("/rates", (0, errors_1.CatchErrorHandler)(controller_1.RatesController.getRates));
router.patch("/rate/:name", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.params;
    try {
        const rate = yield models_1.Rates.findOne({
            name: name,
        });
        return res.status(200).send(rate);
    }
    catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
}));
exports.default = router;
