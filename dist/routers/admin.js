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
const auth_1 = require("../Middleware/auth");
const Contact_1 = __importDefault(require("../Models/Contact"));
const User_1 = __importDefault(require("../Models/User"));
const Admin_1 = __importDefault(require("../Models/Admin"));
const Order_1 = __importDefault(require("../Models/Order"));
const Feedback_1 = __importDefault(require("../Models/Feedback"));
const ReplyContact_1 = __importDefault(require("../Models/ReplyContact"));
const helpers_1 = require("../Helpers/helpers");
const Seller_1 = __importDefault(require("../Models/Seller"));
const Rating_1 = __importDefault(require("../Models/Rating"));
const Refund_1 = __importDefault(require("../Models/Refund"));
const Store_1 = __importDefault(require("../Models/Store"));
const Product_1 = __importDefault(require("../Models/Product"));
const RequestFile_1 = __importDefault(require("../Models/RequestFile"));
const TimeDiff_1 = require("../Helpers/TimeDiff");
const verifyUser_1 = require("../Helpers/verifyUser");
const generateOtp_1 = require("../Helpers/generateOtp");
const verifyUser_2 = require("../Helpers/verifyUser");
const Category_1 = __importDefault(require("../Models/Category"));
const mongodb_1 = require("mongodb");
const Activity_1 = __importDefault(require("../Models/Activity"));
const Review_1 = __importDefault(require("../Models/Review"));
const router = express_1.default.Router();
router.get("/contacts", auth_1.adminAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contacts = yield Contact_1.default.find({ active: true }).sort({ createdAt: "desc" });
        res.status(200).send(contacts);
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
router.post("/admin/create", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = (0, helpers_1.generateRandomX)(5);
    const admin = new Admin_1.default(Object.assign(Object.assign({}, req.body), { username }));
    try {
        yield admin.save();
        const token = yield admin.generateAuthToken();
        res.status(200).send({ admin, token });
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
router.patch("/admin/edit/:id", auth_1.adminAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const selectedId = req.params.id;
    const { id, otp, email, section, password, region, language } = req.body;
    const admin = yield Admin_1.default.findById(id);
    if (!admin)
        return res.status(403).send({ status: "Can't get delete" });
    const adminVerify = yield (0, helpers_1.validateAdmin)(parseInt(otp), admin._id);
    if (!adminVerify) {
        return res.status(401).send("Invalid updates");
    }
    try {
        let selAdmin = yield Admin_1.default.findById(selectedId);
        if (!selAdmin)
            return res.status(403).send({ status: "Can't get delete" });
        selAdmin.email = email;
        selAdmin.section = section;
        selAdmin.password = password;
        selAdmin.region = region;
        selAdmin.language = language;
        yield selAdmin.save();
        res.status(200).send(selAdmin);
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
router.post("/admin/delete", auth_1.adminAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, verifyCode, selectedId } = req.body;
    try {
        const admin = yield Admin_1.default.findById(id);
        if (!admin)
            return res.status(403).send({ status: "Can't get delete" });
        const adminVerify = yield (0, helpers_1.validateAdmin)(parseInt(verifyCode), admin._id);
        if (adminVerify) {
            const delAdmin = yield Admin_1.default.findByIdAndDelete(selectedId);
            res.status(200).send(delAdmin);
        }
        res.status(401).send({ status: "Something went wrong" });
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
router.get("/admins", auth_1.adminAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const admins = yield Admin_1.default.find({ section: { $ne: "superAdmin" } }).sort({ createdAt: "desc" });
        res.status(200).send(admins);
    }
    catch (e) {
        res.status(401).send(e);
    }
}));
router.get("/admin/id/:id", auth_1.adminAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const admin = yield Admin_1.default.findById(id);
        res.status(200).send(admin);
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
router.get("/admin/stores", auth_1.adminAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const stores = yield Store_1.default.find({});
        res.status(200).send(stores);
    }
    catch (e) {
        res.status(500).send({ message: "Something went wrong" });
    }
}));
router.post("/admin/verifyCode", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, user } = req.body;
    const otp = (0, generateOtp_1.generateOtp)();
    try {
        const admin = yield Admin_1.default.findById(id);
        if (!admin)
            return res.status(403).send({ status: "Can't get verification code" });
        admin.otp = otp;
        admin.save();
        // const email = "jact6313@gmail.com";
        const email = "admin@linconstore.com";
        yield (0, verifyUser_2.verifyAdmin)(otp, email);
        res.status(200).send(user);
    }
    catch (e) {
        res.status(500).send({ status: "Unable to login" });
    }
}));
router.post("/admin/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const otp = (0, generateOtp_1.generateOtp)();
    try {
        const admin = yield Admin_1.default.findByCredentials(email, password);
        admin.otp = otp;
        yield (0, verifyUser_2.verifyAdmin)(otp, admin.email);
        yield admin.save();
        res.status(200).send(admin);
    }
    catch (e) {
        res.status(500).send({ status: "Unable to login" });
    }
}));
router.post("/admin/verify", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp } = req.body;
    try {
        const admin = yield (0, helpers_1.findIfAdminExist)(email);
        const adminVerify = yield (0, helpers_1.validateAdmin)(parseInt(otp), admin._id);
        if (adminVerify) {
            const token = yield adminVerify.generateAuthToken();
            return res.status(200).send({ adminVerify, token });
        }
        res.status(401).send({ status: "Something went wrong" });
    }
    catch (e) {
        res.status(400).send({ status: e });
    }
}));
// router.get('/admin/orders', adminAuth, async (req: Request, res: Response) => {
//     const status = req.query.status;
//     try {
//         const orders: IOrder[] = await Order.find({ status });
//         res.status(200).send(orders);
//     }
//     catch (e) {
//         res.status(401).send(e)
//     }
// })
router.get("/admin/allorders", auth_1.adminAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield Order_1.default.find()
            .sort({ createdAt: "desc" })
            .populate({
            path: "productId",
            model: Product_1.default,
            populate: {
                path: "owner",
                model: Store_1.default,
            }
        });
        let resOrders = orders.filter((order) => order.productId);
        res.status(200).send(resOrders);
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
router.patch("/admin/cancel/order/:id", auth_1.adminAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const order = yield Order_1.default.findById(id);
        if (!order) {
            return res.status(404).send("Order Not found");
        }
        const date = (0, TimeDiff_1.getTimeDiff)(order.createdAt);
        if (date > 12) {
            return res.status(401).send("Sorry time has elapsed");
        }
        order.status = "cancelled";
        order.save();
        // const notification = new Notification({
        //     to: order.userId,
        //     from: 'System',
        //     message: `Your order ${order._id} has been cancelled `
        // })
        // notification.save();
        res.status(200).send(date);
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
// router.get('/admin/user/stats', adminAuth, async (req: Request, res : Response) => {
//     try {
//         const lastweek  : Date = getLastweek(7);
//         const users =  await  User.find({
//             createdAt : {
//                 $gte: Date.now(),
//                 $lte: lastweek
//             }
//         })
//
//     }
// })
router.get("/admin/user/stats", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const lastweek = (0, TimeDiff_1.getLastweek)(7);
        const twoWeeks = (0, TimeDiff_1.getLastweek)(14);
        const usersByCountry = yield (0, helpers_1.getUserByCountry)();
        const sellersByCountry = yield (0, helpers_1.getSellerByCountry)();
        const sellersLastWeek = yield (0, helpers_1.getSellerRange)(lastweek, Date.now());
        const sellersTwoWeeks = yield (0, helpers_1.getSellerRange)(twoWeeks, lastweek);
        const userLastWeek = yield (0, helpers_1.getUserRange)(lastweek, Date.now());
        const userTwoWeeks = yield (0, helpers_1.getUserRange)(twoWeeks, lastweek);
        const userPrev = userTwoWeeks.length;
        const userNext = userLastWeek.length;
        const sellerPrev = sellersTwoWeeks.length;
        const sellerNext = sellersLastWeek.length;
        const userStats = (0, helpers_1.replaceNull)(100 -
            (100 / (0, helpers_1.getBiggestNumber)(userPrev, userNext, true)) *
                (0, helpers_1.getBiggestNumber)(userPrev, userNext, false));
        const sellerStats = (0, helpers_1.replaceNull)(100 -
            (100 / (0, helpers_1.getBiggestNumber)(sellerPrev, sellerNext, true)) *
                (0, helpers_1.getBiggestNumber)(sellerPrev, sellerNext, false));
        const userSign = userNext > userPrev;
        const sellerSign = sellerNext > sellerPrev;
        const orderLastWeek = yield (0, helpers_1.getOrdersRange)(lastweek, Date.now());
        const orderTwoWeeks = yield (0, helpers_1.getOrdersRange)(twoWeeks, lastweek);
        const orderPrev = orderTwoWeeks.length;
        const orderNext = orderLastWeek.length;
        const orderStats = (0, helpers_1.replaceNull)(100 -
            (100 / (0, helpers_1.getBiggestNumber)(orderPrev, orderNext, true)) *
                (0, helpers_1.getBiggestNumber)(orderPrev, orderNext, false));
        const orderSign = orderNext > orderPrev;
        res.status(200).send({
            userNext,
            sellerNext,
            orderNext,
            userStats,
            sellerStats,
            userSign,
            usersByCountry,
            sellersByCountry,
            sellerSign,
            orderSign,
            orderStats,
        });
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
// router.get('/admin/orders/yearlystats', adminAuth, async (req: Request, res: Response) => {
//     const getLastMonth = getLastweek(28);
//     const getLast2Month = getLastweek(28 * 2);
//     const getLast3Month = getLastweek(28 * 3);
//     const getLast4Month = getLastweek(28 * 4);
//     const getLast5Month = getLastweek(28 * 5);
//     const getLast6Month = getLastweek(28 * 6);
//     try {
//         const now: number = Date.now();
//         const orderLastMonth: IOrder[] = await getOrdersRange(getLastMonth, now)
//         const orderLast2Month: IOrder[] = await getOrdersRange(getLast2Month, getLastMonth);
//         const orderLast3Month: IOrder[] = await getOrdersRange(getLast3Month, getLast2Month);
//         const orderLast4Month: IOrder[] = await getOrdersRange(getLast4Month, getLast4Month);
//         const orderLast5Month: IOrder[] = await getOrdersRange(getLast5Month, getLast4Month);
//         const orderLast6Month: IOrder[] = await getOrdersRange(getLast6Month, getLast5Month);
//         const dec: number = getTotalSales(orderLastMonth);
//         const nov: number = getTotalSales(orderLast2Month);
//         const oct: number = getTotalSales(orderLast3Month);
//         const sept: number = getTotalSales(orderLast4Month);
//         const aug: number = getTotalSales(orderLast5Month);
//         const july: number = getTotalSales(orderLast6Month);
//         res.status(200).send({ dec, nov, oct, sept, aug, july })
//     }
//     catch (e) {
//         res.status(500).send(e)
//     }
// })
router.get("/admin/delete/stores", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sellers = yield Seller_1.default.find({});
        let sellerLength = sellers.length;
        for (sellerLength; sellerLength--;) {
            const { _id } = sellers[sellerLength];
            const store = yield Store_1.default.findOne({ owner: _id });
            if (!store) {
                sellers[sellerLength].delete();
            }
        }
        res.status(200).send("ok");
    }
    catch (e) {
        res.status(200).send(e);
    }
}));
router.get(`/admin/orders/stats`, auth_1.adminAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const days = (0, helpers_1.days_passed)(new Date());
    const lastYear = (0, TimeDiff_1.getLastweek)(days);
    try {
        const now = Date.now();
        const orderLastYear = yield (0, helpers_1.getOrdersRange)(lastYear, now);
        const totalSales = (0, helpers_1.getTotalSales)(orderLastYear);
        res.status(200).send({ totalSales, totalOrders: orderLastYear.length });
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
router.get("/admin/yearly", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const months = (0, TimeDiff_1.getMonthStartDates)();
    try {
        const data = [];
        if (months.length === 1) {
            const orderLast = yield (0, helpers_1.getOrdersRange)(months[0], Date.now());
            const getTotalSale = (0, helpers_1.getTotalSales)(orderLast);
            data.push((0, helpers_1.round)(getTotalSale));
            return res.status(200).send(data);
        }
        for (let i = 0; i < months.length; i++) {
            if (i + 1 === months.length)
                continue;
            const orderLast = yield (0, helpers_1.getOrdersRange)(months[i], months[i + 1]);
            const getTotalSale = (0, helpers_1.getTotalSales)(orderLast);
            data.push((0, TimeDiff_1.roundUpNumber)(getTotalSale));
        }
        res.status(200).send(data);
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
const getMonthName = (monthNumber) => {
    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    return monthNames[monthNumber - 1];
};
router.get("/admin/user/stats", auth_1.adminAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const lastweek = (0, TimeDiff_1.getLastweek)(7);
        const sellers = yield Seller_1.default.find({
            createdAt: {
                $gte: Date.now(),
                $lte: lastweek,
            },
        });
        res.status(200).send(sellers);
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
router.get("/admin/user", auth_1.adminAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const seller = yield User_1.default.find({});
        res.status(200).send(seller);
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
router.get("/admin/ratings", auth_1.adminAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ratings = yield Review_1.default.find({})
            .populate({
            model: Store_1.default,
            path: "owner",
        })
            .populate({
            path: "productId",
            model: Product_1.default,
        });
        res.status(200).send(ratings);
    }
    catch (e) {
        res.status(401).send(e);
    }
}));
router.get("/admin/refund", auth_1.adminAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const refunds = yield Refund_1.default.find({})
            .populate({
            path: "productId",
            model: Product_1.default,
            populate: {
                path: "owner",
                model: Store_1.default,
                populate: {
                    path: "owner",
                    model: Seller_1.default,
                    populate: {
                        path: "owner",
                        model: User_1.default,
                    },
                },
            }
        })
            .populate({
            path: "storeId",
            model: Store_1.default,
        })
            .populate({
            path: "userId",
            model: User_1.default,
        });
        res.status(200).send(refunds);
    }
    catch (e) {
        res.status(400).send(e);
    }
}));
router.patch("/admin/refund/:id", auth_1.adminAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
router.delete("/admin/refund/:id", auth_1.adminAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const refund = yield Refund_1.default.findByIdAndDelete(id);
        res.status(200).send(refund);
    }
    catch (e) {
        res.status(400).send(e);
    }
}));
router.get("/admin/products", auth_1.adminAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield Product_1.default.find({ active: true })
            .where("quantity")
            .gt(0)
            .populate({
            path: "category",
            model: Category_1.default,
        })
            .populate({
            path: "owner",
            model: Store_1.default,
        });
        res.status(200).send(products);
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
router.patch("/admin/product/:id", auth_1.adminAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const product = yield Product_1.default.findById(id);
        if (!product)
            return res.status(404).send("Product does not exist");
        product.publish = !product.publish;
        product.save();
        const products = yield Product_1.default.findByIdAndUpdate(id, {
            publish: req.body.publish,
        });
        res.status(200).send(products);
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
router.get("/admin/users", auth_1.adminAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User_1.default.find({});
        let usersLength = users.length;
        const newUsers = [];
        for (usersLength; usersLength--;) {
            const order = yield Order_1.default.find({
                userId: users[usersLength]._id,
            });
            const lastOrders = yield Order_1.default.find({
                userId: users[usersLength]._id,
            }).sort({ createdAt: "desc" }).limit(3)
                .populate({
                path: "productId",
                model: Product_1.default,
            });
            newUsers.push({ users: users[usersLength], no: order.length, lastOrders: lastOrders });
        }
        res.status(200).send(newUsers);
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
router.patch("/admin/user/:id", auth_1.adminAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const updates = Object.keys(req.body);
    const id = req.params.id;
    // const existing : string [] = ['isVerified'];
    // const isAllowed : boolean = updates.every(update => existing.includes(update));
    // if (!isAllowed){
    //     return res.status(402).send('Invalid updates')
    // }
    try {
        const user = yield User_1.default.findById(id);
        if (!user)
            return res.status(404).send("Not found");
        user.isVerified = !user.isVerified;
        user.save();
        res.status(200).send(user);
    }
    catch (e) {
        res.status(400).send(e);
    }
}));
router.delete("/admin/user/:id", auth_1.adminAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const user = yield User_1.default.findByIdAndDelete(id);
        const store = yield Store_1.default.findOneAndDelete({ owner: id });
        if (store) {
            yield Product_1.default.deleteMany({ owner: store._id });
        }
        res.status(200).send(user);
    }
    catch (e) {
        res.status(400).send(e);
    }
}));
router.get("/admin/sellers", auth_1.adminAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const store = yield Store_1.default.find({}).populate({
            path: "owner",
            model: Seller_1.default,
            populate: {
                path: "owner",
                model: User_1.default,
            },
        });
        if (store.length === 0)
            return res.status(200).send([]);
        let storeLength = store.length;
        const newData = [];
        for (storeLength; storeLength--;) {
            const _id = (_a = store[storeLength]) === null || _a === void 0 ? void 0 : _a._id;
            const products = yield Product_1.default.find({ owner: _id });
            const lastProducts = yield Product_1.default.find({ owner: _id }).sort({ createdAt: "desc" }).limit(5);
            newData.push({ length: products.length, store: store[storeLength], lastProducts: lastProducts });
        }
        res.status(200).send(newData);
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
router.patch("/admin/seller/:id", auth_1.adminAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const status = req.body.status;
    try {
        const seller = yield Seller_1.default.findById(id);
        if (!seller)
            res.status(404).send("Not found");
        // @ts-ignore
        seller === null || seller === void 0 ? void 0 : seller.isVerified = !(seller === null || seller === void 0 ? void 0 : seller.isVerified);
        const store = yield Store_1.default.findById(seller === null || seller === void 0 ? void 0 : seller.storeId);
        store.isVerified = !store.isVerified;
        yield store.save();
        seller === null || seller === void 0 ? void 0 : seller.save();
        res.status(200).send();
    }
    catch (e) {
        res.status(400).send(e);
    }
}));
router.patch("/admin/seller/pausedPayout/:id", auth_1.adminAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const status = req.body.status;
    try {
        const seller = yield Seller_1.default.findById(id);
        if (!seller)
            res.status(404).send("Not found");
        // @ts-ignore
        seller === null || seller === void 0 ? void 0 : seller.isPausedPayout = !(seller === null || seller === void 0 ? void 0 : seller.isPausedPayout);
        seller === null || seller === void 0 ? void 0 : seller.save();
        return res.status(200).send(seller);
        // // @ts-ignore
        // stripe.accounts.update(seller?.accId, {
        //   metadata: {
        //     payouts_enabled: seller?.isPausedPayout,
        //   }
        // }, (err: any, updatedAccount: any) => {
        //   if (err) {
        //     return res.status(401).send(err);
        //   } else {
        //     // @ts-ignore
        //     seller?.isPausedPayout = !seller?.isPausedPayout;
        //     seller?.save();
        //     return res.status(200).send(seller);
        //   }
        // });
    }
    catch (e) {
        res.status(400).send(e);
    }
}));
router.patch("/admin/productCategory/:id", auth_1.adminAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let data = req.body;
    if (req.body.category) {
        const category = yield Category_1.default.findOne({ title: req.body.category });
        data.category = category._id;
    }
    const updates = Object.keys(req.body);
    const existingUpdate = [
        "category",
        "subcategory",
    ];
    // const isPhoto : boolean =  updates.includes('photo');
    const isAllowed = updates.every((update) => existingUpdate.includes(update));
    if (!isAllowed) {
        return res.status(401).send("Invalid Updates");
    }
    const _id = req.params.id;
    try {
        const product = yield Product_1.default.findById(_id);
        if (!product) {
            return res.status(401).send("Product does not exist");
        }
        updates.forEach((update) => (product[update] = data[update]));
        yield product.save();
        res.status(200).send(product);
    }
    catch (e) {
        res.status(400).send(e);
    }
}));
router.delete("/admin/seller/:id", auth_1.adminAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const _id = new mongodb_1.ObjectId(id);
    try {
        const store = yield Store_1.default.findById(_id);
        if (!store) {
            return res.status(404).send("Not Found");
        }
        const seller = yield Seller_1.default.findOne({ storeId: store._id });
        const user = yield User_1.default.findOne({ sellerId: seller === null || seller === void 0 ? void 0 : seller._id });
        yield (user === null || user === void 0 ? void 0 : user.save());
        yield Product_1.default.deleteMany({ owner: store._id });
        yield Store_1.default.findByIdAndDelete(id);
        res.status(200).send(store);
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
router.get("/admin/reviews", auth_1.adminAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sellers = yield Seller_1.default.find()
            .sort({ updatedAt: "asc" })
            .populate({ path: "storeId", model: Store_1.default })
            .populate({
            path: "owner",
            model: User_1.default,
        });
        const newData = [];
        let sellerLength = sellers.length;
        for (sellerLength; sellerLength--;) {
            const { storeId: store_id } = sellers[sellerLength];
            const store = yield Store_1.default.findById(store_id);
            const order = yield Order_1.default.find({ sellerId: store_id });
            const totalSales = (0, helpers_1.getTotalSales)(order);
            if (!store)
                continue;
            const products = yield Product_1.default.find({ owner: store._id });
            const productLength = products.length;
            newData.push({
                seller: sellers[sellerLength],
                length: productLength,
                balance: totalSales,
            });
        }
        res.status(200).send(newData);
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
router.patch("/admin/review/:id", auth_1.adminAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const seller = yield Seller_1.default.findOne({ _id: id });
        if (!seller) {
            return res.status(404).send("Not found");
        }
        seller.isVerified = !seller.isVerified;
        yield seller.save();
        const store = yield Store_1.default.findOne({ owner: seller._id });
        if (!store) {
            return res.status(404).send("Not found");
        }
        store.isVerified = !store.isVerified;
        yield store.save();
        yield (0, helpers_1.deactivateSellerProducts)(store);
        res.status(200).send();
    }
    catch (e) {
        res.status(400).send(e);
    }
}));
router.patch("/admin/seller/active/:id", auth_1.adminAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id, active = req.query.active, isActive = active === "true";
    const _id = new mongodb_1.ObjectId(id);
    try {
        if (active) {
            const request = yield RequestFile_1.default.findOne({ sellerId: _id });
            yield (request === null || request === void 0 ? void 0 : request.delete());
        }
        const seller = yield Seller_1.default.findByIdAndUpdate(id, { isActive });
        const user = yield User_1.default.findOne({ sellerId: _id });
        const email = user.email;
        const name = user.firstName;
        isActive
            ? (0, verifyUser_2.UpdateVerificationSuccessful)(email, name)
            : (0, verifyUser_2.ReUpdateIdentityVerification)(email, name);
        res.status(200).send(seller);
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
router.delete("/admin/review/:id", auth_1.adminAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const store = yield Store_1.default.findOne({ _id: id });
        if (!store) {
            return res.status(404).send("Store not found");
        }
        yield Store_1.default.findByIdAndDelete(id);
        yield Product_1.default.deleteMany({ owner: store._id });
        res.status(200).send();
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
router.get("/admin/feedbacks", auth_1.adminAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const feedbacks = yield Feedback_1.default.find({ active: true }).populate({
            path: "user",
            model: User_1.default,
        });
        res.status(200).send(feedbacks);
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
router.patch("/admin/feedback/:id", auth_1.adminAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const feedback = yield Feedback_1.default.findById(id);
        if (!feedback) {
            return res.status(404).send("Not found");
        }
        feedback.active = !feedback.active;
        yield feedback.save();
        res.status(200).send();
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
router.post("/admin/request", auth_1.adminAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { sellerId } = req.body;
    try {
        yield Seller_1.default.findByIdAndUpdate(sellerId, { isActive: false });
        const user = yield User_1.default.findOne({ sellerId });
        const email = user === null || user === void 0 ? void 0 : user.email;
        const name = user.firstName;
        yield (0, verifyUser_2.UpdateIdentityVerification)(email, name);
        const request = new RequestFile_1.default(req.body);
        yield request.save();
        res.status(201).send(request);
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
router.post("/admin/payout", auth_1.adminAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { type: name, amount, storeId } = req.body;
    try {
        const store = yield Store_1.default.findById(storeId);
        if (!store)
            res.status(404).send({ message: "Store does not exist" });
        if (amount > store.balance)
            return res
                .status(400)
                .send({ message: "Seller does not have up to this amount" });
        if (store.balance - amount < 0)
            return res.status(400).send({ message: "cant deduct up to this amount" });
        store.balance = store.balance - amount;
        yield (store === null || store === void 0 ? void 0 : store.save());
        const activity = new Activity_1.default({
            name,
            bill: amount,
            type: "debit",
            sellerId: store === null || store === void 0 ? void 0 : store._id,
        });
        yield activity.save();
        res.status(200).send(store);
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
router.post("/admin/send/delivery", auth_1.adminAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, helpers_1.sendOrderDeliveryNotification)();
        res.status(200).send();
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
router.delete("/admin/request/:id", auth_1.adminAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        RequestFile_1.default.findByIdAndDelete(id);
        res.status(200).send();
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
router.delete("/admin/products/delete", auth_1.adminAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedProducts = yield Product_1.default.deleteMany();
        res.status(200).send(deletedProducts);
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
router.delete("/admin/product/:id", auth_1.adminAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        // const order: IOrder | null = await Order.findOne({ productId: id });
        // if (order) return res.status(400).send({ message: 'Cant delete a product that has been ordered' })
        const product = yield Product_1.default.findById(id);
        yield Review_1.default.deleteMany({ productId: id });
        yield Rating_1.default.deleteMany({ productId: id });
        yield Order_1.default.deleteMany({ productId: id });
        yield Activity_1.default.deleteMany({ productId: id });
        yield (product === null || product === void 0 ? void 0 : product.delete());
        res.status(200).send(product);
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
router.delete("/admin/order/:id", auth_1.adminAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const order = yield Order_1.default.findByIdAndUpdate(id, { status: "cancelled" });
        if (order) {
            // const newNotification = new Notification({
            //     to: new ObjectId(order.userId as unknown as mongoose.Types.ObjectId),
            //     from: order.sellerId,
            //     message: `Your order has been cancelled by successfully`,
            //     isRead: false
            // })
            // await newNotification.save()
            // sendNotification(NOTIFICATION_TYPE.ORDER_CANCELLED, newNotification, order.userId.toString())
        }
        res.status(200).send(order);
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
router.get("/admin/products/stat", auth_1.adminAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield Product_1.default.find({ active: true, publish: true, });
        res.status(200).send(products.length);
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
router.patch("/admin/delete/contact/:id", auth_1.adminAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const contact = yield Contact_1.default.findById(id);
        if (!contact) {
            return res.status(404).send("Not found");
        }
        contact.active = !contact.active;
        yield contact.save();
        res.status(200).send();
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
router.post("/admin/reply/contact", auth_1.adminAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const title = req.body.title;
        const message = req.body.message;
        const contact = yield Contact_1.default.findById(req.body.contactId);
        if (!contact)
            return res.status(403).send("Don't reply to this contact");
        const replyContact = new ReplyContact_1.default({
            contactId: new mongodb_1.ObjectId(req.body.contactId),
            title: title,
            message: message,
        });
        yield replyContact.save();
        yield (0, verifyUser_1.replyAdminContact)(contact.email, title, message);
        res.status(200).send(replyContact);
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
exports.default = router;
