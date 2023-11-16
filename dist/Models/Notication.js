"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const notificationSchema = new mongoose_1.default.Schema({
    from: {
        type: String,
        required: true,
    },
    to: {
        type: String,
        default: null
    },
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    sellerId: {
        type: String,
        default: null,
    },
    language: {
        type: String,
        default: null,
    },
    region: {
        type: String,
        default: null,
    },
    isRead: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});
const Notification = mongoose_1.default.model('notifications', notificationSchema);
exports.default = Notification;
