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
exports.StoreController = void 0;
const services_1 = require("../services");
const responses_1 = require("../../../libs/helpers/responses");
class StoreController {
    static getStore(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.user._id;
            const outcome = yield services_1.StoreServices.getUserStore(userId);
            return new responses_1.SuccessResponse(200, outcome).send(res);
        });
    }
    static updateStore(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const outcome = yield services_1.StoreServices.updateStore(Object.assign({ userId: req.user._id }, req.body));
            return new responses_1.SuccessResponse(201, outcome).send(res);
        });
    }
}
exports.StoreController = StoreController;
