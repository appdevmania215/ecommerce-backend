"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const sellerSchema = new mongoose_1.default.Schema({
    account: {
        type: String,
        required: true,
        trim: true,
    },
    location: {
        type: String,
    },
    documentType: {
        type: String,
        required: true,
    },
    documentId: {
        type: String,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isPausedPayout: {
        type: Boolean,
        default: false,
    },
    owner: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "user",
        required: true,
        unique: true,
    },
    dob: {
        type: Date,
    },
    gender: {
        type: String,
    },
    // country: {
    //     type : String
    // },
    package: {
        type: String,
    },
    documentCountry: {
        type: String,
    },
    file: {
        type: String,
        required: true,
    },
    storeId: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "Store",
    },
    endDate: {
        type: Date,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    deleted: {
        type: Boolean,
        default: false,
    },
    accId: {
        type: String,
        default: null,
    },
    paypal: {
        type: String,
        default: null,
    },
    websiteUrl: {
        type: String,
    },
    followers: [String],
    subId: {
        type: String,
        trim: true,
    },
}, {
    timestamps: true,
});
sellerSchema.virtual("store", {
    ref: "Store",
    localField: "storeId",
    foreignField: "_id",
});
const Seller = mongoose_1.default.model("seller", sellerSchema);
exports.default = Seller;
