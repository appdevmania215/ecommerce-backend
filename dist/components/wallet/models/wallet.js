"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wallet = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
const objectId = mongoose_1.default.Types.ObjectId;
const walletSchema = new mongoose_2.Schema({
    pendingPayout: {
        type: Number,
        default: 0,
    },
    balance: {
        type: Number,
        default: 0,
    },
    ownerId: {
        type: objectId,
        required: true,
        ref: "Store",
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
exports.Wallet = (0, mongoose_2.model)("wallet-account", walletSchema);
