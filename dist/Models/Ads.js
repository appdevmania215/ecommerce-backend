"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const adsSchema = new mongoose_1.default.Schema({
    productId: {
        ref: 'Product',
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    owner: {
        ref: 'Store',
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true
    }
}, {
    timestamps: true,
});
const Ads = mongoose_1.default.model('ads', adsSchema);
exports.default = Ads;
