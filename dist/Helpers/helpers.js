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
exports.updateProductStatus = exports.deactivateSellerProducts = exports.updateUserCart = exports.unCapitalizeFirstLetter = exports.capitalizeFirstLetter = exports.deleteInvalidProductRefund = exports.deleteInvalidProductActivity = exports.deleteInvalidProductOrders = exports.deleteInvalidProductsReviews = exports.deleteInvalidProductsRating = exports.deleteInvalidStores = exports.updateStoreActivity = exports.createPortal = exports.round = exports.days_passed = exports.handleSetSellerRep = exports.updateCart = exports.getProductRange = exports.getRefundRange = exports.getSellerByCountry = exports.getUserByCountry = exports.getUserRange = exports.getSellerRange = exports.getOrdersRangeForSeller = exports.getOrdersRange = exports.getTotalShippingPrice = exports.getTotalSales = exports.replaceNull = exports.getBiggestNumber = exports.saveVerifiedSeller = exports.addToOrders = exports.disableUnsoldProductsForFreePlanSellers = exports.sendOrderDeliveryNotification = exports.extractDataForOrdersUpdate = exports.checkSubscription = exports.generateRandomX = exports.createPaymentCheckout = exports.createCheckoutSession = exports.updateActivity = exports.updateHotdeals = exports.updateShipping = exports.updateOrders = exports.findIfEmailExistAndIsVerified = exports.validateAdmin = exports.findIfAdminExist = exports.validateUser = exports.findIfEmailExist = void 0;
const User_1 = __importDefault(require("../Models/User"));
const generateOtp_1 = require("./generateOtp");
const verifyUser_1 = require("./verifyUser");
const Order_1 = __importDefault(require("../Models/Order"));
const TimeDiff_1 = require("./TimeDiff");
const app_1 = require("../app");
const Cart_1 = __importDefault(require("../Models/Cart"));
const Product_1 = __importDefault(require("../Models/Product"));
const Seller_1 = __importDefault(require("../Models/Seller"));
const Admin_1 = __importDefault(require("../Models/Admin"));
const baseUrl_1 = __importDefault(require("../baseurl/baseUrl"));
const Store_1 = __importDefault(require("../Models/Store"));
const Refund_1 = __importDefault(require("../Models/Refund"));
const Activity_1 = __importDefault(require("../Models/Activity"));
const Wish_1 = __importDefault(require("../Models/Wish"));
const Shipping_1 = __importDefault(require("../Models/Shipping"));
const mongodb_1 = require("mongodb");
const Rating_1 = __importDefault(require("../Models/Rating"));
const Review_1 = __importDefault(require("../Models/Review"));
const Address_1 = __importDefault(require("../Models/Address"));
const constant_1 = require("../components/currency/constant");
const Notication_1 = __importDefault(require("../Models/Notication"));
const helpers_1 = require("../libs/helpers");
const wallet_1 = require("../components/wallet/services/wallet");
const currencyRate_1 = require("./currencyRate");
const findIfEmailExist = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.default.findOne({ email });
    if (!user) {
        throw new Error("User does not exist");
    }
    return user;
});
exports.findIfEmailExist = findIfEmailExist;
const validateUser = (otp, id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.default.findById(id);
    if (!user) {
        throw new Error("User does not exist");
    }
    if (user && user.otp !== otp) {
        throw new Error("Invalid otp");
    }
    return User_1.default.findByIdAndUpdate(id, { isVerified: true });
});
exports.validateUser = validateUser;
const findIfAdminExist = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const admin = yield Admin_1.default.findOne({ email });
    if (!admin)
        throw new Error("Admin does not exist");
    return admin;
});
exports.findIfAdminExist = findIfAdminExist;
const validateAdmin = (otp, id) => __awaiter(void 0, void 0, void 0, function* () {
    const admin = yield Admin_1.default.findById(id);
    if (!admin)
        throw new Error("Admin does not exist");
    if (admin && admin.otp !== otp)
        throw new Error("Invalid OTP");
    return admin;
});
exports.validateAdmin = validateAdmin;
const findIfEmailExistAndIsVerified = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.default.findOne({ email });
    if (!user) {
        throw new Error("User does not exist");
    }
    if (user.isVerified === true) {
        throw new Error("User already verified");
    }
    const otp = (0, generateOtp_1.generateOtp)();
    try {
        yield (0, verifyUser_1.verifyEmail)(user.phone, user.email, otp);
        yield User_1.default.findByIdAndUpdate(user._id, { otp });
    }
    catch (e) {
        console.log(e);
    }
    return otp;
});
exports.findIfEmailExistAndIsVerified = findIfEmailExistAndIsVerified;
const updateOrders = () => __awaiter(void 0, void 0, void 0, function* () {
    let orders = yield Order_1.default.find({});
    let len = orders.length;
    for (len; len--;) {
        const date = (0, TimeDiff_1.getTimeDiff)(orders[len].createdAt);
        if (orders[len].shipping == "Express") {
            if (date > 1) {
                yield orderUpdate(orders[len]._id);
            }
        }
        else {
            if (date > 2) {
                yield orderUpdate(orders[len]._id);
            }
        }
    }
});
exports.updateOrders = updateOrders;
const orderUpdate = (_id) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield Order_1.default.findById(_id);
    if (order) {
        order.active = true;
        yield order.save();
    }
});
const updateShipping = () => __awaiter(void 0, void 0, void 0, function* () {
    helpers_1.logger.info("Updating shipping is called every 2mins");
    const orders = yield Order_1.default.find({ status: "processed" });
    let orderLength = orders.length;
    for (orderLength; orderLength--;) {
        const { updateShipping, shipping, updated } = orders[orderLength];
        const timeDiff = (0, TimeDiff_1.getTimeDiff)(updateShipping);
        if (shipping === "Express" && updated && timeDiff > 1) {
            helpers_1.logger.info(`I tried updating this order ${shipping}`);
            orders[orderLength].status = "shipped";
            yield orders[orderLength].save();
            yield wallet_1.WalletService.updateAvailablePayout({ orderId: orders[orderLength]._id });
        }
        if (shipping === "Standard" && updated && timeDiff > 2) {
            orders[orderLength].status = "shipped";
            yield orders[orderLength].save();
            yield wallet_1.WalletService.updateAvailablePayout({ orderId: orders[orderLength]._id });
        }
    }
});
exports.updateShipping = updateShipping;
const updateHotdeals = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let products = yield Product_1.default.find({ hot: true });
        let productLength = products.length;
        for (productLength; productLength--;) {
            const { productUpdatedDate } = products[productLength];
            if ((0, TimeDiff_1.getTimeDiff)(productUpdatedDate) > 720) {
                // Re-fetch the product from the database
                const product = yield Product_1.default.findById(products[productLength]._id);
                if (product) {
                    product.hot = false;
                    yield product.save();
                    // Update the product in the array
                    products[productLength] = product;
                }
                else {
                    console.error(`No product found with ID ${products[productLength]._id}`);
                }
            }
        }
    }
    catch (e) {
        console.log(e);
    }
});
exports.updateHotdeals = updateHotdeals;
const updateActivity = () => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield Order_1.default.find({ status: "shipped" });
    let length = orders.length;
    for (length; length--;) {
        const date = (0, TimeDiff_1.getTimeDiff)(orders[length].createdAt);
        const { productId, sellerId, shippingCost, amount } = orders[length];
        const store = yield Store_1.default.findOne({ owner: sellerId });
        const seller = yield Seller_1.default.findById(store === null || store === void 0 ? void 0 : store.owner);
        const feeRate = (seller === null || seller === void 0 ? void 0 : seller.package) === "free" ? 10 : 5;
        if (date > 216 && !orders[length].activity) {
            orders[length].activity = true;
            const bill = shippingCost + amount - (feeRate / 100) * amount;
            const activity = new Activity_1.default({
                sellerId,
                productId,
                bill,
            });
            yield activity.save();
            orders[length].save();
            const store = yield Store_1.default.findOne({ owner: sellerId });
            if (!store)
                return;
            store.balance = store.balance + bill;
            yield store.save();
        }
    }
});
exports.updateActivity = updateActivity;
const createCheckoutSession = (customer, price, type) => __awaiter(void 0, void 0, void 0, function* () {
    const success_url = type
        ? `${baseUrl_1.default}seller/renewal/success`
        : `${baseUrl_1.default}seller/payment/success`;
    const cancel_url = type
        ? `${baseUrl_1.default}seller/renewal/cancel`
        : `${baseUrl_1.default}seller/payment/cancel`;
    try {
        const session = yield app_1.stripe.checkout.sessions.create({
            customer,
            mode: "subscription",
            // payment_method_types: ['card'],
            line_items: [
                {
                    price,
                    quantity: 1,
                },
            ],
            success_url,
            cancel_url,
        });
        return session;
    }
    catch (e) {
        console.log(e);
    }
});
exports.createCheckoutSession = createCheckoutSession;
const createPaymentCheckout = (customer, priceData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const session = yield app_1.stripe.checkout.sessions.create({
            customer,
            mode: "payment",
            line_items: priceData,
            success_url: `${baseUrl_1.default}account/rate`,
            cancel_url: `${baseUrl_1.default}seller/payment/cancel`,
        });
        return session;
    }
    catch (e) {
        console.log(e);
    }
});
exports.createPaymentCheckout = createPaymentCheckout;
const generateRandomX = (length) => {
    let result = "";
    let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};
