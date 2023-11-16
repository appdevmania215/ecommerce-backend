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
const Product_1 = __importDefault(require("../Models/Product"));
const mongodb_1 = require("mongodb");
const Category_1 = __importDefault(require("../Models/Category"));
const Store_1 = __importDefault(require("../Models/Store"));
const auth_1 = require("../Middleware/auth");
const Seller_1 = __importDefault(require("../Models/Seller"));
const Ads_1 = __importDefault(require("../Models/Ads"));
const Rating_1 = __importDefault(require("../Models/Rating"));
const router = express_1.default.Router();
router.get("/product/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params;
    try {
        const product = yield Product_1.default.findById(new mongodb_1.ObjectId(id)).populate({
            path: "owner",
            model: Store_1.default,
            populate: {
                path: "owner",
                model: Seller_1.default,
            },
        });
        if (!product) {
            return res.status(404).send();
        }
        const mProducts = yield Product_1.default.find({
            active: true,
            publish: true,
            _id: { $ne: product._id },
            owner: product.owner,
            createdAt: { $lt: new Date(product.createdAt) }
        })
            .sort({ createdAt: "desc" })
            .populate([{
                path: "owner",
                model: Store_1.default,
                populate: {
                    path: "owner",
                    model: Seller_1.default,
                },
            },
            {
                path: "ratingId",
                model: Rating_1.default,
            },])
            .limit(3);
        const sProducts = yield Product_1.default.find({
            active: true,
            publish: true,
            subcategory: product.subcategory,
            _id: { $ne: product._id },
            createdAt: { $lt: new Date(product.createdAt) }
        })
            .sort({ createdAt: "desc" })
            .populate("ratingId")
            .populate([{
                path: "owner",
                model: Store_1.default,
                populate: {
                    path: "owner",
                    model: Seller_1.default,
                },
            },
            {
                path: "ratingId",
                model: Rating_1.default,
            },])
            .limit(3);
        const aProducts = yield Ads_1.default.find({ productId: { $ne: product._id } })
            .sort({ createdAt: "desc" })
            .populate({
            path: "productId",
            model: Product_1.default,
            match: {
                active: true,
                publish: true,
                category: product.category,
                createdAt: { $lt: new Date(product.createdAt) }
            },
            populate: [
                {
                    path: "ratingId",
                    model: Rating_1.default,
                },
                {
                    path: "owner",
                    model: Store_1.default,
                    populate: {
                        path: "owner",
                        model: Seller_1.default,
                    },
                },
            ],
        });
        let ttt = aProducts.filter((ad) => ad.productId);
        res.status(200).send({ product, mProducts, sProducts, aProducts: ttt });
    }
    catch (e) {
        console.log(e);
        res.status(401).send(e);
    }
}));
router.get("/store/product", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.query;
    try {
        const store = yield Store_1.default.findOne({ name });
        if (!store) {
            return res.status(402).send("Not found");
        }
        const products = yield Product_1.default.find({ owner: store.owner, active: true, publish: true, });
        res.status(200).send(products);
    }
    catch (e) {
        res.status(402).send(e);
    }
}));
router.patch("/product/:id", auth_1.sellerAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let data = req.body;
    if (req.body.category) {
        const category = yield Category_1.default.findOne({ title: req.body.category });
        data.category = category._id;
    }
    const updates = Object.keys(req.body);
    const existingUpdate = [
        "tags",
        "photo",
        "title",
        "description",
        "category",
        "subcategory",
        "instruction",
        "global",
        "shipping",
        "variants",
        "weight",
        "quantity",
        "care",
        "shippingDetails",
        "price",
    ];
    // const isPhoto : boolean =  updates.includes('photo');
    const isAllowed = updates.every((update) => existingUpdate.includes(update));
    if (!isAllowed) {
        return res.status(401).send("Invalid Updates");
    }
    const _id = req.params.id;
    try {
        const store = yield Store_1.default.findOne({
            owner: req.seller._id,
        });
        if (!store)
            return res.status(404).send("Store does not exist");
        const product = yield Product_1.default.findOne({
            owner: store._id,
            _id,
        });
        if (!product) {
            return res.status(401).send("Product does not exist");
        }
        const isPrice = updates.includes("price");
        const price = req.body.price;
        if (isPrice && price < product.price) {
            const oldPrice = product.price;
            const priceDiff = oldPrice - price;
            product.discount = Number(((priceDiff / oldPrice) * 100).toFixed(0));
            const date = new Date();
            product.hot = true;
            product.productUpdatedDate = date;
        }
        // const uploader  = async (path : string) => await cloudinary.v2.uploader.upload(path)
        // const index1 = updates.indexOf('photo')
        // if (isPhoto) {
        //     const photo : string[] = [];
        //     const images: string [] = req.body.photo
        //     for (const image of images) {
        //         const response : cloudinary.UploadApiResponse = await uploader(image)
        //         photo.push(response.secure_url)
        //     }
        //     updates.forEach((update, index) => index !== index1 ? (product as any)[update] : product!.photo = index !== index1 ? req.body[update] : photo);
        //     await product!.save()
        //     return     res.status(200).send(product)
        // }
        updates.forEach((update) => (product[update] = data[update]));
        yield product.save();
        res.status(200).send(product);
    }
    catch (e) {
        console.log(e);
        res.status(400).send(e);
    }
}));
router.get("/hotdeals", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hotdeals = yield Product_1.default.find({
            hot: true,
            active: true,
            publish: true,
            quantity: { $ne: 0 },
        })
            .populate({
            path: "owner",
            model: Store_1.default,
            populate: {
                path: "owner",
                model: Seller_1.default,
            },
        })
            .populate("ratingId")
            .sort({ createdAt: "desc" });
        res.status(200).send(hotdeals);
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
router.get("/search/product", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const term = req.query.term;
    const id = req.query.id;
    const tag = req.query.tag;
    try {
        const ads = yield Ads_1.default.find({
            title: { $regex: term, $options: "i" },
        })
            .populate({
            path: "productId",
            model: Product_1.default,
            match: Object.assign(Object.assign({ active: true, publish: true }, (id ? { category: new mongodb_1.ObjectId(id) } : {})), (tag ? { tags: { $in: tag } } : {})),
            populate: [
                {
                    path: "ratingId",
                    model: Rating_1.default,
                },
                {
                    path: "owner",
                    model: Store_1.default,
                    populate: {
                        path: "owner",
                        model: Seller_1.default,
                    },
                },
            ],
        })
            .limit(5);
        const products = yield Product_1.default.find(Object.assign(Object.assign({ title: { $regex: term, $options: "i" }, active: true, publish: true }, (id ? { category: new mongodb_1.ObjectId(id) } : {})), (tag ? { tags: { $in: tag } } : {})))
            .populate("ratingId")
            .populate({
            path: "owner",
            model: Store_1.default,
            populate: {
                path: "owner",
                model: Seller_1.default,
            },
        });
        const relatedProduct = yield Product_1.default.find(Object.assign(Object.assign({ active: true, publish: true }, (id ? { category: new mongodb_1.ObjectId(id) } : {})), (tag ? { tags: { $in: tag } } : {})))
            .populate("ratingId")
            .populate({
            path: "owner",
            model: Store_1.default,
            populate: {
                path: "owner",
                model: Seller_1.default,
            },
        });
        const relatedItem = [];
        for (const related of relatedProduct) {
            const { tags } = related;
            const termVarialbe = term;
            if (tags === null || tags === void 0 ? void 0 : tags.includes(termVarialbe.toLowerCase())) {
                relatedItem.push(related);
            }
        }
        res.status(200).send({ products, relatedItem, ads });
    }
    catch (e) {
        console.log(e);
        res.status(400).send(e);
    }
}));
router.get("/product", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const sort = query === "new";
    try {
        const product = yield Product_1.default.find({ active: true, publish: true, })
            .sort("desc")
            .limit(sort ? 8 : 100);
        res.status(200).send(product);
    }
    catch (e) {
        res.status(401).send(e);
    }
}));
router.get("/brands/products", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield Product_1.default.find({ active: true, publish: true, })
            .populate({
            path: "owner",
            model: Store_1.default,
            match: {
                account: "business",
            },
        })
            .exec();
        res.status(200).send(products);
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
router.get("/topProducts", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield Product_1.default.find({ active: true, publish: true, })
            .sort({ orders: -1 })
            .populate({
            path: "owner",
            model: Store_1.default,
            populate: {
                path: "owner",
                model: Seller_1.default,
            },
        })
            .populate("ratingId")
            .sort({ createdAt: "desc" })
            .limit(12);
        res.status(200).send(products);
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
router.get("/products", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productsFind = yield Product_1.default.find({ active: true, publish: true, })
            .where("quantity")
            .gt(0)
            .populate({
            path: "owner",
            model: Store_1.default,
            populate: {
                path: "owner",
                model: Seller_1.default,
            },
        })
            .populate("ratingId")
            .sort({ createdAt: "desc" })
            .limit(12);
        // let products : IProduct[] = [];
        // let i = productsFind.length
        // for (i; i--;){
        //     if (productsFind[i].ratingId){
        //         const product : IProduct  =  await productsFind[i].populate('ratingId');
        //         products.push(product)
        //     }else {
        //         products.push(productsFind[i])
        //     }
        // }
        res.status(200).send(productsFind);
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
router.get("/product/reviews/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params;
    try {
        const review = yield Rating_1.default.find({
            productId: new mongodb_1.ObjectId(id),
        });
        res.status(200).send(review);
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
exports.default = router;
