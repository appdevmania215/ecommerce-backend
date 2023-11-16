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
const User_1 = __importDefault(require("../Models/User"));
const Feedback_1 = __importDefault(require("../Models/Feedback"));
const helpers_1 = require("../Helpers/helpers");
const Review_1 = __importDefault(require("../Models/Review"));
const verifyUser_1 = require("../Helpers/verifyUser");
const auth_1 = require("../Middleware/auth");
const generateOtp_1 = require("../Helpers/generateOtp");
const mongodb_1 = require("mongodb");
const Order_1 = __importDefault(require("../Models/Order"));
const Product_1 = __importDefault(require("../Models/Product"));
const Cart_1 = __importDefault(require("../Models/Cart"));
const Refund_1 = __importDefault(require("../Models/Refund"));
const Contact_1 = __importDefault(require("../Models/Contact"));
const Rating_1 = __importDefault(require("../Models/Rating"));
const Store_1 = __importDefault(require("../Models/Store"));
const Notication_1 = __importDefault(require("../Models/Notication"));
const Message_1 = __importDefault(require("../Models/Message"));
const app_1 = require("../app");
const Address_1 = __importDefault(require("../Models/Address"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Wish_1 = __importDefault(require("../Models/Wish"));
const Seller_1 = __importDefault(require("../Models/Seller"));
const Close_1 = __importDefault(require("../Models/Close"));
const TimeDiff_1 = require("../Helpers/TimeDiff");
const types_1 = require("../socket/types");
const currencyRate_1 = require("../Helpers/currencyRate");
const router = express_1.default.Router();
// interface Iuser {
//     email : string,
//     password: string,
//     role : string,
// }
router.post("/user", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const otp = (0, generateOtp_1.generateOtp)();
    try {
        const customer = yield app_1.stripe.customers.create({
            email: req.body.email,
        });
        const customer_id = customer.id;
        const user = new User_1.default(Object.assign(Object.assign({}, req.body), { otp, customer_id }));
        yield user.save();
        yield (0, verifyUser_1.verifyEmail)(req.body.phone, req.body.email, otp);
        res.status(201).send({ user });
    }
    catch (e) {
        res.status(400).send(e);
    }
}));
router.delete("/user/:id", auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const user = yield User_1.default.findByIdAndDelete(id);
        res.status(200).send(user);
    }
    catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
}));
router.get("/user/follow/:id", auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user._id;
        const sellerId = req.params.id;
        const user = yield User_1.default.findOne({ _id: userId });
        if (!user)
            return res.status(400).send("Invalid user");
        const seller = yield Seller_1.default.findOne({ _id: sellerId });
        if (!seller)
            return res.status(400).send("Invalid seller ");
        const followerExist = seller.followers.indexOf(userId.toString());
        const followingExist = user.following.indexOf(sellerId.toString());
        let message;
        if (followerExist !== -1) {
            seller.followers.splice(followerExist, 1);
            user.following.splice(followingExist, 1);
            message = "Unfollowed";
        }
        else {
            seller.followers.push(userId.toString());
            user.following.push(sellerId);
            message = "Followed";
        }
        yield seller.save();
        yield user.save();
        res.status(200).send({ message, following: user.following });
    }
    catch (error) {
        res.status(500).send(error);
    }
}));
router.post("/user/phone", auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { phone } = req.body;
    try {
        req.user.phone = phone;
        yield req.user.save();
        res.status(200).send();
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
router.post("/user/verify", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp } = req.body;
    try {
        const existingUser = yield (0, helpers_1.findIfEmailExist)(email);
        if (!existingUser) {
            return res.status(401).send("User does not exist");
        }
        const user = yield (0, helpers_1.validateUser)(parseInt(otp), existingUser._id);
        if (user) {
            const token = yield user.generateAuthToken();
            return res.status(200).send({ user, token });
        }
        res.status(401).send("Something went wrong");
    }
    catch (e) {
        console.log(e);
        res.status(400).send(e);
    }
}));
router.get("/users/fetch/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const users = yield User_1.default.findByIdAndDelete(id);
        res.status(200).send(users);
    }
    catch (e) { }
}));
router.post('/user/security', auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { newPassword, oldPassword } = req.body;
    try {
        const user = yield User_1.default.findByCredentials(req.user.email, oldPassword);
        user.password = newPassword;
        yield user.save();
        res.status(200).send('ok');
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
router.post("/user/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield User_1.default.findByCredentials(email, password);
        const token = yield user.generateAuthToken();
        const seller = yield Seller_1.default.findOne({ owner: user._id });
        if (user.isClosed)
            return res.status(403).send("something went wrong");
        if (user && user.isVerified) {
            return res.status(200).send({ user, token, seller: seller ? seller.isVerified : null });
        }
        res.status(400).send("Something went wrong");
    }
    catch (e) {
        res.status(400).send(e);
    }
}));
router.post("/user/resend", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        yield (0, helpers_1.findIfEmailExistAndIsVerified)(email);
        res.status(200).send("Ok");
    }
    catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
}));
router.get("/user/ratings", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rating = yield Rating_1.default.deleteMany();
        res.status(200).send(rating);
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
router.get("/user/deals", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const lastweek = (0, TimeDiff_1.getLastweek)(7);
        const products = yield (0, helpers_1.getProductRange)(lastweek, Date.now());
        res.status(200).send(products);
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
router.delete("/user/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const deletedUser = yield User_1.default.findByIdAndUpdate(id, { isVerified: false });
        res.status(200).send(deletedUser);
    }
    catch (e) {
        res.status(400).send(e);
    }
}));
router.post("/user/reset", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        const user = yield (0, helpers_1.findIfEmailExist)(email);
        if (!user.isVerified)
            return res.status(400).send();
        const otp = yield jsonwebtoken_1.default.sign({ _id: user._id.toString() }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });
        yield (0, verifyUser_1.forgotPassword)(otp, user._id, email);
        res.status(200).send(user);
    }
    catch (e) {
        res.status(400).send(e);
    }
}));
router.post("/user/password", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { password, id } = req.body;
    try {
        const user = yield User_1.default.findById(id);
        user.password = password;
        yield user.save();
        res.status(200).send(user);
    }
    catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
}));
router.get("/user/reset/verify", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { otp, id } = req.query;
    try {
        const user = yield User_1.default.findById(id);
        if (!user) {
            return res.status(404).send();
        }
        const decoded = yield jsonwebtoken_1.default.verify(otp, process.env.JWT_SECRET);
        if (user._id.toHexString() === decoded._id) {
            return res.status(200).send();
        }
        res.status(404).send();
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
router.post("/user/detail", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        const user = yield User_1.default.findOne({ email });
        res.status(200).send(user);
    }
    catch (e) {
        console.log(e);
    }
}));
router.get("/user/logout", auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token);
        yield req.user.save();
        res.status(200).send();
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
router.post("/user/order", auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _id = req.body.productId;
    try {
        const product = yield Product_1.default.findOne({ _id });
        if (!product) {
            return res.status(400).send("Invalid Product");
        }
        product.quantity = product.quantity - parseInt(req.body.quantity);
        product.save();
        const order = new Order_1.default(Object.assign(Object.assign({}, req.body), { sellerId: product.owner, userId: req.user._id }));
        yield order.save();
        res.status(200).send(order);
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
// get cart
router.get("/cart", auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const owner = req.user._id;
    try {
        const cart = yield Cart_1.default.findOne({ owner }).populate({
            path: "products",
            populate: [
                {
                    path: "productId",
                    model: Product_1.default,
                    populate: [
                        {
                            path: "owner",
                            model: Store_1.default,
                        },
                    ],
                },
            ],
        });
        if (cart && cart.products.length > 0) {
            return res.status(200).send(cart);
        }
        res.status(200).send("Empty cart");
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
//increment cart
router.post("/cart/increment", auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const owner = req.user._id;
    const { productId } = req.body;
    try {
        yield (0, helpers_1.updateUserCart)(owner, productId, true);
        res.status(200).send();
    }
    catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
}));
//decrement cart
router.post("/cart/decrement", auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const owner = req.user._id;
    const { productId } = req.body;
    try {
        yield (0, helpers_1.updateUserCart)(owner, productId, false);
        res.status(200).send();
    }
    catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
}));
//add items to cart
router.post("/cart", auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const owner = req.user._id;
    const { productId, quantity, price, variants } = req.body;
    try {
        const cart = yield Cart_1.default.findOne({ owner });
        const product = yield Product_1.default.findOne({
            _id: new mongodb_1.ObjectId(productId),
        });
        if (!product) {
            return res.status(404).send("Product not found");
        }
        // const price : number = product.price;
        const title = product.title;
        const photo = product.photo[0];
        const productQuantity = product.quantity;
        if (cart) {
            const productIndex = cart.products.findIndex((product) => product.productId.toHexString() === productId);
            if (productIndex > -1) {
                let product = cart.products[productIndex];
                if (product.quantity + parseInt(quantity) > productQuantity)
                    return res.status(400).send("Product quantity exceeded");
                product.quantity += parseInt(quantity);
                cart.bill = cart.products.reduce((acc, cur) => acc + cur.quantity * cur.price, 0);
                cart.products[productIndex] = product;
                yield cart.save();
                return res.status(200).send(cart);
            }
            cart.products.push({
                productId,
                quantity,
                name: title,
                price,
                photo,
                variants,
            });
            cart.bill = cart.products.reduce((acc, cur) => acc + cur.quantity * cur.price, 0);
            yield cart.save();
            return res.status(200).send(cart);
        }
        //no cart exist for that user, create new one
        const newCart = new Cart_1.default({
            owner,
            products: [{ productId, name: title, quantity, price, photo, variants }],
            bill: quantity * price,
        });
        yield newCart.save();
        res.status(201).send(newCart);
    }
    catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
}));
//delete item in cart
router.delete("/cart", auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productId = req.query.id;
    const owner = req.user._id;
    try {
        let cart = yield Cart_1.default.findOne({ owner });
        if (!cart) {
            return res.status(404).send("Product not found");
        }
        const productIndex = cart.products.findIndex((product) => product.productId.toHexString() === productId);
        if (productIndex > -1) {
            let product = cart.products[productIndex];
            cart.bill -= product.quantity * product.price;
            if (cart.bill < 0) {
                cart.bill = 0;
            }
            cart.products.splice(productIndex, 1);
            cart.bill = cart.products.reduce((acc, cur) => acc + cur.quantity * cur.price, 0);
            yield cart.save();
            return res.status(200).send(cart);
        }
        res.status(404).send("Product not Found");
    }
    catch (e) {
        res.status(400).send(e);
    }
}));
router.post("/user/refund", auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _id = req.body.productId;
    try {
        const isVerified = yield Order_1.default.findOne({
            userId: req.user._id,
            productId: _id,
        });
        if (!isVerified)
            return res.status(404).send("Not Found");
        isVerified.refund = true;
        yield isVerified.save();
        const product = yield Product_1.default.findOne({ _id });
        const storeId = product === null || product === void 0 ? void 0 : product.owner;
        const refund = new Refund_1.default(Object.assign(Object.assign({}, req.body), { storeId, userId: req.user._id }));
        yield refund.save();
        res.status(200).send(refund);
    }
    catch (e) {
        res.status(400).send(e);
    }
}));
router.get("/user/order", auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const status = req.query.status;
    try {
        const order = yield Order_1.default.find({
            userId: req.user._id,
            status,
        }).populate([
            {
                path: "productId",
                model: Product_1.default,
                populate: [{
                        path: "owner",
                        model: Store_1.default,
                        populate: {
                            path: "owner",
                            model: Seller_1.default,
                        },
                    }, {
                        path: "ratingId",
                        model: Rating_1.default,
                    }],
            }, {
                path: "address",
                model: Address_1.default,
            }
        ]);
        res.status(200).send({ user: req.user._id, order });
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
router.get("/user/order/shipped", auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const order = yield Order_1.default.find({ userId: req.user._id })
            .or([{ status: "shipped" }, { status: "delivered" }])
            .populate([{
                path: "productId",
                model: Product_1.default,
                populate: [{
                        path: "owner",
                        model: Store_1.default,
                        populate: {
                            path: "owner",
                            model: Seller_1.default,
                        },
                    }, {
                        path: "ratingId",
                        model: Rating_1.default,
                    }],
            }, {
                path: "address",
                model: Address_1.default,
            }
        ]);
        res.status(200).send({ user: req.user._id, order });
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
router.get("/user/order/processed", auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const order = yield Order_1.default.find({ userId: req.user._id })
            .or([{ status: "processed" }, { status: "cancelled" }])
            .populate([{
                path: "productId",
                model: Product_1.default,
                populate: [{
                        path: "owner",
                        model: Store_1.default,
                        populate: {
                            path: "owner",
                            model: Seller_1.default,
                        },
                    }, {
                        path: "ratingId",
                        model: Rating_1.default,
                    }],
            }, {
                path: "address",
                model: Address_1.default,
            }
        ]);
        res.status(200).send({ user: req.user._id, order });
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
router.get("/user/order/cancelled", auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const order = yield Order_1.default.find({ userId: req.user._id })
            .or([{ status: "cancelled" }, { status: "processed" }])
            .populate([
            {
                path: "productId",
                model: Product_1.default,
                populate: {
                    path: "owner",
                    model: Store_1.default,
                    populate: {
                        path: "owner",
                        model: Seller_1.default,
                    },
                },
            }, {
                path: "address",
                model: Address_1.default,
            }
        ]);
        res.status(200).send({ user: req.user._id, order });
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
router.post("/user/contact", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const contact = new Contact_1.default(req.body);
    try {
        yield contact.save();
        res.status(200).send(contact);
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
router.post("/user/rate", auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = {
        rating: req.body.rating,
        productId: req.body.productId,
    };
    const name = req.user.firstName;
    const { comment, rating: rating1, productId } = req.body;
    try {
        const rating = yield Rating_1.default.findOne({
            productId: new mongodb_1.ObjectId(data.productId),
        });
        if (rating) {
            const existingUser = rating.ratings.find((data) => data.userId.toHexString() === req.user._id.toHexString());
            if (existingUser) {
                return res
                    .status(401)
                    .send({ status: "User cant rate the same item more than once" });
            }
            rating.ratings = rating.ratings.concat({
                rating: data.rating,
                name: req.user.email,
                userId: req.user._id,
                comment: req.body.comment,
            });
            const newRating = rating.ratings.reduce((acc, obj) => acc + obj.rating, 0);
            const length = rating.ratings.length;
            rating.averageRating = Number((newRating / length).toFixed(1));
            yield rating.save();
            return res.status(200).send(rating);
        }
        const newData = {
            productId: req.body.productId,
            ratings: [
                {
                    userId: req.user._id,
                    rating: req.body.rating,
                    name,
                },
            ],
            averageRating: data.rating,
        };
        const newRating = new Rating_1.default(newData);
        yield newRating.save();
        const product = yield Product_1.default.findById(req.body.productId);
        product.ratingId = newRating._id;
        product.save();
        const review = new Review_1.default({
            description: comment,
            rate: rating1,
            productId,
            name,
            owner: product === null || product === void 0 ? void 0 : product.owner,
        });
        yield review.save();
        res.status(201).send(newRating);
    }
    catch (e) {
        console.log(e);
        res.status(401).send(e);
    }
}));
// router.get('/user/rate', auth, async (req : Request, res : Response) => {
//     try {
//         const rating : IRating [] = await Rating.findOne({});
//         res.status(200).send(rating)
//     }
//     catch (e) {
//         res.status(500).send(e)
//     }
// })
router.get("/store/view/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const store = yield Store_1.default.findById(id);
        if (!store) {
            return res.status(404).send("Not Found");
        }
        store.views = store.views + 1;
        yield store.save();
        res.status(200).send(store);
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
// router.patch(
//   "/user/notification/read",
//   auth,
//   async (req: Request, res: Response) => {
//     try {
//       const notifications: INotication[] = await Notification.find({
//         user_to: req.user._id,
//       });
//       let notificationLength: number = notifications.length;
//       for (notificationLength; notificationLength--; ) {
//         if (notifications[notificationLength].isRead) continue;
//         notifications[notificationLength].isRead = true;
//         notifications[notificationLength].save();
//       }
//       res.status(200).send("ok");
//     } catch (e) {
//       res.status(500).send(e);
//     }
//   }
// );
router.get("/admin/messages/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const messages = yield Message_1.default.find({
            roomName: id,
            deletedByRole: null
        }).exec();
        res.status(200).send(messages);
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
router.get("/admin/broadCast", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const messages = yield Notication_1.default.find({
            title: "Broadcast",
            senderRole: types_1.USER_ROLE.ADMIN,
            from: types_1.USER_ROLE.ADMIN,
        }).exec();
        res.status(200).send(messages);
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
router.get("/user/room/messages/:id", auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const { sellerId, role, buyerId } = req.query;
        let messages = [];
        if (role == 'user') {
            messages = yield Message_1.default.find({
                $or: [
                    { from: req.user._id },
                    { to: req.user._id },
                ],
                roomName: id,
                deletedByBuyerId: { $ne: buyerId }
            }).exec();
        }
        else if (role == 'seller') {
            messages = yield Message_1.default.find({
                $or: [
                    { from: req.user._id },
                    { to: req.user._id },
                ],
                roomName: id,
                deletedBySellerId: { $ne: sellerId }
            }).exec();
        }
        else {
            messages = yield Message_1.default.find({
                type: types_1.CHAT_TYPE.ADMIN_CHAT,
                roomName: id,
                deletedByRole: null
            }).exec();
        }
        res.status(200).send(messages);
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
router.post("/user/bill/address", auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const address = new Address_1.default(Object.assign(Object.assign({}, req.body), { userId: req.user._id, type: "billing" }));
    try {
        const defaultBill = yield Address_1.default.findOne({
            type: "billing",
        });
        if (defaultBill) {
            defaultBill.type = "shipping";
            defaultBill.save();
            yield address.save();
            return res.status(201).send(address);
        }
        yield address.save();
        res.status(201).send(address);
    }
    catch (e) {
        res.status(400).send(e);
    }
}));
router.post("/user/address", auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const updates = Object.keys(req.body);
    const isDefault = updates.includes("default");
    try {
        if (isDefault) {
            const defaultExist = yield Address_1.default.findOne({
                default: true,
            });
            if (defaultExist) {
                defaultExist.default = false;
                yield defaultExist.save();
                const address = new Address_1.default(Object.assign(Object.assign({}, req.body), { userId: req.user._id, default: true }));
                yield app_1.stripe.customers.update(req.user.customer_id, {
                    address: {
                        country: address.country,
                        line1: address.address,
                    },
                    phone: address.phoneNumber,
                    name: address.firstName + " " + address.lastName,
                });
                yield address.save();
                return res.status(200).send(address);
            }
            const address = new Address_1.default(Object.assign(Object.assign({}, req.body), { userId: req.user._id, default: true }));
            yield app_1.stripe.customers.update(req.user.customer_id, {
                address: {
                    country: address.country,
                    line1: address.address,
                },
                phone: address.phoneNumber,
                name: address.firstName + " " + address.lastName,
            });
            yield address.save();
            return res.status(200).send(address);
        }
        const address = new Address_1.default(Object.assign(Object.assign({}, req.body), { userId: req.user._id }));
        yield address.save();
        yield app_1.stripe.customers.update(req.user.customer_id, {
            address: {
                country: address.country,
                line1: address.address,
            },
            phone: address.phoneNumber,
            name: address.firstName + " " + address.lastName,
        });
        res.status(200).send(address);
    }
    catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
}));
router.get("/user/address", auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const address = yield Address_1.default.find({ userId: req.user._id });
        res.status(200).send(address);
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
router.patch("/user/address/:id", auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const updates = Object.keys(req.body);
    const { id } = req.params;
    const allowedUpdate = ["city", "country", "firstName", "lastName", "phoneNumber", "state", "zipCode", "address", "id"];
    const isAllowed = updates.every((update) => allowedUpdate.includes(update));
    try {
        if (!isAllowed)
            return res.status(403).send("Invalid updates");
        const existingAddress = yield Address_1.default.findById(id);
        updates.forEach((update) => (existingAddress[update] = req.body[update]));
        yield existingAddress.save();
        res.status(200).send(existingAddress);
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
router.delete("/user/address/:id", auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const newAddress = yield Address_1.default.findByIdAndDelete(id);
        res.status(200).send(newAddress);
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
router.patch("/user/address/default/:id", auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const defaultExist = yield Address_1.default.findOne({
            default: true,
        });
        if (!defaultExist) {
            const newDefault = yield Address_1.default.findByIdAndUpdate(id, {
                default: true,
            });
            return res.status(200).send(newDefault);
        }
        defaultExist.default = false;
        yield defaultExist.save();
        const newDefault = yield Address_1.default.findByIdAndUpdate(id, { default: true });
        return res.status(200).send(newDefault);
    }
    catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
}));
router.get("/user/checkout", auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //  await stripe.customers.createSource(req.user.customer_id, {
        //     source : req.body.token
        // });
        const cart = yield Cart_1.default.findOne({
            owner: req.user._id,
        }).populate({
            path: "products",
            populate: [
                {
                    path: "productId",
                    model: Product_1.default,
                    populate: [
                        {
                            path: "owner",
                            model: Store_1.default,
                            populate: [
                                {
                                    path: 'owner',
                                    model: Seller_1.default
                                }
                            ]
                        },
                    ],
                },
            ],
        });
        // const createCharge = await stripe.charges.create({
        //     receipt_email: req.user.email,
        //     customer: req.user.customer_id,
        //     currency: 'usd',
        //     amount:    cart?.bill,
        //     source: token.id,
        // });
        // addToOrders(cart, req.user._id)
        // cart?.delete()
        res.status(200).send(cart);
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
router.post("/user/payment", auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const shipping = req.body.shipping;
    const shippingType = req.body.type;
    const countryRate = req.body.countryRate;
    const currencyLabel = req.body.currencyLabel;
    try {
        const cart = yield Cart_1.default.findOne({
            owner: req.user._id,
        }).populate({
            path: "products.productId",
            model: Product_1.default,
            populate: {
                path: "owner",
                model: Store_1.default,
            },
        });
        if (!cart) {
            return res.status(404).send("Nothing here");
        }
        const rates = (yield (0, currencyRate_1.handleRateChange)());
        const customer = req.user.customer_id;
        const productsArray = [];
        const { products } = cart;
        products.forEach((product) => {
            const productObj = product.productId;
            const owner = productObj.owner;
            const productConst = {
                price_data: {
                    currency: currencyLabel,
                    product_data: {
                        name: product.name,
                    },
                    unit_amount: Math.floor(Number(product.price * rates[`${owner.currency}`] / countryRate) * 100),
                },
                quantity: product.quantity,
            };
            productsArray.push(productConst);
        });
        const shippingTotal = {
            price_data: {
                currency: currencyLabel,
                product_data: {
                    name: "Shipping",
                },
                unit_amount: Math.floor(shipping * 100 / countryRate),
            },
            quantity: 1,
        };
        productsArray.push(shippingTotal);
        const session = yield (0, helpers_1.createPaymentCheckout)(customer, productsArray);
        req.user.payId = session === null || session === void 0 ? void 0 : session.id;
        req.user.shipping = shippingType;
        yield req.user.save();
        res.status(200).send(session);
    }
    catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
}));
router.post("/user/verify/payment", auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const address = req.body.address;
        const { payId: id, shipping } = req.user;
        const sessionDetails = yield app_1.stripe.checkout.sessions.retrieve(id);
        if (!sessionDetails) {
            return res.status(404).send();
        }
        if (sessionDetails.payment_status === "unpaid") {
            return res.status(403).send("You have not paid yet");
        }
        const cart = yield Cart_1.default.findOne({ owner: req.user._id }).populate({
            path: "products",
            populate: [
                {
                    path: "productId",
                    model: Product_1.default,
                    populate: [
                        {
                            path: "owner",
                            model: Store_1.default,
                        },
                    ],
                },
            ],
        });
        const orderData = yield (0, helpers_1.addToOrders)(cart, req.user.email, req.user, address, shipping);
        req.user.orders = req.user.orders + 1;
        req.user.payId = null;
        yield req.user.save();
        cart === null || cart === void 0 ? void 0 : cart.delete();
        res.status(200).send(orderData);
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
router.post("/user/close", auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const close = new Close_1.default(req.body);
    try {
        const seller = yield Seller_1.default.findOne({
            owner: req.user._id,
        });
        const store = yield Store_1.default.findOne({ owner: seller === null || seller === void 0 ? void 0 : seller._id });
        if (store)
            return res
                .status(400)
                .send("You cant close this account as you already have a store");
        req.user.isClosed = true;
        yield (0, verifyUser_1.closeAccount)(req.user.email);
        yield req.user.save();
        yield close.save();
        res.status(200).send("ok");
    }
    catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
}));
router.get("/user", auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(200).send(req.user);
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
router.patch("/user/modify", auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const updates = Object.keys(req.body);
    const existingData = ["name", "phone", "password", "language", "currency"];
    const isAllowed = updates.every((update) => existingData.includes(update));
    if (!isAllowed)
        return res.status(403).send("Invalid updates");
    updates.forEach((update) => (req.user[update] = req.body[update]));
    try {
        yield req.user.save();
        res.status(200).send(req.body);
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
router.get("/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User_1.default.find({});
        res.status(200).send(users);
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
router.get("/user/wishlist", auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const wishlists = yield Wish_1.default.find({
            userId: req.user._id,
        }).populate({
            path: "productId",
            model: Product_1.default,
            populate: [{
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
                },]
        });
        res.status(200).send(wishlists);
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
router.post("/user/wishlist", auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const wishlist = new Wish_1.default(Object.assign(Object.assign({}, req.body), { userId: req.user._id }));
    const { productId } = req.body;
    try {
        let cart = yield Cart_1.default.findOne({ owner: req.user._id });
        if (cart) {
            const productIndex = cart.products.findIndex((product) => product.productId.toHexString() === productId);
            if (productIndex > -1) {
                let product = cart.products[productIndex];
                cart.bill -= product.quantity * product.price;
                if (cart.bill < 0) {
                    cart.bill = 0;
                }
                cart.products.splice(productIndex, 1);
                cart.bill = cart.products.reduce((acc, cur) => acc + cur.quantity * cur.price, 0);
                yield cart.save();
            }
        }
        const wishExists = yield Wish_1.default.findOne({
            userId: req.user._id,
            productId,
        });
        if (wishExists)
            return res.status(401).send("item already exists");
        yield wishlist.save();
        res.status(200).send(wishlist);
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
router.delete("/wishlist", auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ids = req.query.ids;
    try {
        yield Wish_1.default.deleteMany({ userId: req.user._id, _id: { $in: ids } });
        res.status(200).send("Ok");
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
router.delete("/wishlist/:id", auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        yield Wish_1.default.findByIdAndRemove(id);
        res.status(200).send("ok");
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
//this should work
router.get("/brands", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const brands = yield Store_1.default.find({
            $or: [{ account: "Brand" }],
        });
        res.status(200).send(brands);
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
router.get("/allusers", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User_1.default.find({});
        res.status(200).send(users);
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
router.delete("/users_test/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _id = req.params.id;
        yield User_1.default.findByIdAndDelete(_id);
        res.status(200).send();
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
router.get("/allstores", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const stores = yield Store_1.default.find({
            $or: [{ account: "Individual Seller" }, { account: "Small Business" }],
        })
            .sort({ sales: -1 })
            .limit(4);
        res.status(200).send(stores);
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
router.get("/findstore", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { name, letterOrder, recentItem } = req.query;
    let sortParams = {};
    if (letterOrder) {
        sortParams = {
            title: letterOrder === "AZ" ? 1 : -1,
        };
    }
    if (recentItem) {
        sortParams = {
            createdAt: -1,
        };
    }
    if (!name)
        return res.status(400).send({ message: "store name is required" });
    const new_name = name.split("-");
    if (new_name.length > 1) {
        name = new_name[0] + " " + new_name[1];
    }
    else {
        name = new_name[0];
    }
    try {
        let store = yield Store_1.default.findOne({
            name: { $regex: new RegExp(name, "i") },
        });
        const seller = yield Seller_1.default.findOne({ _id: store === null || store === void 0 ? void 0 : store.owner });
        const products = yield Product_1.default.find({
            owner: store === null || store === void 0 ? void 0 : store._id,
            active: true,
            publish: true,
        })
            .populate({
            path: "ratingId",
            model: Rating_1.default,
        })
            .populate({
            path: "owner",
            model: Store_1.default,
            populate: {
                path: "owner",
                model: Seller_1.default,
            },
        })
            .sort(sortParams);
        // @ts-ignore
        res.status(200).send({
            products,
            image: store === null || store === void 0 ? void 0 : store.logo,
            storeOwnerId: store === null || store === void 0 ? void 0 : store.owner,
            name: store === null || store === void 0 ? void 0 : store.name,
            description: store === null || store === void 0 ? void 0 : store.summary,
            followCount: seller === null || seller === void 0 ? void 0 : seller.followers.length,
        });
    }
    catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
}));
router.get("/user/recommendation", auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    try {
        const wishlist = yield Wish_1.default.find({ userId: user._id }).populate({
            path: "productId",
            model: Product_1.default,
        });
        const products = [];
        const stores = [];
        for (const wish of wishlist) {
            // @ts-ignore
            const category = wish.productId.category;
            const product = yield Product_1.default.find({ category: category });
            // @ts-ignore
            const store = yield Store_1.default.find({ owner: wish.productId.owner });
            products.concat(product);
            stores.concat(store);
        }
        res.status(200).send({ products, stores });
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
router.post("/user/shopping", auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const name = req.user.firstName + req.user.lastName;
    const { message } = req.body;
    try {
        const feedback = new Feedback_1.default({
            user: new mongodb_1.ObjectId(req.user._id),
            message: message,
        });
        yield feedback.save();
        yield (0, verifyUser_1.sendExperience)(name, message);
        res.status(200).send();
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
router.get("/user/store", auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    try {
        const seller = yield Seller_1.default.findOne({ owner: userId });
        if (!seller) {
            return res.status(400).send({ message: "Seller not found" });
        }
        const store = yield Store_1.default.findOne({ ownerId: seller._id });
        if (!store) {
            return res.status(400).send({ message: "Store not found" });
        }
        res.status(200).send(store);
    }
    catch (error) {
        res.status(500).send(error);
    }
}));
exports.default = router;
