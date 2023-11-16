"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const objectId = mongoose_1.default.Types.ObjectId;
const feedbackSchema = new mongoose_1.default.Schema({
    user: {
        type: objectId,
        required: [true, "This is required"],
        ref: "user",
    },
    message: {
        required: true,
        type: String,
        trim: true,
        minLength: [10, 'Message must be at least 10 characters']
    },
    active: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});
const Feedback = mongoose_1.default.model('feedback', feedbackSchema);
exports.default = Feedback;
