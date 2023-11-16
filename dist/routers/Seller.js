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
const mongoose_1 = __importDefault(require("mongoose"));
const express_1 = __importDefault(require("express"));
const Seller_1 = __importDefault(require("../Models/Seller"));
const Store_1 = __importDefault(require("../Models/Store"));
const auth_1 = require("../Middleware/auth");
const cloudinary_1 = __importDefault(require("cloudinary"));
const mongodb_1 = require("mongodb");
const Product_1 = __importDefault(require("../Models/Product"));
const Template_1 = __importDefault(require("../Models/Template"));
const Order_1 = __importDefault(require("../Models/Order"));
const InvoiceDownload_1 = __importDefault(require("../Models/InvoiceDownload"));
const Refund_1 = __importDefault(require("../Models/Refund"));
const Rating_1 = __importDefault(require("../Models/Rating"));
const RequestFile_1 = __importDefault(require("../Models/RequestFile"));
const helpers_1 = require("../Helpers/helpers");
const data_1 = require("../Data/data");
const app_1 = require("../app");
const verifyUser_1 = require("../Helpers/verifyUser");
const Category_1 = __importDefault(require("../Models/Category"));
const Ads_1 = __importDefault(require("../Models/Ads"));
const constants_1 = require("../Helpers/constants");
const baseUrl_1 = __importDefault(require("../baseurl/baseUrl"));
const User_1 = __importDefault(require("../Models/User"));
const Activity_1 = __importDefault(require("../Models/Activity"));
const Address_1 = __importDefault(require("../Models/Address"));
const TimeDiff_1 = require("../Helpers/TimeDiff");
const walletEntry_1 = require("../components/wallet/models/walletEntry");
const socket_1 = require("../socket");
const types_1 = require("../socket/types");
const Notication_1 = __importDefault(require("../Models/Notication"));
const router = express_1.default.Router();
cloudinary_1.default.v2.config({
    cloud_name: process.env.CLOUDNAME,
    api_key: process.env.CLOUDAPI,
    api_secret: process.env.CLOUDSECRET,
});
router.post("/seller", auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const owner = req.user._id;
    try {
        // const response : cloudinary.UploadApiResponse =  await cloudinary.v2.uploader.upload(data.image);
        // const file : string = response.secure_url;
        const seller = new Seller_1.default(Object.assign(Object.assign({}, req.body), { owner }));
        yield seller.save();
        req.user.sellerId = seller._id;
        req.user.save();
        res.status(201).send(seller);
    }
    catch (e) {
        res.status(403).send(e);
    }
}));
router.post("/seller/test", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = {
        image: req.body.image,
    };
    try {
        const response = yield cloudinary_1.default.v2.uploader.upload(data.image);
        res.status(200).send(response);
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
router.post("/seller/reverify", auth_1.sellerAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { file, type } = req.body;
    try {
        req.seller.file = file;
        req.seller.documentType = type;
        yield req.seller.save();
        res.status(200).send();
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
router.get("/seller/store", auth_1.sellerAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const packages = req.seller.package;
        const store = data_1.storePlan.find((data) => data.plan === packages.toLowerCase());
        const limit = store ? store.limit : 0;
        const categories = yield Category_1.default.find({});
        res.status(200).send({ limit, categories });
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
router.get("/seller/sub", auth_1.sellerAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const subId = req.seller.subId;
    try {
        if (req.seller.package !== "free") {
            const subscriptionDetails = yield app_1.stripe.subscriptions.retrieve(subId);
            return res
                .status(200)
                .send({ endDate: subscriptionDetails.current_period_end });
        }
        res.status(200).send();
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
router.post("/store", auth_1.sellerAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const data = {
    //     image:    req.body.logo
    // };
    const owner = req.seller._id;
    // const categories: string[] = req.body.categories;
    const plan = req.seller.package;
    const limit = data_1.storePlan.find((data) => data.plan === plan.toLowerCase());
    // if (categories.length > limit!.limit) {
    //     return res.status(401).send({status: 'You need to upgrade your account inorder to post more'})
    // }
    // const restricted: boolean = categories.every(datas => limit!.restriction.includes(datas));
    // if (restricted) {
    //     return res.status(400).send({status: 'You are not allowed to use the category, pls upgrade'})
    // }
    try {
        // const response : cloudinary.UploadApiResponse    = await cloudinary.v2.uploader.upload(data.image);
        // const logo = response.secure_url;
        if (req.seller.storeId) {
            const findExisting = yield Store_1.default.findOne({ owner: req.seller._id });
            if (findExisting) {
                const updates = Object.keys(req.body);
                const existingData = [
                    "name",
                    "summary",
                    "logo",
                    "currency",
                    "location",
                ];
                const isAllowed = updates.every((update) => existingData.includes(update));
                if (!isAllowed) {
                    return res.status(400).send("Invalid updates");
                }
                updates.forEach((update) => (findExisting[update] = req.body[update]));
                yield findExisting.save();
                return res.status(200).send(findExisting);
            }
        }
        const store = new Store_1.default(Object.assign(Object.assign({}, req.body), { isVerified: req.seller.isVerified, owner, account: req.seller.account }));
        yield store.save();
        req.seller.storeId = store.id;
        yield req.seller.save();
        return res.status(201).send(store);
    }
    catch (e) {
        return res.status(500).send(e);
    }
}));
router.delete("/store/delete/:id", auth_1.sellerAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params;
    try {
        const existingSeller = yield Store_1.default.findOne({
            _id: new mongodb_1.ObjectId(id),
            owner: req.seller._id,
        });
        if (!existingSeller) {
            return res.status(401).send("Not found");
        }
        const deletedStore = yield Store_1.default.findByIdAndDelete(existingSeller._id);
        const deleteProducts = yield Product_1.default.deleteMany({
            ownerId: deletedStore._id,
        });
        res.status(200).send(deletedStore);
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
router.patch("/store/update", auth_1.sellerAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const updates = Object.keys(req.body);
    const existingData = ["name", "summary", "logo", "currency", "location"];
    const isAllowed = updates.every((update) => existingData.includes(update));
    if (!isAllowed) {
        return res.status(400).send("Invalid updates");
    }
    try {
        const findExisting = yield Store_1.default.findOne({ owner: req.seller._id });
        // const isUpdatingLogo = updates.includes('logo');
        if (!findExisting) {
            return res.status(403).send("No result found");
        }
        updates.forEach((update) => (findExisting[update] = req.body[update]));
        yield findExisting.save();
        res.status(200).send(findExisting);
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
router.patch("/seller/order/:id", auth_1.sellerAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _id = req.params.id;
    const status = req.body.status;
    const updates = Object.keys(req.body);
    const existing = [
        "name",
        "status",
        "id",
        "trackingId",
        "price",
        "shippingProvider",
        "quantity",
    ];
    try {
        const isAllowed = updates.every((update) => existing.includes(update));
        if (!isAllowed) {
            return res.status(401).send({ status: "Invalid update" });
        }
        const store = yield Store_1.default.findOne({ owner: req.seller._id });
        if (!store)
            return res.status(404).send({ body: "Store does not exist" });
        const order = yield Order_1.default.findOne({
            sellerId: store._id,
            _id,
        });
        if (!order) {
            return res.status(401).send({ status: "Order does not exist" });
        }
        if (!order.active) {
            if (order.shipping == "Express") {
                return res.status(401).send({
                    status: "Sorry you have to wait until 2hour before you can update",
                });
            }
            else {
                return res.status(401).send({
                    status: "Sorry you have to wait until 1hour before you can update",
                });
            }
        }
        if (status === "processed" && !order.updated) {
            const timestamp = Date.now();
            order.updateShipping = new Date(timestamp);
            order.updated = true;
        }
        updates.forEach((update) => (order[update] = req.body[update]));
        yield order.save();
        yield (0, helpers_1.extractDataForOrdersUpdate)(order);
        const newNotification = new Notication_1.default({
            from: req.seller._id,
            to: new mongodb_1.ObjectId(order.userId),
            senderRole: "SELLER",
            title: "Order Notification",
            content: `Your order has been shipped by ${store.name}`,
            isRead: false,
            sellerId: req.seller._id,
        });
        yield newNotification.save();
        (0, socket_1.sendNotification)(types_1.NOTIFICATION_TARGET.SELLER, newNotification, order.userId.toString());
        res.status(200).send(order);
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
router.patch("/seller/:id", auth_1.sellerAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _id = req.params.id;
    const updates = Object.keys(req.body);
    const existing = [
        "account",
        "location",
        "documentType",
        "documentId",
        "documentCountry",
        "gender",
        "dob",
        "package",
        "file",
        "isVerified",
    ];
    try {
        const isAllowed = updates.every((update) => existing.includes(update));
        if (!isAllowed) {
            return res.status(401).send("Invalid Updates");
        }
        updates.forEach((update) => (req.seller[update] = req.body[update]));
        yield req.seller.save();
        res.status(200).send(req.seller);
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
router.get("/store/me", auth_1.sellerAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const findMyStore = yield Store_1.default.findOne({ owner: req.seller._id });
        if (findMyStore) {
            return res.status(200).send(findMyStore);
        }
        res.status(403).send("Not found");
    }
    catch (e) {
        res.status(403).send(e);
    }
}));
const packages = [
    {
        name: "free",
        limit: 150,
    },
    {
        name: "Premium",
        limit: 10000000,
    },
];
router.post("/seller/product", auth_1.activeSeller, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const plan = packages.find((packageItem) => packageItem.name.toLowerCase() === req.seller.package.toLowerCase());
        const date = (0, TimeDiff_1.getLastweek)(28);
        const store = yield Store_1.default.findOne({
            owner: req.seller._id,
        });
        if (!store) {
            return res.status(403).send("Sorry you dont have a store");
        }
        if (!req.seller.isActive) {
            return res
                .status(400)
                .send("Sorry you need to re upload your document");
        }
        const limit = yield Product_1.default.find({
            owner: store._id,
            createdAt: {
                $gte: date,
                $lte: Date.now(),
            },
        });
        if (limit.length >= plan.limit) {
            return res
                .status(400)
                .send("You need to upgrade in order to post more");
        }
        store.listing = store.listing + 1;
        yield store.save();
        const category = yield Category_1.default.findOne({ title: req.body.category });
        const product = new Product_1.default(Object.assign(Object.assign({}, req.body), { category: category._id, owner: store === null || store === void 0 ? void 0 : store._id }));
        product.save();
        res.status(200).send(product);
    }
    catch (e) {
        console.log(e);
        res.status(401).send(e);
    }
}));
router.get("/store/me/products", auth_1.sellerAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const store = yield Store_1.default.findOne({ owner: req.seller._id });
        const products = yield Product_1.default.find({ owner: store._id })
            .populate({
            path: "category",
            model: Category_1.default,
        })
            .populate("ratingId")
            .sort("desc");
        res.status(200).send(products);
    }
    catch (e) {
        res.status(400).send(e);
    }
}));
router.get("/seller/funds", auth_1.sellerAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const seller = yield Seller_1.default.findOne({
            _id: req.seller._id,
        });
        if (!seller || !(seller === null || seller === void 0 ? void 0 : seller.storeId))
            res.status(403).send("There is no store for this seller");
        const pending = yield walletEntry_1.WalletEntry.find({ ownerId: seller === null || seller === void 0 ? void 0 : seller.storeId });
        let pendingSum = 0;
        let balance = 0;
        for (let i = 0; i < pending.length; i++) {
            if (((_a = pending[i]) === null || _a === void 0 ? void 0 : _a.status) === "PENDING") {
                pendingSum = pendingSum + ((_b = pending[i]) === null || _b === void 0 ? void 0 : _b.amountDue);
            }
            if (pending[i].status == "PROCESSED") {
                balance = balance + ((_c = pending[i]) === null || _c === void 0 ? void 0 : _c.amountDue);
            }
        }
        res.status(200).send({
            pendingPayout: pendingSum !== null && pendingSum !== void 0 ? pendingSum : 0,
            availablePayout: balance !== null && balance !== void 0 ? balance : 0,
        });
    }
    catch (error) {
        res.status(400).send(error);
    }
}));
router.get("/seller/storeExpense", auth_1.sellerAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const seller = yield Seller_1.default.findOne({
            _id: req.seller._id,
        });
        if (!seller || !(seller === null || seller === void 0 ? void 0 : seller.storeId))
            res.status(403).send("There is no store for this seller");
        const wallet = yield walletEntry_1.WalletEntry.find({ ownerId: seller === null || seller === void 0 ? void 0 : seller.storeId })
            .sort({ updatedAt: "asc" })
            .populate({
            path: "orderId",
            model: Order_1.default,
            populate: [
                {
                    path: "productId",
                    model: Product_1.default,
                },
            ],
        });
        res.status(200).send(wallet);
    }
    catch (error) {
        res.status(400).send(error);
    }
}));
router.get("/seller/orders", auth_1.sellerAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const status = req.query.status;
    try {
        const store = yield Store_1.default.findOne({
            owner: req.seller._id,
        });
        const orders = yield Order_1.default.find({
            sellerId: store._id,
            status,
        })
            .sort({ updatedAt: "asc" })
            .populate({
            path: "productId",
            model: Product_1.default,
            populate: [
                {
                    path: "owner",
                    model: Store_1.default,
                },
            ],
        })
            .populate({
            path: "userId",
            model: User_1.default,
        });
        if (orders.length === 0) {
            return res.status(200).send("No Orders");
        }
        const newOrders = [];
        let orderLength = orders.length;
        for (orderLength; orderLength--;) {
            const addressId = orders[orderLength].address;
            const address = yield Address_1.default.findById(addressId);
            const newData = {
                order: orders[orderLength],
                address,
            };
            newOrders.push(newData);
        }
        res.status(200).send(newOrders);
    }
    catch (e) {
        res.status(400).send(e);
    }
}));
router.post("/seller/invoice/download", auth_1.sellerAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { order } = req.body;
    try {
        const invoiceData = { userId: req.seller._id, orderId: order._id };
        const seller = yield Seller_1.default.findOne({ _id: req.seller._id });
        if ((seller === null || seller === void 0 ? void 0 : seller.package) === "Premium") {
            res.status(200).send({ downloadable: true });
        }
        else {
            const invoiceCheck = yield InvoiceDownload_1.default.findOne(invoiceData);
            if (invoiceCheck) {
                res.status(200).send({ downloadable: true });
            }
            else {
                const allInvoices = yield InvoiceDownload_1.default.find({
                    userId: req.seller._id,
                });
                if (allInvoices.length >= 5) {
                    return res.status(200).send({ downloadable: false });
                }
                else {
                    const invoice = new InvoiceDownload_1.default(invoiceData);
                    yield invoice.save();
                }
            }
        }
    }
    catch (e) {
        res.status(400).send(e);
    }
}));
router.get("/seller/orders/shipped", auth_1.sellerAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const store = yield Store_1.default.findOne({
            owner: req.seller._id,
        });
        const orders = yield Order_1.default.find({ sellerId: store._id })
            .or([
            { status: "shipped" },
            { status: "delivered" },
            { status: "cancelled" },
        ])
            .populate({
            path: "productId",
            model: Product_1.default,
        })
            .populate({
            path: "userId",
            model: User_1.default,
        });
        if (orders.length === 0) {
            return res.status(200).send("No Orders");
        }
        const newOrders = [];
        let orderLength = orders.length;
        for (orderLength; orderLength--;) {
            const { userId } = orders[orderLength];
            const address = yield Address_1.default.findOne({ userId });
            const data = {
                order: orders[orderLength],
                address,
            };
            newOrders.push(data);
        }
        res.status(200).send(newOrders);
    }
    catch (e) {
        res.status(400).send(e);
    }
}));
router.get("/seller/orders/cancelled", auth_1.sellerAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const store = yield Store_1.default.findOne({
            owner: req.seller._id,
        });
        const orders = yield Order_1.default.find({ sellerId: store._id })
            .or([{ status: "cancelled" }, { status: "processed" }])
            .populate({
            path: "productId",
            model: Product_1.default,
        })
            .populate({
            path: "userId",
            model: User_1.default,
        });
        if (orders.length === 0) {
            return res.status(200).send("No Orders");
        }
        const newOrders = [];
        let orderLength = orders.length;
        for (orderLength; orderLength--;) {
            const { userId } = orders[orderLength];
            const address = yield Address_1.default.findOne({ userId });
            const newData = {
                order: orders[orderLength],
                address,
            };
            newOrders.push(newData);
        }
        res.status(200).send(newOrders);
    }
    catch (e) {
        res.status(400).send(e);
    }
}));
router.delete("/seller/order/:id", auth_1.sellerAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _id = req.params.id;
    try {
        const order = yield Order_1.default.deleteOne({ sellerId: req.seller._id, _id });
        res.status(200).send(order);
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
router.get("/seller/products", auth_1.sellerAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const owner = req.seller._id;
    try {
        const products = yield Product_1.default.find({ owner }).sort("desc");
        res.status(200).send(products);
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
router.get("/seller/store/stat", auth_1.sellerAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const sellerId = req.seller._id;
    const owner = req.seller._id;
    try {
        const store = yield Store_1.default.findOne({ owner });
        const seller = yield Seller_1.default.findOne({ _id: owner });
        const products = yield Product_1.default.find({ owner: store._id });
        const totalProducts = products.length;
        const totalVisitors = store === null || store === void 0 ? void 0 : store.views;
        const orders = yield Order_1.default.find({ sellerId: store === null || store === void 0 ? void 0 : store._id }).or([
            { status: "shipped" },
            { status: "delivered" },
            { status: "processed" },
        ]);
        const totalSales = (0, helpers_1.getTotalSales)(orders);
        const totalPrice = (0, helpers_1.getTotalShippingPrice)(orders);
        const totalOrder = yield Order_1.default.find({
            sellerId: store === null || store === void 0 ? void 0 : store._id,
            status: "placed",
        });
        const totalExpenses = store === null || store === void 0 ? void 0 : store.expenses;
        res.status(200).send({
            totalVisitors,
            totalProducts,
            followersCount: (seller === null || seller === void 0 ? void 0 : seller.followers.length) || 0,
            totalSales: totalPrice + totalSales,
            totalExpenses,
            totalOrders: totalOrder.length,
            orders,
        });
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
router.get("/seller/refunds", auth_1.sellerAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const store = yield Store_1.default.findOne({ owner: req.seller._id });
        if (!store)
            return res.status(404).send([]);
        const refund = yield Refund_1.default.find({
            storeId: store._id,
        }).populate([{
                model: Product_1.default,
                path: "productId",
                populate: {
                    path: "owner",
                    model: Store_1.default,
                    populate: {
                        path: "owner",
                        model: Seller_1.default,
                    },
                }
            }, {
                model: User_1.default,
                path: "userId",
            }
        ]);
        res.status(200).send(refund);
    }
    catch (e) {
        res.status(400).send(e);
    }
}));
router.patch("/seller/refunds/status/:id", auth_1.sellerAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const status = req.body.status;
    const id = req.params.id;
    try {
        const refund = yield Refund_1.default.findById(id);
        if (!refund) {
            return res.status(404).send("Not Found");
        }
        refund.status = status;
        yield refund.save();
        res.status(200).send(refund);
    }
    catch (e) {
        res.status(400).send(e);
    }
}));
router.get("/seller/me", auth_1.sellerAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const countryList = [
        "australia",
        "canada",
        "mexico",
        "newZealand",
        "unitedStates"
    ];
    const seller = req.seller;
    let paymentMethod = [];
    if (seller != null && seller.isVerified) {
        if (seller.location && countryList.includes(seller.location)) {
            paymentMethod.push("paypal");
        }
        else {
            paymentMethod.push("paypal", "bank");
        }
    }
    res.status(200).send(req.seller);
}));
router.get("/seller/request", auth_1.sellerAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const request = yield RequestFile_1.default.findOne({
            sellerId: req.seller._id,
        }).sort("desc");
        res.status(200).send(request);
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
router.get("/store/unique-name", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const searchQuery = req.query.storename;
    const searchTerm = searchQuery.trim();
    const searchRegex = new RegExp(`^${searchTerm}$`, "i");
    try {
        const store = yield Store_1.default.findOne({ name: searchRegex });
        let exists;
        if (store) {
            exists = true;
        }
        else {
            exists = false;
        }
        res.status(200).send(exists);
    }
    catch (error) {
        res.status(500).send(error);
    }
}));
router.post("/seller/subscribe", auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { plan, type } = req.body;
    const customer = req.user.customer_id;
    try {
        if (plan !== "free") {
            const session = yield (0, helpers_1.createCheckoutSession)(customer, process.env.PREMIUMMONTHLY, type);
            req.user.plan = "Premium";
            req.user.payId = session === null || session === void 0 ? void 0 : session.id;
            yield req.user.save();
            return res.status(200).send(session);
        }
        req.user.plan = "free";
        req.user.role = "seller";
        const seller = yield Seller_1.default.findOne({
            owner: req.user._id,
        });
        if (!seller)
            return res.status(400).send();
        seller.isVerified = true;
        seller.package = "free";
        yield seller.save();
        (0, verifyUser_1.welcomeSellers)(req.user.phone, req.user.email, type);
        yield req.user.save();
        res.status(200).send({ type: "free" });
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
router.post("/seller/verify", auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { type } = req.body;
    try {
        const id = req.user.payId;
        const sessionDetails = yield app_1.stripe.checkout.sessions.retrieve(id);
        if (!sessionDetails) {
            return res.status(404).send();
        }
        if (sessionDetails.payment_status === "unpaid") {
            return res.status(403).send("You have not paid yet");
        }
        const subscriptionDetails = yield app_1.stripe.subscriptions.retrieve(sessionDetails.subscription);
        const endDate = new Date(subscriptionDetails.current_period_end * 1000);
        req.user.endDate = endDate;
        req.user.payId = null;
        req.user.role = "seller";
        req.user.subId = subscriptionDetails.id;
        req.user.save();
        (0, helpers_1.saveVerifiedSeller)(req.user._id, endDate, subscriptionDetails.id, req.user.plan);
        (0, verifyUser_1.welcomeSellers)(req.user.phone, req.user.email, type);
        res.status(200).send(subscriptionDetails);
    }
    catch (e) {
        res.status(403).send(e);
    }
}));
router.delete("/seller/cancel", auth_1.activeSeller, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const subscription = yield app_1.stripe.subscriptions.del(req.seller.subId);
        req.seller.package = "free";
        yield req.seller.save();
        res.status(200).send(subscription);
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
router.get("/seller/orders/delivered", auth_1.activeSeller, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const store = yield Store_1.default.findOne({
            owner: req.seller.id,
        });
        const orders = yield Order_1.default.find({
            sellerId: store._id,
            status: "delivered",
        });
        const length = orders.length;
        if (length > 0) {
            return res.status(200).send({ show: true });
        }
        res.status(200).send({ show: false });
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
router.get("/seller/activity", auth_1.activeSeller, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const store = yield Store_1.default.findOne({
            owner: req.seller._id,
        });
        const activity = yield Activity_1.default.find({
            sellerId: store._id,
        })
            .populate({
            path: "productId",
            model: Product_1.default,
        })
            .sort({ createdAt: "asc" });
        const totalBill = activity.reduce((a, b) => a + b.bill, 0);
        res.status(200).send({ activity, totalBill });
    }
    catch (e) {
        console.log(e);
        res.status(400).send(e);
    }
}));
router.get("/seller/loginlink", auth_1.activeSeller, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const link = yield app_1.stripe.accounts.createLoginLink(req.seller.accId);
        res.status(200).send(link);
    }
    catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
}));
router.get("/seller/check/payout", auth_1.sellerAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const account = yield app_1.stripe.accounts.retrieve(req.seller.accId);
        const requirements = account.requirements;
        const currentlyDue = requirements.currently_due;
        const errors = requirements.errors;
        if (currentlyDue.length === 0 && errors.length === 0) {
            res.status(200).send({ checked: true });
        }
        else {
            req.seller.accId = null;
            yield req.seller.save();
            res.status(200).send({ checked: false });
        }
    }
    catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
}));
router.post("/seller/add/paypal", auth_1.sellerAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const paypal = req.body.paypal;
        req.seller.paypal = paypal;
        yield req.seller.save();
        res.status(200).send({ paypal });
    }
    catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
}));
router.post("/seller/remove/paypal", auth_1.sellerAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.seller.paypal = null;
        yield req.seller.save();
        res.status(200).send();
    }
    catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
}));
router.get("/seller/onboard", auth_1.sellerAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d, _e;
    try {
        if (!req.seller.subId)
            return res.status(401).send();
        let country = "";
        if (((_d = req.seller) === null || _d === void 0 ? void 0 : _d.location) === "unitedKingdom") {
            country = "GB";
        }
        if (((_e = req.seller) === null || _e === void 0 ? void 0 : _e.location) === "unitedStates") {
            country = "US";
        }
        const countryLocation = constants_1.CountryCodes.find((x) => { var _a; return x.country.toLowerCase() === ((_a = req.seller) === null || _a === void 0 ? void 0 : _a.location.toLowerCase()); });
        country = countryLocation === null || countryLocation === void 0 ? void 0 : countryLocation.code;
        const account = yield app_1.stripe.accounts.create({
            country: country,
            type: "express",
            capabilities: {
                card_payments: { requested: true },
                transfers: { requested: true },
            },
            business_type: "individual",
            business_profile: {
                product_description: "A new Seller",
            },
        });
        if (account.id) {
            req.seller.accId = account.id;
            req.seller.save();
            const accountLink = yield app_1.stripe.accountLinks.create({
                account: account.id,
                refresh_url: `${baseUrl_1.default}/seller/expenses`,
                return_url: `${baseUrl_1.default}/seller`,
                type: "account_onboarding",
            });
            return res.status(200).send({ url: accountLink.url });
        }
        else {
            return res.status(403).send("Failed to connect to Strip");
        }
    }
    catch (e) {
        console.log(e);
        res.status(400).send(e);
    }
}));
router.delete("/seller/remove/onboarding", auth_1.sellerAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const accId = req.seller.accId;
    try {
        yield app_1.stripe.accounts.del(accId);
        req.seller.accId = null;
        yield req.seller.save();
        res.status(200).send();
    }
    catch (error) {
        res.status(500).send(error);
    }
}));
router.get("/seller/orders/weeklystats", auth_1.sellerAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const getYesterday = (0, TimeDiff_1.getLastweek)(0);
    const get2days = (0, TimeDiff_1.getLastweek)(1);
    const get3Days = (0, TimeDiff_1.getLastweek)(2);
    const get4Days = (0, TimeDiff_1.getLastweek)(3);
    const get5Days = (0, TimeDiff_1.getLastweek)(4);
    const get6Days = (0, TimeDiff_1.getLastweek)(5);
    const getLastWeek = (0, TimeDiff_1.getLastweek)(6);
    try {
        const store = yield Store_1.default.findOne({
            owner: req.seller._id,
        });
        const sellerId = store._id;
        const now = Date.now();
        const orderYesterday = yield (0, helpers_1.getOrdersRangeForSeller)(getYesterday, now, sellerId);
        const orderLast2Days = yield (0, helpers_1.getOrdersRangeForSeller)(get2days, getYesterday, sellerId);
        const orderLast3Days = yield (0, helpers_1.getOrdersRangeForSeller)(get3Days, get2days, sellerId);
        const orderLast4Days = yield (0, helpers_1.getOrdersRangeForSeller)(get4Days, get3Days, sellerId);
        const orderLast5Days = yield (0, helpers_1.getOrdersRangeForSeller)(get5Days, get4Days, sellerId);
        const orderLast6Days = yield (0, helpers_1.getOrdersRangeForSeller)(get6Days, get5Days, sellerId);
        const orderLast7Days = yield (0, helpers_1.getOrdersRangeForSeller)(getLastWeek, get6Days, sellerId);
        const day1 = (0, helpers_1.getTotalSales)(orderYesterday) + (0, helpers_1.getTotalShippingPrice)(orderYesterday);
        const day2 = (0, helpers_1.getTotalSales)(orderLast2Days) + (0, helpers_1.getTotalShippingPrice)(orderLast2Days);
        const day3 = (0, helpers_1.getTotalSales)(orderLast3Days) + (0, helpers_1.getTotalShippingPrice)(orderLast3Days);
        const day4 = (0, helpers_1.getTotalSales)(orderLast4Days) + (0, helpers_1.getTotalShippingPrice)(orderLast4Days);
        const day5 = (0, helpers_1.getTotalSales)(orderLast5Days) + (0, helpers_1.getTotalShippingPrice)(orderLast5Days);
        const day6 = (0, helpers_1.getTotalSales)(orderLast6Days) + (0, helpers_1.getTotalShippingPrice)(orderLast6Days);
        const day7 = (0, helpers_1.getTotalSales)(orderLast7Days) + (0, helpers_1.getTotalShippingPrice)(orderLast7Days);
        res.status(200).send({ day1, day2, day3, day4, day5, day6, day7 });
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
router.get("/store/reviews", auth_1.sellerAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let reviews = [];
        const store = yield Store_1.default.findOne({ owner: req.seller._id });
        const products = yield Product_1.default.find({ owner: store === null || store === void 0 ? void 0 : store._id }).sort("desc");
        for (const product of products) {
            const reviewForProduct = yield Rating_1.default.find({ productId: product._id });
            reviews.push(reviewForProduct);
        }
        res.status(200).send(reviews);
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
router.get("/store/products", auth_1.sellerAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const store = yield Store_1.default.findOne({
            owner: req.seller._id,
        });
        if (!store) {
            return res.status(400).send("Store does not exist");
        }
        const products = yield Product_1.default.find({ owner: store._id })
            .populate({
            path: "category",
            model: Category_1.default,
        })
            .populate("ratingId")
            .sort({ orders: -1 });
        res.status(200).send(products);
    }
    catch (e) {
        console.log(e);
        res.status(400).send(e);
    }
}));
router.patch("/seller/product/active/:id", auth_1.sellerAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const product = yield Product_1.default.findById(id);
        product.active = !product.active;
        yield product.save();
        res.status(200).send(product);
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
router.post("/seller/products", auth_1.sellerAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ids = req.body.ids;
    const newIds = [];
    ids.forEach((id) => {
        const newId = new mongoose_1.default.Types.ObjectId(id);
        newIds.push(newId);
    });
    try {
        // const store = await Store.findOne({owner: req.seller._id});
        let idLength = newIds.length;
        for (idLength; idLength--;) {
            const id = newIds[idLength];
            const order = yield Order_1.default.findOne({ productId: id });
            if (order)
                return res
                    .status(500)
                    .send({ message: "cant delete a product that has an order" });
            yield Product_1.default.findByIdAndDelete(id);
        }
        res.status(200).send("ok");
    }
    catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
}));
router.post("/seller/ads", auth_1.sellerAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const plan = req.seller.package;
    const limit = constants_1.adsLimit.find((ad) => ad.plan.toLowerCase() === plan.toLowerCase());
    if (!limit) {
        return res.status(404).send("Not found");
    }
    try {
        const store = yield Store_1.default.findOne({ owner: req.seller._id });
        const ads = yield Ads_1.default.find({ owner: store._id });
        if (ads.length >= limit.limit)
            return res.status(400).send("Sorry you have hit the limit, pls upgrade");
        if (!store)
            return res.status(404).send("Not Found");
        const ad = new Ads_1.default(Object.assign(Object.assign({}, req.body), { owner: store._id }));
        yield ad.save();
        res.status(200).send(ad);
    }
    catch (e) {
        res.status(400).send(e);
    }
}));
router.get("/seller/ads", auth_1.sellerAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const store = yield Store_1.default.findOne({ owner: req.seller._id });
        if (!store) {
            return res.status(404).send("Not found");
        }
        const products = yield Product_1.default.find({ owner: store._id, quantity: { $gt: 0 } }).populate("ratingId");
        const ads = yield Ads_1.default.find({ owner: store._id }).populate({
            model: Product_1.default,
            path: "productId",
            match: {
                quantity: { $gt: 0 }
            },
        });
        res.status(200).send({ products, ads });
    }
    catch (e) {
        res.status(400).send(e);
    }
}));
router.get("/seller/topProducts", auth_1.sellerAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const store = yield Store_1.default.findOne({
            owner: req.seller._id,
        });
        if (!store)
            return res.status(404).send("Store does not exists");
        const products = yield Product_1.default.find({ owner: store._id })
            .limit(5)
            .sort({ view: -1 })
            .populate({
            path: "category",
            model: Category_1.default,
        })
            .exec();
        res.status(200).send(products);
    }
    catch (e) {
        res.status(400).send(e);
    }
}));
router.get("/seller/recentorders", auth_1.sellerAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const store = yield Store_1.default.findOne({
            owner: req.seller._id,
        });
        const orders = yield Order_1.default.find({ sellerId: store._id })
            .populate({
            model: Product_1.default,
            path: "productId",
        })
            .sort({ createdAt: -1, orders: -1 })
            .limit(5);
        res.status(200).send(orders);
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
router.post("/seller/create-customer-billing-session", auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = req.user.customer_id;
    try {
        // await createPortal(req.user.firstName)
        const session = yield app_1.stripe.billingPortal.sessions.create({
            customer,
            return_url: `${baseUrl_1.default}/seller/business`,
        });
        res.status(200).send(session);
    }
    catch (e) {
        console.log(e);
        res.status(400).send(e);
    }
}));
router.get("/seller/isComplete", auth_1.sellerAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isTrue = req.seller.isVerified;
        const store = yield Store_1.default.findOne({ owner: req.seller._id });
        if (isTrue && !store) {
            return res.status(200).send({ data: "incomplete" });
        }
        if (isTrue && store) {
            return res.status(200).send({ data: "seller", storeId: store._id });
        }
        res.status(200).send({ data: "invalid" });
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
router.post("/seller/template", auth_1.activeSeller, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const category = yield Category_1.default.findOne({ title: req.body.category });
        const template = new Template_1.default(Object.assign(Object.assign({}, req.body), { category: category._id, owner: req.seller._id }));
        template.save();
        res.status(200).send(template);
    }
    catch (e) {
        res.status(401).send(e);
    }
}));
router.get("/seller/template", auth_1.sellerAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const template = yield Template_1.default.find({ active: true, owner: req.seller._id })
            .populate({
            path: "category",
            model: Category_1.default,
        });
        res.status(200).send(template);
    }
    catch (e) {
        res.status(400).send(e);
    }
}));
router.get("/seller/template/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params;
    try {
        const template = yield Template_1.default.findById(new mongodb_1.ObjectId(id))
            .populate({
            path: "category",
            model: Category_1.default,
        });
        if (!template) {
            return res.status(404).send();
        }
        res.status(200).send(template);
    }
    catch (e) {
        console.log(e);
        res.status(401).send(e);
    }
}));
router.patch("/seller/template/:id", auth_1.sellerAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params;
    let data = req.body;
    try {
        if (req.body.category) {
            const category = yield Category_1.default.findOne({ title: req.body.category });
            data.category = category._id;
        }
        const findExisting = yield Template_1.default.findOne(new mongodb_1.ObjectId(id));
        if (!findExisting) {
            return res.status(403).send("No result found");
        }
        const template = yield Template_1.default.findByIdAndUpdate(new mongodb_1.ObjectId(id), data);
        res.status(200).send(template);
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
router.delete("/seller/template/:id", auth_1.sellerAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params;
    try {
        const deletedTemplate = yield Template_1.default.findByIdAndDelete(new mongodb_1.ObjectId(id));
        res.status(200).send(deletedTemplate);
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
exports.default = router;
