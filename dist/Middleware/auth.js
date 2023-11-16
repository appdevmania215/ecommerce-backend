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
exports.activeSeller = exports.adminAuth = exports.sellerAuth = exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../Models/User"));
const Seller_1 = __importDefault(require("../Models/Seller"));
const Admin_1 = __importDefault(require("../Models/Admin"));
const app_1 = require("../app");
const helpers_1 = require("../Helpers/helpers");
const auth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = yield jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = yield User_1.default.findOne({ _id: decoded._id, 'tokens.token': token });
        const admin = yield Admin_1.default.findOne({ _id: decoded._id });
        if (!user) {
            if (!admin) {
                throw new Error();
            }
        }
        else {
            if (!(user === null || user === void 0 ? void 0 : user.isVerified)) {
                throw new Error('User is not verified');
            }
        }
        req.token = token;
        if (user) {
            req.user = user;
        }
        if (admin) {
            req.admin = admin;
        }
        next();
    }
    catch (e) {
        res.status(403).send({ error: 'Please Authenticate' });
    }
});
exports.auth = auth;
const sellerAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = yield jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const seller = yield Seller_1.default.findOne({ owner: decoded._id });
        if (!seller) {
            throw new Error();
        }
        req.seller = seller;
        next();
    }
    catch (e) {
        res.status(401).send({ error: 'Please Authenticate' });
    }
});
exports.sellerAuth = sellerAuth;
const adminAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = yield jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const admin = yield Admin_1.default.findOne({ _id: decoded._id, 'tokens.token': token });
        if (!admin) {
            throw new Error();
        }
        req.token = token;
        req.admin = admin;
        next();
    }
    catch (e) {
        res.status(403).send({ error: 'Please Authenticate' });
    }
});
exports.adminAuth = adminAuth;
const activeSeller = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = yield jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const seller = yield Seller_1.default.findOne({ owner: decoded._id });
        if (!seller) {
            throw new Error();
        }
        if (seller.package === 'Premium') {
            const sub = yield app_1.stripe.subscriptions.retrieve(seller.subId);
            const endDate = new Date(sub.current_period_end * 1000);
            const isPastGracePeriod = (0, helpers_1.checkSubscription)(endDate);
            if (isPastGracePeriod) {
                seller.package = 'free';
                yield seller.save();
            }
        }
        if (!seller.isVerified) {
            throw new Error('Seller is not verified');
        }
        req.seller = seller;
        next();
    }
    catch (e) {
        res.status(401).send({ error: 'Please Authenticate' });
    }
});
exports.activeSeller = activeSeller;
