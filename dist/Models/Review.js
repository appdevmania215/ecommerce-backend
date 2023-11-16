"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const reviewSchema = new mongoose_1.default.Schema({
    rate: {
        type: Number,
        required: true
    },
    name: {
        required: true,
        type: String,
        trim: true,
        lowercase: true
    },
    productId: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'product',
        required: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    owner: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'Store',
        required: true
    }
});
const Review = mongoose_1.default.model('Review', reviewSchema);
exports.default = Review;
