"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const messageSchema = new mongoose_1.default.Schema({
    from: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'User'
    },
    roomName: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        required: false,
    },
    senderRole: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true
    },
    isRead: {
        type: String,
        required: true,
        default: false,
    },
    image: {
        type: String,
        default: null
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
const Message = mongoose_1.default.model('messages', messageSchema);
exports.default = Message;
