"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const chatRoomSchema = new mongoose_1.default.Schema({
    roomName: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    isAdminJoined: {
        type: Boolean,
        required: true,
        default: false,
    },
    status: {
        type: String,
        required: true,
        default: false
    },
    sellerId: {
        type: mongoose_1.default.Types.ObjectId,
        default: null,
    },
    buyerId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    productId: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'product',
        default: null,
    },
    deletedBySellerId: {
        type: String,
        default: null
    },
    deletedByBuyerId: {
        type: String,
        default: null
    },
    deletedByRole: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});
const ChatRoom = mongoose_1.default.model('ChatRoom', chatRoomSchema);
exports.default = ChatRoom;
