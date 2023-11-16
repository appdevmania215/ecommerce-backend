"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const refundSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    storeId: {
        type: mongoose_1.default.Types.ObjectId,
        required: true,
        ref: 'Store'
    },
    productId: {
        type: mongoose_1.default.Types.ObjectId,
        required: true,
        ref: 'Product'
    },
    reason: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        trim: true,
        default: 'pending'
    }
}, {
    timestamps: true
});
refundSchema.index({ productId: 1, userId: 1 }, { name: 'unique_index_name', unique: true });
const Refund = mongoose_1.default.model('refund', refundSchema);
exports.default = Refund;
