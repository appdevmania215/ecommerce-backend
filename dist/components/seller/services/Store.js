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
exports.StoreServices = void 0;
const helpers_1 = require("../../../libs/helpers");
const errors_1 = require("../../../libs/helpers/errors");
const Seller_1 = __importDefault(require("../../../Models/Seller"));
const Store_1 = __importDefault(require("../../../Models/Store"));
class StoreServices {
    static getUserStore(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { _id: sellerId } = yield this._readSeller({ owner: userId });
            helpers_1.logger.info(`Seller Id ${sellerId}`);
            return yield this._readStore({ owner: sellerId });
        });
    }
    static updateStore(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            helpers_1.logger.info(`update store payload ${JSON.stringify(payload)}`);
            const store = yield this._getUserStore({ id: payload.userId });
            helpers_1.logger.info(`store id ${JSON.stringify(store)}`);
            const updatedStore = yield Store_1.default.updateOne({ _id: store._id }, {
                sellGlobal: payload.sellGlobal !== undefined
                    ? payload.sellGlobal
                    : store.sellGlobal,
                disableChat: payload.disableChat !== undefined
                    ? payload.disableChat
                    : store.disableChat,
                domesticShipping: {
                    express: (payload === null || payload === void 0 ? void 0 : payload.domesticShipping) || store.domesticShipping.express,
                    standard: (payload === null || payload === void 0 ? void 0 : payload.domesticShipping) || store.domesticShipping.standard,
                },
            }, { new: true });
            helpers_1.logger.info(`updated store response ${JSON.stringify(updatedStore)}`);
            return updatedStore;
        });
    }
    static _readSeller(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const seller = yield Seller_1.default.findOne(query);
            if (!seller)
                throw new errors_1.NotFoundError("Seller not found");
            return seller;
        });
    }
    static _readStore(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const store = yield Store_1.default.findOne(query).populate({ path: "owner", model: Seller_1.default, });
            if (!store)
                throw new errors_1.NotFoundError("Store not found");
            return store;
        });
    }
    static _getUserStore(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { _id: sellerId } = yield this._readSeller({ owner: userId.id });
            helpers_1.logger.info(`Seller Id ${sellerId}`);
            return yield this._readStore({ owner: sellerId });
        });
    }
}
exports.StoreServices = StoreServices;
