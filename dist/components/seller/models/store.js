"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const storeSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        trim: true,
        unique: true,
        required: true,
        minLength: 4,
    },
    summary: {
        type: String,
        trim: true,
        required: true,
        minLength: 10,
    },
    location: {
        type: String,
        trim: true,
        required: true,
    },
    lastCheck: {
        type: Number,
        default: 0,
    },
    currency: {
        type: String,
        required: true,
        trim: true,
    },
    logo: {
        type: String,
        required: true,
    },
    views: {
        type: Number,
        default: 0,
    },
    expenses: {
        type: Number,
        default: 0,
    },
    owner: {
        type: mongoose_1.default.Types.ObjectId,
        required: true,
        unique: true,
        ref: "Seller",
    },
    sales: {
        type: Number,
        default: 0,
    },
    // categories : [{
    //     type : String,
    //     required: true
    // }],
    balance: {
        type: Number,
        default: 0,
    },
    refund: {
        trim: true,
        type: String,
        ref: "Refund",
    },
    listing: {
        type: Number,
        default: 0,
    },
    isVerified: {
        type: Boolean,
    },
    account: {
        type: String,
        required: true,
        trim: true,
    },
    reputation: {
        type: Number,
        default: 0,
    },
    sold: {
        type: Number,
        default: 0,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
// export const Store = mongoose.model<IStore>("Store", storeSchema);
