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
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationController = void 0;
const services_1 = require("../services");
const getNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        const notifications = yield services_1.services.notificationService.readNotifications(userId);
        res.status(200).json(notifications);
    }
    catch (e) {
        res.status(500).send('Internal Server Error');
    }
});
const markNotificationsRead = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const user = req.user;
        const user_id = user.role === 'seller' ? `seller-${user.sellerId}` : user.role === 'user' ? `user-${user._id}` : '';
        const notifications = yield services_1.services.notificationService.markNotificationsRead(id, user_id);
        res.status(200).json(notifications);
    }
    catch (e) {
        res.status(500).send('Internal Server Error');
    }
});
exports.notificationController = {
    getNotifications,
    markNotificationsRead
};
