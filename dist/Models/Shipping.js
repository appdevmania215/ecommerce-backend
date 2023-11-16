"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const shippingSchema = new mongoose_1.default.Schema({
    price: {
        type: Number,
        required: true,
    },
    storeId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: 'seller'
    }
}, {
    timestamps: true
});
const Shipping = mongoose_1.default.model('shipping', shippingSchema);
exports.default = Shipping;
