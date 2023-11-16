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
exports.WalletService = void 0;
const Seller_1 = __importDefault(require("../../../Models/Seller"));
const errors_1 = require("../../../libs/helpers/errors");
const mongodb_1 = require("mongodb");
const wallet_1 = require("../interface/wallet");
const models_1 = require("../models");
class WalletService {
    static getBalance(ownerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const wallet = yield models_1.Wallet.findOne({ ownerId });
            if (!wallet) {
                const newWallet = new models_1.Wallet({
                    ownerId,
                });
                yield newWallet.save();
                return newWallet;
            }
            return wallet;
        });
    }
    static createWalletPayout(payload) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const { orderId, amount, ownerId } = payload;
            const wallet = yield this.getBalance(ownerId);
            const seller = yield Seller_1.default.findOne({ storeId: ownerId });
            const fee = (seller === null || seller === void 0 ? void 0 : seller.package) === "Premium" ? 0.05 : 0.1;
            const amountDue = amount - amount * fee;
            const walletEntry = new models_1.WalletEntry({
                orderId: new mongodb_1.ObjectId(orderId),
                amount,
                amountDue,
                ownerId: new mongodb_1.ObjectId(ownerId),
                walletId: wallet.id,
            });
            wallet.pendingPayout = ((_a = wallet.pendingPayout) !== null && _a !== void 0 ? _a : 0) + Number(amountDue);
            yield walletEntry.save();
            yield wallet.save();
            return walletEntry;
        });
    }
    static updateAvailablePayout(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const walletEntry = yield models_1.WalletEntry.findOne({ orderId: payload.orderId });
            if (!walletEntry)
                throw new errors_1.NotFoundError("Order not found");
            const wallet = yield this.getBalance(walletEntry.ownerId);
            wallet.pendingPayout = wallet.pendingPayout - walletEntry.amountDue;
            wallet.balance = wallet.balance + walletEntry.amountDue;
            walletEntry.status = wallet_1.IWalletEntryStatus.PROCESSED;
            yield wallet.save();
            yield walletEntry.save();
            return wallet;
        });
    }
}
exports.WalletService = WalletService;
