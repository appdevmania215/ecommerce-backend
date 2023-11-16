"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const objectId = mongoose_1.default.Types.ObjectId;
const productSchema = new mongoose_1.default.Schema({
    owner: {
        type: objectId,
        required: [true, "This is required"],
        ref: "Store",
    },
    photo: [
        {
            type: String,
            required: true,
        },
    ],
    title: {
        type: String,
        required: true,
        minLength: [4, "Must be a least Six Characters"],
    },
    description: {
        type: String,
        required: true,
        minLength: [5, "Must be at least 5 characters "],
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
    discount: {
        type: Number,
    },
    currency: {
        type: String,
    },
    quantity: {
        type: Number,
        required: true,
    },
    weight: {
        type: String,
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
    global: {
        type: Boolean,
        default: true,
    },
    productUpdatedDate: {
        type: Date,
    },
    hot: {
        type: Boolean,
    },
    active: {
        type: Boolean,
        default: true,
    },
    publish: {
        type: Boolean,
        default: true,
    },
    view: {
        type: Number,
    },
    variants: [
        {
            variant: {
                type: String,
            },
            option: {
                type: String,
            },
            stock: {
                type: Number,
            },
            price: {
                type: Number,
            },
        },
    ],
    ratingId: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "Rating",
    },
    orders: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});
productSchema.virtual("store", {
    ref: "Store",
    localField: "owner",
    foreignField: "_id",
});
productSchema.virtual("categories", {
    ref: "Category",
    localField: "category",
    foreignField: "_id",
});
// productSchema.pre('save', async function (next, opts){
//     const product = this;
//     if (product.isModified('price')){
//         product.price =   Number(product.price.toFixed(2))
//     }
//     next()
// })
const Product = mongoose_1.default.model("product", productSchema);
exports.default = Product;
