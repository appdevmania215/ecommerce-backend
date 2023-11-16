"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletEntry = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
const objectId = mongoose_1.default.Types.ObjectId;
const walletEntrySchema = new mongoose_2.Schema({
    orderId: {
        type: objectId,
        ref: "Order",
    },
    walletId: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    amountDue: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ["PENDING", "PROCESSED", "PAYOUT"],
        default: "PENDING",
    },
    dateProcessed: {
        type: Date,
    },
    ownerId: {
        type: objectId,
        ref: "Store",
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
exports.WalletEntry = (0, mongoose_2.model)("walletEntry", walletEntrySchema);
