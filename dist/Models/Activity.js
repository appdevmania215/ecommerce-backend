"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const activitySchema = new mongoose_1.default.Schema({
    productId: {
        ref: 'Product',
        type: mongoose_1.default.Schema.Types.ObjectId,
    },
    name: {
        type: String,
        required: false,
        trim: true
    },
    sellerId: {
        ref: 'Seller',
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true
    },
    type: {
        default: 'credit',
        type: String,
        trim: true
    },
    bill: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});
const Activity = mongoose_1.default.model('activity', activitySchema);
exports.default = Activity;
