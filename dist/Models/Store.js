"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = __importStar(require("mongoose"));
const storeSchema = new mongoose.Schema({
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
    sellGlobal: {
        type: Boolean,
        default: true,
    },
    disableChat: {
        type: Boolean,
        default: false,
    },
    domesticShipping: {
        express: {
            type: Number,
            default: 0,
        },
        standard: {
            type: Number,
            default: 0,
        },
    },
    expenses: {
        type: Number,
        default: 0,
    },
    owner: {
        type: mongoose.Types.ObjectId,
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
const Store = mongoose.model("Store", storeSchema);
exports.default = Store;
