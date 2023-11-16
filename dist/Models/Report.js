"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ratingSchema = new mongoose_1.default.Schema({
    productId: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'Product'
    },
    reason: {
        type: String,
        required: true,
    },
    owner: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'User'
    },
    reportAmount: {
        type: Number,
        default: 1,
    }
});
const Report = mongoose_1.default.model('Report', ratingSchema);
exports.default = Report;
