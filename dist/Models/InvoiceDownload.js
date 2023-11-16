"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const objectId = mongoose_1.default.Types.ObjectId;
const invoiceDownloadSchema = new mongoose_1.default.Schema({
    userId: {
        required: true,
        ref: "User",
        type: objectId,
    },
    orderId: {
        required: true,
        ref: "Order",
        type: objectId,
    },
}, {
    timestamps: true,
});
const InvoiceDownload = mongoose_1.default.model("invoiceDownload", invoiceDownloadSchema);
exports.default = InvoiceDownload;
