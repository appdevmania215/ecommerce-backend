"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const addressSchema = new mongoose_1.default.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        trim: true,
    },
    address: {
        required: true,
        type: String,
        minLength: 10,
        trim: true,
    },
    phoneNumber: {
        required: true,
        type: Number,
    },
    country: {
        type: String,
    },
    zipCode: {
        type: String,
    },
    city: {
        type: String,
    },
    state: {
        type: String,
    },
    userId: {
        required: true,
        type: mongoose_1.default.Types.ObjectId,
        ref: "User",
    },
    default: {
        type: Boolean,
        default: false,
    },
    type: {
        type: String,
        default: "shipping",
    },
}, {
    timestamps: true,
});
const Address = mongoose_1.default.model("address", addressSchema);
exports.default = Address;
