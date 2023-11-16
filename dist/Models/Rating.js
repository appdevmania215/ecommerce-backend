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
    ratings: [{
            rating: {
                type: Number,
                required: true,
                min: 1,
                max: 5
            },
            userId: {
                required: true,
                type: mongoose_1.default.Types.ObjectId,
                ref: 'User'
            },
            comment: {
                type: String,
                trim: true
            },
            name: {
                type: String,
                required: true,
                trim: true
            }
        }],
    averageRating: {
        type: Number,
        min: 1,
        max: 5
    }
});
const Rating = mongoose_1.default.model('Rating', ratingSchema);
exports.default = Rating;
