"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const walletSchema = new mongoose_1.default.Schema({
    ownerId: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "seller",
        required: true,
        unique: true,
    },
    balance: {
        type: Number,
        default: 0,
    },
    pendingPayout: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});
const Wallet = mongoose_1.default.model("wallet", walletSchema);
exports.default = Wallet;
