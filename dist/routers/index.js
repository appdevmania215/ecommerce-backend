"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const errors_1 = require("../libs/helpers/errors");
const responses_1 = require("../libs/helpers/responses");
const routes_1 = __importDefault(require("../components/seller/routes"));
const routes_2 = __importDefault(require("../components/currency/routes"));
const router = (0, express_1.Router)();
router.get("/", (0, errors_1.CatchErrorHandler)((_, res) => {
    return new responses_1.SuccessResponse(200, { user: "Welcome here" }).send(res);
}));
const apiPrefix = process.env.API_PREFIX;
router.use(`${apiPrefix}/seller`, routes_1.default);
router.use(`${apiPrefix}/exchange`, routes_2.default);
exports.default = router;
