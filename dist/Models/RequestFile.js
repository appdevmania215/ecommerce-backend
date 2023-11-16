"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const requestFileSchema = new mongoose_1.default.Schema({
    sellerId: {
        type: mongoose_1.default.Types.ObjectId,
        required: true,
        ref: 'Seller'
    },
    message: {
        type: String,
        required: true,
        trim: true
    }
});
const RequestFile = mongoose_1.default.model('requests', requestFileSchema);
exports.default = RequestFile;
