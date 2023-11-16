"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const objectID = mongoose_1.default.Types.ObjectId;
const cartSchema = new mongoose_1.default.Schema({
    owner: {
        type: objectID,
        ref: 'User',
        unique: true,
        required: true
    },
    products: [{
            productId: {
                type: objectID,
                ref: 'Product',
                required: true
            },
            variants: [{
                    option: String,
                    variant: String
                }],
            name: String,
            quantity: {
                type: Number,
                required: true,
                min: 1,
                default: 1
            },
            price: Number,
            photo: String
        }],
    bill: {
        type: Number,
        required: true,
        default: 0
    }
}, {
    timestamps: true
});
const Cart = mongoose_1.default.model('cart', cartSchema);
exports.default = Cart;
