"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const wishSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    productId: {
        type: mongoose_1.default.Types.ObjectId,
        required: true,
        ref: 'Product',
    },
    variants: [{
            option: String,
            variant: String
        }],
    price: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});
// wishSchema.index({userId:1, productId: 1}, {unique: true})
const Wish = mongoose_1.default.model('wish', wishSchema);
exports.default = Wish;
