"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Category_1 = __importDefault(require("../Models/Category"));
const cloudinary_1 = __importDefault(require("cloudinary"));
const Product_1 = __importDefault(require("../Models/Product"));
const mongodb_1 = require("mongodb");
const Store_1 = __importDefault(require("../Models/Store"));
const Seller_1 = __importDefault(require("../Models/Seller"));
const TimeDiff_1 = require("../Helpers/TimeDiff");
const Order_1 = __importDefault(require("../Models/Order"));
const router = express_1.default.Router();
cloudinary_1.default.v2.config({
    cloud_name: process.env.CLOUDNAME,
    api_key: process.env.CLOUDAPI,
    api_secret: process.env.CLOUDSECRET,
});
router.post("/category", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const category = new Category_1.default(req.body);
        yield category.save();
        res.status(201).send(category);
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
router.patch("/category/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _id = req.params.id;
        const updates = Object.keys(req.body);
        const allowedUpdates = ["subcategories", "title", "link"];
        const isAllowed = updates.every((update) => allowedUpdates.includes(update));
        if (!isAllowed)
            return res.status(400).send({ message: "Invalid Update" });
        const category = yield Category_1.default.findById(_id);
        if (!category)
            return res.status(400).send({ message: "Category does not exist" });
        updates.forEach((update) => (category[update] = req.body[update]));
        yield category.save();
        res.status(200).send(category);
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
router.get("/categories", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield Category_1.default.find({}).sort({ title: 1 });
        res.status(200).send(categories);
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
router.get("/topcategory", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const lastWeek = (0, TimeDiff_1.getLastweek)(7);
    let productPlaceholder = [];
    try {
        //qurery
        const query = {
            createdAt: { $gte: lastWeek },
        };
        // Grouping pipeline
        const groupingPipeline = [
            {
                $match: query,
            },
            {
                $group: {
                    _id: "$productId",
                    totalQuantity: { $sum: "$quantity" },
                    totalPrice: { $sum: "$price" },
                },
            },
            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "_id",
                    as: "product",
                },
            },
            {
                $unwind: "$product",
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "product.category",
                    foreignField: "_id",
                    as: "category",
                },
            },
            {
                $unwind: "$category",
            },
            {
                $project: {
                    _id: 0,
                    category: 1,
                    totalQuantity: 1,
                },
            },
        ];
        const ordersForTheWeek = yield Order_1.default.aggregate(groupingPipeline);
        ordersForTheWeek.sort((a, b) => b.totalQuantity - a.totalQuantity);
        const top5Categories = [];
        for (const orders of ordersForTheWeek) {
            const categoryExist = top5Categories.find((cat) => cat.category._id.toString() === orders.category._id.toString());
            if (!categoryExist && top5Categories.length < 5) {
                top5Categories.push(orders);
            }
        }
        res.status(200).send(top5Categories);
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
router.get("/categories", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const category = yield Category_1.default.find({});
        res.status(200).send(category);
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
router.get("/topcategory", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const lastWeek = (0, TimeDiff_1.getLastweek)(7);
    let productPlaceholder = [];
    try {
        const products = yield Product_1.default.find({
            createdAt: {
                $gte: lastWeek,
                $lte: Date.now(),
            },
            orders: {
                $gt: 1,
            },
        })
            .populate({
            path: "category",
            model: Category_1.default,
        })
            .sort({
            orders: -1,
        })
            .limit(20);
        let productLength = products.length;
        for (productLength; productLength--;) {
            if (products[productLength].orders > 0) {
                const isExisting = productPlaceholder.find((x) => { var _a, _b; return ((_a = x.category) === null || _a === void 0 ? void 0 : _a._id) === ((_b = products[productLength].category) === null || _b === void 0 ? void 0 : _b._id); });
                if (isExisting)
                    continue;
                productPlaceholder.push(products[productLength]);
            }
        }
        res.status(200).send(productPlaceholder);
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
router.get("/category/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const category = yield Category_1.default.findById(id);
        const cat_id = new mongodb_1.ObjectId(id);
        const products = yield Product_1.default.find({ category: cat_id, active: true, publish: true, quantity: { $gt: 0 } })
            .populate({
            path: "owner",
            model: Store_1.default,
            populate: {
                path: "owner",
                model: Seller_1.default,
            },
        })
            .populate("ratingId");
        if (!category) {
            return res.status(404).send();
        }
        res.status(200).send({ category, products });
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
router.delete("/category/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield Category_1.default.findByIdAndDelete(id);
        res.status(200).send();
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
exports.default = router;
