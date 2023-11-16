"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const objectId = mongoose_1.default.Types.ObjectId;
const templateSchema = new mongoose_1.default.Schema({
    owner: {
        type: objectId,
        required: [true, "This is required"],
        ref: "Store",
    },
    title: {
        type: String,
        required: true,
        minLength: [4, "Must be a least 4 Characters"],
    },
    template_title: {
        type: String,
        required: true,
        minLength: [4, "Must be a least 4 Characters"],
    },
    category: {
        type: mongoose_1.default.Types.ObjectId,
        required: true,
        ref: "Category",
    },
    subcategory: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    condition: {
        type: String,
        default: "New",
        required: true,
    },
    currency: {
        type: String,
    },
    quantity: {
        type: Number,
        required: true,
    },
    tags: [
        {
            type: String,
        },
    ],
    instruction: {
        type: String,
    },
    shippingDetail: {
        type: String,
    },
    shipping: [
        {
            express: {
                price: Number,
                country: String,
            },
            standard: {
                price: Number,
                country: String,
            },
        },
    ],
    continents: [
        {
            africa: Number,
            asia: Number,
            europe: Number,
            northAmerica: Number,
            southAmerica: Number,
            oceania: Number,
            antarctica: Number,
        },
    ],
    active: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});
templateSchema.virtual("store", {
    ref: "Store",
    localField: "owner",
    foreignField: "_id",
});
templateSchema.virtual("categories", {
    ref: "Category",
    localField: "category",
    foreignField: "_id",
});
const Template = mongoose_1.default.model("template", templateSchema);
exports.default = Template;
