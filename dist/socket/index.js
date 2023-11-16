"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.sendNotification = exports.getIo = exports.initializeSocket = void 0;
const socketIo = __importStar(require("socket.io"));
const mongodb_1 = require("mongodb");
const cloudinary_1 = __importDefault(require("cloudinary"));
const types_1 = require("./types");
const Notication_1 = __importDefault(require("../Models/Notication"));
const User_1 = __importDefault(require("../Models/User"));
const Message_1 = __importDefault(require("../Models/Message"));
const ChatRoom_1 = __importDefault(require("../Models/ChatRoom"));
cloudinary_1.default.v2.config({
    cloud_name: process.env.CLOUDNAME,
    api_key: process.env.CLOUDAPI,
    api_secret: process.env.CLOUDSECRET,
});
let io;
let totalSockets = [];
const initializeSocket = (server) => {
    io = new socketIo.Server(server, {
        cors: {
            origin: "*",
        },
    });
    io.on("connection", (socket) => {
        socket.on("disconnect", () => {
            const existingSocket = totalSockets.findIndex((total) => total.socket === socket);
            if (existingSocket !== -1) {
                const deletedSocket = totalSockets.splice(existingSocket, 1)[0];
            }
        });
        socket.on(types_1.SOCKET_CHANNELS.JOIN, ({ userInfo, role }) => {
            switch (role) {
                case types_1.USER_ROLE.ADMIN:
                    socket.join(types_1.USER_ROOM.ADMIN_ROOM);
                    break;
                case types_1.USER_ROLE.SELLER:
                    socket.data.userInfo = userInfo;
                    totalSockets.unshift({
                        socket,
                        userId: new mongodb_1.ObjectId(userInfo._id),
                        sellerId: new mongodb_1.ObjectId(userInfo._sellerId),
                    });
                    socket.join(types_1.USER_ROOM.SELLER_ROOM);
                    break;
                case types_1.USER_ROLE.BUYER:
                    socket.data.userInfo = userInfo;
                    totalSockets.unshift({
                        socket,
                        userId: new mongodb_1.ObjectId(userInfo._id),
                        sellerId: new mongodb_1.ObjectId(userInfo._sellerId),
                    });
                    socket.join(types_1.USER_ROOM.BUYER_ROOM);
                    break;
                default:
                    socket.data.userInfo = userInfo;
                    totalSockets.unshift({
                        socket,
                        userId: new mongodb_1.ObjectId(userInfo._id),
                        sellerId: new mongodb_1.ObjectId(userInfo._sellerId),
                    });
                    socket.join(types_1.USER_ROOM.BUYER_ROOM);
                    break;
            }
        });
        socket.on(types_1.SOCKET_CHANNELS.JOIN_CHAT, (roomName) => {
            socket.join(roomName);
        });
        socket.on(types_1.SOCKET_CHANNELS.SEND_MESSAGE, (message) => __awaiter(void 0, void 0, void 0, function* () {
            const newMessage = new Message_1.default(message);
            yield newMessage.save();
            const chatRoom = yield ChatRoom_1.default.findOne({ roomName: message.roomName });
            if ((chatRoom === null || chatRoom === void 0 ? void 0 : chatRoom.deletedBySellerId) == chatRoom.sellerId) {
                yield ChatRoom_1.default.updateOne({
                    roomName: message.roomName
                }, { $set: { deletedBySellerId: null, deletedByRole: null } });
            }
            else if ((chatRoom === null || chatRoom === void 0 ? void 0 : chatRoom.deletedByBuyerId) == chatRoom.buyerId) {
                yield ChatRoom_1.default.updateOne({
                    roomName: message.roomName
                }, { $set: { deletedByBuyerId: null, deletedByRole: null } });
            }
            else if (chatRoom.deletedByRole == "admin") {
                yield ChatRoom_1.default.updateOne({
                    roomName: message.roomName
                }, { $set: { deletedByRole: null } });
                yield Message_1.default.updateMany({
                    roomName: message.roomName
                }, { $set: { deletedByRole: null } });
            }
            io.to(message.roomName).emit(types_1.SOCKET_CHANNELS.RECEIVE_MESSAGE, newMessage);
        }));
        socket.on(types_1.SOCKET_CHANNELS.SEND_NOTIFICATION, (notification) => __awaiter(void 0, void 0, void 0, function* () {
            const newNotification = new Notication_1.default(notification);
            yield newNotification.save();
            if (notification.language) {
                let users = [];
                if (notification.to == types_1.NOTIFICATION_TARGET.SELLER) {
                    users = yield User_1.default.find({ language: notification.language, role: 'seller' });
                }
                else if (notification.to == types_1.NOTIFICATION_TARGET.All) {
                    users = yield User_1.default.find({ language: notification.language });
                }
                users.forEach((user) => __awaiter(void 0, void 0, void 0, function* () {
                    let notifiData = notification;
                    notifiData.from = (user === null || user === void 0 ? void 0 : user.role) + "-" + ((user === null || user === void 0 ? void 0 : user.role) === 'seller' ? user === null || user === void 0 ? void 0 : user.sellerId.toString() : user === null || user === void 0 ? void 0 : user._id.toString());
                    const newNotification = new Notication_1.default(notifiData);
                    yield newNotification.save();
                }));
            }
            switch (newNotification.to) {
                case types_1.NOTIFICATION_TARGET.All:
                    const receivers = yield User_1.default.find({ language: newNotification.language });
                    receivers.forEach((user) => {
                        socket
                            .to(user._id.toString())
                            .emit(types_1.SOCKET_CHANNELS.RECEIVE_NOTIFICATION, newNotification);
                    });
                    break;
                case types_1.NOTIFICATION_TARGET.BUYER:
                    socket.join(`${notification.from}`);
                    io
                        .to(`${notification.from}`)
                        .emit(types_1.SOCKET_CHANNELS.RECEIVE_NOTIFICATION, newNotification);
                    break;
                case types_1.NOTIFICATION_TARGET.SELLER:
                    const sellReceivers = yield User_1.default.find({ language: newNotification.language, role: 'seller' });
                    sellReceivers.forEach((user) => {
                        socket
                            .to(user._id.toString())
                            .emit(types_1.SOCKET_CHANNELS.RECEIVE_NOTIFICATION, newNotification);
                    });
                    break;
                case types_1.NOTIFICATION_TARGET.ADMIN:
                    socket
                        .to(types_1.USER_ROOM.ADMIN_ROOM)
                        .emit(types_1.SOCKET_CHANNELS.RECEIVE_NOTIFICATION, newNotification);
                    break;
                default:
                    if (!!newNotification.to) {
                        const userSocket = totalSockets.find((s) => { var _a; return s.userId.toString() === ((_a = newNotification.to) === null || _a === void 0 ? void 0 : _a.toString()); });
                        if (userSocket) {
                            userSocket.socket.emit(types_1.SOCKET_CHANNELS.RECEIVE_NOTIFICATION, newNotification);
                        }
                    }
            }
        }));
    });
};
exports.initializeSocket = initializeSocket;
const getIo = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};
exports.getIo = getIo;
const sendNotification = (type, notification, to) => {
    if (!io) {
        throw new Error('Socket.io not initialized!');
    }
    const userSocket = totalSockets.find(s => s.userId.toString() === to);
    if (userSocket) {
        userSocket.socket.emit(type, notification);
    }
};
exports.sendNotification = sendNotification;
