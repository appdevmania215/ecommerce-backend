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
exports.notificationService = void 0;
const Notication_1 = __importDefault(require("../Models/Notication"));
const readNotifications = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const notifications = yield Notication_1.default.find({ from: userId }).sort({ createdAt: "desc" }).exec();
    return notifications;
});
const markNotificationsRead = (id, user_id) => __awaiter(void 0, void 0, void 0, function* () {
    let result = null;
    if (id === 'all') {
        yield Notication_1.default.updateMany({
            from: user_id
        }, { $set: { isRead: true } }).exec();
        result = Notication_1.default.find({
            from: user_id
        }).exec();
    }
    else {
        yield Notication_1.default.updateOne({
            _id: id
        }, { $set: { isRead: true } }).exec();
        result = yield Notication_1.default.findOne({
            _id: id
        }).exec();
    }
    return result;
});
exports.notificationService = {
    readNotifications,
    markNotificationsRead
};
