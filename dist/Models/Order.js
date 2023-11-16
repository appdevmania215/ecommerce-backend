"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const objectId = mongoose_1.default.Types.ObjectId;
const orderSchema = new mongoose_1.default.Schema({
    status: {
        type: String,
        trim: true,
        default: "placed",
    },
    userId: {
        required: true,
        ref: "User",
        type: objectId,
    },
    productId: {
        required: true,
        ref: "Product",
        type: objectId,
    },
    sellerId: {
        required: true,
        ref: "Seller",
        type: mongoose_1.default.Types.ObjectId,
    },
    price: {
        required: true,
        type: Number,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    refund: {
        type: Boolean,
    },
    shippingProvider: {
        type: String,
        trim: true,
    },
    trackingId: {
        type: String,
        trim: true,
    },
    variants: [
        {
            option: String,
            variant: String,
        },
    ],
    address: {
        type: String,
        trim: true,
    },
    amount: {
        type: Number,
        default: 0,
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, "Quantity can not be less then 1"],
    },
    shippingCost: {
        type: Number,
        default: 0,
    },
    shipping: {
        type: String,
        default: "standard shipping",
    },
    activity: {
        type: Boolean,
        default: false,
    },
    updateShipping: {
        type: Date,
        default: Date.now(),
    },
    updated: {
        type: Boolean,
        default: false,
    },
    active: {
        type: Boolean,
        default: false,
    },
    sellerPackage: {
        type: String,
    },
}, {
    timestamps: true,
});
const Order = mongoose_1.default.model("order", orderSchema);
exports.default = Order;
