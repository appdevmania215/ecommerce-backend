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
exports.chatRoomController = void 0;
const services_1 = require("../services");
const createChatRoom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield services_1.services.chatRoomService.createNewChatRoom(req.body);
        if (result.status === 'new') {
            res.status(201).json({ room: result.room });
        }
        else {
            res.status(200).json({ room: result.room });
        }
    }
    catch (e) {
        res.status(500).send('Internal Server Error');
    }
});
const getChatRoom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { buyerId, sellerId, isAdminLoggedIn } = req.query;
        const result = yield services_1.services.chatRoomService.getChatRoom(buyerId, sellerId, isAdminLoggedIn);
        res.status(200).send(result);
    }
    catch (e) {
        res.status(500).send('Internal Server Error');
    }
});
const getBuyerChatRoom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { buyerId } = req.query;
        const result = yield services_1.services.chatRoomService.getBuyerChatRoom(buyerId);
        res.status(200).send(result);
    }
    catch (e) {
        res.status(500).send('Internal Server Error');
    }
});
const getBuyerChatRoomForAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { roomName } = req.query;
        const result = yield services_1.services.chatRoomService.getBuyerChatRoomForAdmin(roomName);
        res.status(200).send(result);
    }
    catch (e) {
        res.status(500).send('Internal Server Error');
    }
});
const getAdminChatRoom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield services_1.services.chatRoomService.getAdminChatRoom();
        res.status(200).send(result);
    }
    catch (e) {
        res.status(500).send('Internal Server Error');
    }
});
const getSellerChatRoom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sellerId } = req.query;
        const result = yield services_1.services.chatRoomService.getSellerChatRoom(sellerId);
        res.status(200).send(result);
    }
    catch (e) {
        res.status(500).send('Internal Server Error');
    }
});
const deleteChatRoom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { roomId, sellerId, buyerId, role, adminId } = req.query;
        const user_id = role == 'user' ? buyerId : role == 'admin' ? adminId : sellerId;
        const result = yield services_1.services.chatRoomService.deleteChatRoom(roomId, user_id, role);
        res.status(200).send(result);
    }
    catch (e) {
        res.status(500).send('Internal Server Error');
    }
});
const deleteAdminChatRoom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { roomId, role } = req.query;
        const result = yield services_1.services.chatRoomService.deleteAdminChatRoom(roomId, role);
        res.status(200).send(result);
    }
    catch (e) {
        res.status(500).send('Internal Server Error');
    }
});
const closeChatRoom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { roomName } = req.body;
        const result = yield services_1.services.chatRoomService.closeChatRoom(roomName);
        res.status(result.status).send(result.chatRoom);
    }
    catch (e) {
        res.status(500).send('Internal Server Error');
    }
});
exports.chatRoomController = {
    createChatRoom,
    getChatRoom,
    closeChatRoom,
    getBuyerChatRoom,
    deleteChatRoom,
    getSellerChatRoom,
    getBuyerChatRoomForAdmin,
    getAdminChatRoom,
    deleteAdminChatRoom
};
