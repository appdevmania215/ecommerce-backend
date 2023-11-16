"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const objectId = mongoose_1.default.Types.ObjectId;
const replyContactSchema = new mongoose_1.default.Schema({
    contactId: {
        type: objectId,
        required: [true, "This is required"],
        ref: "contact",
    },
    title: {
        type: String,
        required: true,
        minLength: [4, "Must be a least 4 Characters"],
    },
    message: {
        type: String,
        required: true,
        minLength: [4, "Must be a least 4 Characters"],
    },
    active: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});
const ReplyContact = mongoose_1.default.model("replyContact", replyContactSchema);
exports.default = ReplyContact;