exports.generateRandomX = generateRandomX;
const checkSubscription = (endDate) => {
    const currentDate = new Date();
    const twoDaysAfterEnd = new Date(endDate);
    twoDaysAfterEnd.setDate(twoDaysAfterEnd.getDate() + 2);
    if (currentDate > twoDaysAfterEnd) {
        return true;
    }
    else {
        return false;
    }
};
exports.checkSubscription = checkSubscription;
// Usage example
const subscriptionEndDate = new Date("2023-07-10"); // Replace with the actual subscription end date
(0, exports.checkSubscription)(subscriptionEndDate);
const calculateTotal = (products) => products.reduce((a, b) => a + b.quantity, 0);
const orderPlacedNotification = (email, products, address, user, shipping) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    const symbol = (_b = (_a = (constant_1.exchangeCurrency.find(c => c.label === user.currency))) === null || _a === void 0 ? void 0 : _a.symbol) !== null && _b !== void 0 ? _b : "$";
    const userRate = yield (0, currencyRate_1.calculateRate)((_d = (_c = user.currency) === null || _c === void 0 ? void 0 : _c.toLowerCase()) !== null && _d !== void 0 ? _d : "usd");
    let productLength = products.length;
    let totalAmount = 0;
    let message = "";
    let shippingPrice = 0;
    for (productLength; productLength--;) {
        const x = products[productLength];
        const productRate = yield (0, currencyRate_1.calculateRate)((_f = (_e = (x.productId.owner.currency)) === null || _e === void 0 ? void 0 : _e.toLowerCase()) !== null && _f !== void 0 ? _f : "usd");
        const { shipping: existingShipping } = x.productId;
        const shippingNewPrice = shipping === "Standard" ? existingShipping[0].standard.price : existingShipping[0].express.price;
        shippingPrice += productRate * shippingNewPrice / userRate;
        totalAmount += productRate * (x.price + shippingNewPrice) / userRate;
        const photo = x.photo;
        const orderDatas = yield Order_1.default.find({ productId: x.productId._id });
        const orderId = orderDatas[0]._id;
        message += `
            <tr>
                <td align="center" width="30%">
            <img src=${photo} alt="Product Image" style="display: block; width: 100%; height: auto; border-radius: 10px;">
                </td>
                <td align="left" style="padding: 10px;">
            <sub style="font-size: 10px; text-align: left;"> Order ID: ${orderId}</sub>
            <p style="font-size: 14px; margin: 0;">${x.name}</p>
            
            ${x.variants.length > 0 ?
            x.variants.map((y) => {
                return `<span style="font-size: 12px; margin: 0;">${y.variant} - ${y.option}</span>`;
            }).join("/")
            : ""}
            <p style="font-size: 12px; margin: 0;">Unit - ${x.quantity}</p>
                <p style="font-size: 12px; margin: 0;">${symbol} ${(x.price * productRate / userRate).toFixed(2)}</p>
            </td>   
            </tr>
            `;
    }
    ;
    const addr = yield Address_1.default.findById(address);
    yield (0, verifyUser_1.OrderPlacedNotification)(totalAmount, email, message, shipping, shippingPrice, addr, user);
});
const findSellerEmail = (owner) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const seller = yield Seller_1.default.findById(owner);
        const sellerId = seller._id;
        const user = yield User_1.default.findOne({ sellerId });
        return user.email;
    }
    catch (e) {
        console.log(e);
    }
});
const extractDataForOrdersUpdate = (order) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id, userId, shippingProvider, shippingCost, shipping, productId, trackingId, variants, address, createdAt, quantity, } = order;
        const addressData = yield Address_1.default.findById(address);
        const user = yield User_1.default.findById(userId);
        const product = yield Product_1.default.findById(productId).populate({
            path: "owner",
            model: Store_1.default,
            populate: {
                path: "owner",
                model: Seller_1.default,
            },
        });
        if (!product)
            return;
        yield (0, verifyUser_1.updateOrderShippedNotification)(_id, trackingId, shippingProvider, addressData, user, product, 
        // @ts-ignore
        variants, shipping, shippingCost, createdAt, quantity);
    }
    catch (e) {
        console.log(e);
    }
});
exports.extractDataForOrdersUpdate = extractDataForOrdersUpdate;
const sendOrderDeliveryNotification = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield Order_1.default.find({ status: "shipped" });
        let orderLength = orders.length;
        for (orderLength; orderLength--;) {
            const { shippingProvider, shippingCost, productId, userId, shipping, trackingId, variants, address, createdAt, quantity } = orders[orderLength];
            const product = yield Product_1.default.findById(productId).populate({
                path: "owner",
                model: Store_1.default,
                populate: {
                    path: "owner",
                    model: Seller_1.default,
                },
            });
            if (!product)
                continue;
            const user = yield User_1.default.findById(userId);
            orders[orderLength].status = "delivered";
            yield orders[orderLength].save();
            yield (0, verifyUser_1.orderDeliveredSuccessfully)(trackingId, shippingProvider, address, user, product, variants, shipping, shippingCost, createdAt, quantity);
        }
    }
    catch (e) {
        console.log(e);
    }
});
exports.sendOrderDeliveryNotification = sendOrderDeliveryNotification;
const disableUnsoldProductsForFreePlanSellers = () => __awaiter(void 0, void 0, void 0, function* () {
    const productCreatedAt = (0, TimeDiff_1.getLastweek)(60);
    try {
        const sellers = yield Seller_1.default.find({ package: "free" });
        let length = sellers.length;
        for (length; length--;) {
            const { _id } = sellers[length];
            const store = yield Store_1.default.findOne({ owner: _id });
            if (!store)
                continue;
            if (store) {
                const products = yield Product_1.default.find({
                    orders: 0,
                    owner: store._id,
                });
                let productLength = products.length;
                for (productLength; productLength--;) {
                    const { createdAt } = products[productLength];
                    if (createdAt > productCreatedAt) {
                        products[productLength].active = false;
                        yield products[productLength].save();
                    }
                }
            }
        }
    }
    catch (error) { }
});
exports.disableUnsoldProductsForFreePlanSellers = disableUnsoldProductsForFreePlanSellers;
const addToOrders = (cart, email, user, address, shipping) => __awaiter(void 0, void 0, void 0, function* () {
    if (!cart)
        return;
    const sellerIds = [];
    const products = cart.products;
    const { bill } = cart;
    let productsLength = products.length;
    const shippingPrice = [];
    try {
        for (productsLength; productsLength--;) {
            const product = products[productsLength].productId;
            if (!product) {
                throw new Error("Product not found");
            }
            const { productId, name, quantity, price, variants } = products[productsLength];
            let variantLength = variants.length;
            if (variantLength > 0) {
                for (variantLength; variantLength--;) {
                    const { variant, option } = variants[variantLength];
                    //@ts-ignore
                    const updateProduct = product === null || product === void 0 ? void 0 : product.variants.find((x) => x.variant === variant && x.option === option);
                    //@ts-ignore
                    const updateProduct2 = product === null || product === void 0 ? void 0 : product.variants.filter((x) => x.variant !== variant && x.option !== option);
                    product === null || product === void 0 ? void 0 : product.variants.forEach((x) => {
                        if (x.variant === variant && x.option === option) {
                            if (x.stock === 0)
                                return;
                            x.stock = x.stock - quantity;
                        }
                    });
                    yield (product === null || product === void 0 ? void 0 : product.save());
                }
            }
            const { shipping: existingShipping, owner } = product;
            const shippingNewPrice = shipping === "Standard"
                ? existingShipping[0].standard.price
                : existingShipping[0].express.price;
            shippingPrice.push(shippingNewPrice);
            const newShipping = new Shipping_1.default({
                price: shippingNewPrice,
                storeId: owner._id,
            });
            yield newShipping.save();
            if ((product === null || product === void 0 ? void 0 : product.quantity) <= 0) {
                throw new Error("Product is out of stock");
            }
            product.quantity = product.quantity - quantity;
            product.orders = product.orders + 1;
            yield (product === null || product === void 0 ? void 0 : product.save());
            const store = yield Store_1.default.findById(owner._id);
            const sellerId = store.owner;
            sellerIds.push(sellerId);
            const email = yield findSellerEmail(sellerId);
            // @ts-ignore
            store === null || store === void 0 ? void 0 : store.sales = (store === null || store === void 0 ? void 0 : store.sales) + 1;
            yield (store === null || store === void 0 ? void 0 : store.save());
            const order = new Order_1.default({
                sellerId: owner._id,
                userId: user._id,
                productId: productId._id,
                name,
                shippingCost: shippingNewPrice,
                amount: bill,
                shipping,
                quantity,
                price,
                variants,
                address: new mongodb_1.ObjectId(address),
            });
            yield order.save();
            yield wallet_1.WalletService.createWalletPayout({
                ownerId: owner._id,
                amount: quantity * price + shippingNewPrice,
                orderId: order._id,
            });
            yield (0, verifyUser_1.sellerOrderReceived)(products[productsLength], email, shipping, shippingNewPrice, order._id);
        }
        yield orderPlacedNotification(email, products, address, user, shipping);
        for (let i = 0; i < sellerIds.length; i++) {
            let info = sellerIds[i];
            const newNotification = new Notication_1.default({
                from: `seller-${info}`,
                to: "SELLER",
                senderRole: "SELLER",
                title: "Store Notification",
                content: "You have a New Order",
                isRead: false,
                sellerId: info,
            });
            yield newNotification.save();
        }
        return sellerIds;
    }
    catch (e) {
        console.log(e);
    }
});
exports.addToOrders = addToOrders;
const saveVerifiedSeller = (user_id, endDate, sub_id, plan) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const seller = yield Seller_1.default.findOne({ owner: user_id });
        if (!seller) {
            return;
        }
        seller.endDate = endDate;
        seller.isVerified = true;
        seller.subId = sub_id;
        seller.package = plan;
        yield seller.save();
    }
    catch (e) {
        console.log(e);
    }
});
exports.saveVerifiedSeller = saveVerifiedSeller;
const getBiggestNumber = (first, second, order) => {
    if (order)
        return first > second ? first : second;
    else
        return first > second ? second : first;
};
exports.getBiggestNumber = getBiggestNumber;
const replaceNull = (value) => (value ? value : 0);
exports.replaceNull = replaceNull;
const getTotalSales = (orders) => orders.reduce((partial, a) => partial + a.price * a.quantity, 0);
exports.getTotalSales = getTotalSales;
const getTotalShippingPrice = (order) => order.reduce((a, b) => a + b.shippingCost, 0);
exports.getTotalShippingPrice = getTotalShippingPrice;
const getOrdersRange = (firstDate, secondDate) => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield Order_1.default.find({
        createdAt: {
            $gte: firstDate,
            $lte: secondDate,
        },
    });
    return orders;
});
exports.getOrdersRange = getOrdersRange;
const getOrdersRangeForSeller = (firstDate, secondDate, sellerId) => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield Order_1.default.find({
        createdAt: {
            $gte: firstDate,
            $lte: secondDate,
        },
        sellerId,
    }).or([
        { status: "shipped" },
        { status: "delivered" },
        { status: "processed" },
    ]);
    return orders;
});
exports.getOrdersRangeForSeller = getOrdersRangeForSeller;
const getSellerRange = (firstDate, secondDate) => __awaiter(void 0, void 0, void 0, function* () {
    const sellers = yield Seller_1.default.find({
        createdAt: {
            $gte: firstDate,
            $lte: secondDate,
        },
    });
    return sellers;
});
exports.getSellerRange = getSellerRange;
const getUserRange = (firstDate, secondDate) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield User_1.default.find({
        createdAt: {
            $gte: firstDate,
            $lte: secondDate,
        },
    });
    return users;
});
exports.getUserRange = getUserRange;
const getUserByCountry = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield User_1.default.aggregate([
        {
            $match: {
                country: { $ne: null },
                sellerId: { $exists: false }
            }
        },
        {
            $group: {
                _id: "$country",
                userCount: { $sum: 1 }
            }
        },
        {
            $sort: { userCount: -1 }
        },
        {
            $limit: 7
        }
    ]);
    ;
    return users;
});
exports.getUserByCountry = getUserByCountry;
const getSellerByCountry = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield User_1.default.aggregate([
        {
            $match: {
                country: { $ne: null },
                sellerId: { $exists: true }
            }
        },
        {
            $group: {
                _id: "$country",
                userCount: { $sum: 1 }
            }
        },
        {
            $sort: { userCount: -1 }
        },
        {
            $limit: 7
        }
    ]);
    ;
    return users;
});
exports.getSellerByCountry = getSellerByCountry;
const getRefundRange = (storeId, firstDate, secondDate) => __awaiter(void 0, void 0, void 0, function* () {
    const refunds = yield Refund_1.default.find({
        createdAt: {
            $gte: firstDate,
            $lte: secondDate,
        },
        storeId,
    });
    return refunds;
});
exports.getRefundRange = getRefundRange;
const getProductRange = (firstDate, secondDate) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield Product_1.default.find({
        createdAt: {
            $gte: firstDate,
            $lte: secondDate,
        },
    });
    return products;
});
exports.getProductRange = getProductRange;
const handleSortRep = (sellerId) => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield Order_1.default.find({ sellerId });
    const sold = orders.length;
    const store = yield Store_1.default.findOne({ owner: sellerId });
    if (sold >= 20 && sold < 100) {
        store.sold = sold;
        store.reputation = store.reputation + 2;
        yield store.save();
        return;
    }
    if (sold < 20)
        return;
    if (sold - store.sold >= 100) {
        store.reputation = store.reputation + 2;
        store.sold = sold;
        yield store.save();
    }
    const getLastMonth = (0, TimeDiff_1.getLastweek)(28);
    const refunds = yield (0, exports.getRefundRange)(store._id, getLastMonth, Date.now());
    if (store.lastCheck < 28)
        return;
    if (refunds.length > 10) {
        store.lastCheck = 1;
        store.reputation = store.reputation - 4;
        yield store.save();
    }
});
const deleteCartProduct = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    const cart = yield Cart_1.default.find({ "products.productId": productId });
    let cartLength = cart.length;
    for (cartLength; cartLength--;) {
        const productIndex = cart[cartLength].products.findIndex((product) => product.productId === productId);
        if (productIndex > -1) {
            let product = cart[cartLength].products[productIndex];
            cart[cartLength].bill -= product.quantity * product.price;
            if (cart[cartLength].bill < 0) {
                cart[cartLength].bill = 0;
            }
            cart[cartLength].products.splice(productIndex, 1);
            cart[cartLength].bill = cart[cartLength].products.reduce((acc, cur) => acc + cur.quantity * cur.price, 0);
            yield cart[cartLength].save();
        }
    }
});
const deleteWish = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    yield Wish_1.default.deleteMany({ productId });
});
const updateCart = () => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield Product_1.default.find({ quantity: 0 });
    let productLength = products.length;
    for (productLength; productLength--;) {
        yield deleteCartProduct(products[productLength]._id);
        yield deleteWish(products[productLength]._id);
    }
});
exports.updateCart = updateCart;
const handleSetSellerRep = () => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield Order_1.default.find({});
    let length = orders.length;
    for (length; length--;) {
        yield handleSortRep(orders[length].sellerId);
    }
});
exports.handleSetSellerRep = handleSetSellerRep;
const days_passed = (dt) => {
    let current = new Date(dt.getTime());
    let previous = new Date(dt.getFullYear(), 0, 1);
    // @ts-ignore
    return Math.ceil((current - previous + 1) / 86400000);
};
exports.days_passed = days_passed;
const round = (N) => {
    const fixed = N.toFixed(0);
    const length = fixed.toString().length;
    if (length === 1)
        return N;
    const numerHolder = [
        {
            number: 2,
            dec: 10,
        },
        {
            number: 3,
            dec: 100,
        },
        {
            number: 4,
            dec: 1000,
        },
        {
            number: 5,
            dec: 100000,
        },
        {
            number: 6,
            dec: 1000000,
        },
    ];
    const round = numerHolder.find((num) => num.number === length);
    const ceil = Math.ceil(N / round.dec) * round.dec;
    let str = ceil.toString().slice(0, -3);
    return parseInt(str);
};
exports.round = round;
const createPortal = (name) => __awaiter(void 0, void 0, void 0, function* () {
    const configuration = yield app_1.stripe.billingPortal.configurations.create({
        features: {
            subscription_update: {
                default_allowed_updates: [],
                enabled: true,
                products: "",
                proration_behavior: "none",
            },
            subscription_cancel: {
                cancellation_reason: {
                    enabled: true,
                    options: [],
                },
                enabled: true,
                mode: "at_period_end",
            },
        },
        business_profile: {
            headline: `Hi ${name}, Welcome to your portal`,
            privacy_policy_url: `${baseUrl_1.default}/policy`,
            terms_of_service_url: `${baseUrl_1.default}/terms`,
        },
    });
    return configuration;
});
exports.createPortal = createPortal;
const updateStoreActivity = () => __awaiter(void 0, void 0, void 0, function* () {
    let stores = yield Store_1.default.find({});
    let storeLength = stores.length;
    for (storeLength; storeLength--;) {
        const lastUpdated = (0, TimeDiff_1.getTimeDiff)(stores[storeLength].updatedAt);
        if (lastUpdated > 6) {
            // Re-fetch the store from the database
            const store = yield Store_1.default.findById(stores[storeLength]._id);
            if (store) {
                store.disabled = false;
                yield store.save();
                // Update the store in the array
                stores[storeLength] = store;
            }
        }
    }
});
exports.updateStoreActivity = updateStoreActivity;
const deleteInvalidStores = () => __awaiter(void 0, void 0, void 0, function* () {
    const stores = yield Store_1.default.find({});
    let storeLength = stores.length;
    for (storeLength; storeLength--;) {
        const { owner } = stores[storeLength];
        const seller = yield Seller_1.default.findById(owner);
        if (!seller) {
            stores[storeLength].delete();
        }
    }
});
exports.deleteInvalidStores = deleteInvalidStores;
const deleteInvalidProductsRating = () => __awaiter(void 0, void 0, void 0, function* () {
    const ratings = yield Rating_1.default.find({});
    let length = ratings.length;
    for (length; length--;) {
        const { productId } = ratings[length];
        const product = yield Product_1.default.findById(productId);
        if (product)
            continue;
        if (!productId) {
            ratings[length].delete();
            continue;
        }
        Rating_1.default.deleteMany({ productId });
    }
});
exports.deleteInvalidProductsRating = deleteInvalidProductsRating;
const deleteInvalidProductsReviews = () => __awaiter(void 0, void 0, void 0, function* () {
    const reviews = yield Review_1.default.find({});
    let length = reviews.length;
    for (length; length--;) {
        const { productId } = reviews[length];
        const product = yield Product_1.default.findById(productId);
        if (product)
            continue;
        yield reviews[length].delete();
        Review_1.default.deleteMany({ productId });
    }
});
exports.deleteInvalidProductsReviews = deleteInvalidProductsReviews;
const deleteInvalidProductOrders = () => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield Order_1.default.find({});
    let length = orders.length;
    for (length; length--;) {
        const { productId } = orders[length];
        const product = yield Product_1.default.findById(productId);
        if (product)
            continue;
        yield orders[length].delete();
        Order_1.default.deleteMany({ productId });
    }
});
exports.deleteInvalidProductOrders = deleteInvalidProductOrders;
const deleteInvalidProductActivity = () => __awaiter(void 0, void 0, void 0, function* () {
    const activities = yield Activity_1.default.find({});
    let length = activities.length;
    for (length; length--;) {
        const { productId } = activities[length];
        const product = yield Product_1.default.findById(productId);
        if (product)
            continue;
        yield activities[length].delete();
    }
});
exports.deleteInvalidProductActivity = deleteInvalidProductActivity;
const deleteInvalidProductRefund = () => __awaiter(void 0, void 0, void 0, function* () {
    const refunds = yield Refund_1.default.find({});
    let length = refunds.length;
    for (length; length--;) {
        const { productId } = refunds[length];
        const product = yield Product_1.default.findById(productId);
        if (product)
            continue;
        yield refunds[length].delete();
    }
});
exports.deleteInvalidProductRefund = deleteInvalidProductRefund;
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
exports.capitalizeFirstLetter = capitalizeFirstLetter;
function unCapitalizeFirstLetter(string) {
    return string.charAt(0).toLowerCase() + string.slice(1);
}
exports.unCapitalizeFirstLetter = unCapitalizeFirstLetter;
const updateUserCart = (owner, productId, sign) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cart = yield Cart_1.default.findOne({ owner });
        const product = yield Product_1.default.findOne({
            _id: new mongodb_1.ObjectId(productId),
        });
        if (!product) {
            throw new Error("Product not found");
        }
        // const price : number = product.price;
        const productQuantity = product.quantity;
        if (cart) {
            const productIndex = cart.products.findIndex((product) => product.productId.toHexString() === productId);
            if (productIndex > -1) {
                let product = cart.products[productIndex];
                if (sign && product.quantity + 1 > productQuantity) {
                    throw new Error("Product quantity exceeded");
                }
                product.quantity = sign ? product.quantity + 1 : product.quantity - 1;
                cart.bill = cart.products.reduce((acc, cur) => acc + cur.quantity * cur.price, 0);
                cart.products[productIndex] = product;
                yield cart.save();
            }
        }
    }
    catch (e) {
        console.log(e);
        throw new Error("Something went error" + e);
    }
});
exports.updateUserCart = updateUserCart;
const deactivateSellerProducts = (store) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield Product_1.default.find({ owner: store._id });
        let productLength = products.length;
        for (productLength; productLength--;) {
            products[productLength].active = !products[productLength].active;
            yield products[productLength].save();
        }
    }
    catch (error) { }
});
exports.deactivateSellerProducts = deactivateSellerProducts;
const updateProductStatus = () => __awaiter(void 0, void 0, void 0, function* () {
    const sellers = yield Seller_1.default.find({ package: "free" });
    for (const seller of sellers) {
        const store = yield Store_1.default.findOne({ owner: seller._id });
        if (!store) {
            helpers_1.logger.info(`store not found for seller ${seller._id}`);
        }
        else {
            yield getProductByStoreId(String(store === null || store === void 0 ? void 0 : store._id));
        }
    }
});
exports.updateProductStatus = updateProductStatus;
const getProductByStoreId = (storeId) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield Product_1.default.find({
        owner: storeId,
        active: true,
        publish: true,
    });
    // logger.info(`store products ${products.length}`);
    for (const product of products) {
        const order = yield Order_1.default.findOne({ productId: product._id }).sort({
            createdAt: -1,
        });
        if (!order) {
            helpers_1.logger.info(`no order from this product ${product._id}`);
        }
        else {
            yield updateProductByOrderDate(order === null || order === void 0 ? void 0 : order.createdAt, product._id);
        }
    }
});
const updateProductByOrderDate = (orderDate, productId) => __awaiter(void 0, void 0, void 0, function* () {
    const date = (0, TimeDiff_1.getTimeDiff)(orderDate);
    const twentyDays = 24 * 20;
    if (date > twentyDays) {
        yield Product_1.default.updateOne({ _id: productId }, {
            $set: {
                active: false,
            },
        });
    }
});
