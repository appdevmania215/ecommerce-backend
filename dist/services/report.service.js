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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportService = void 0;
const Report_1 = __importDefault(require("../Models/Report"));
const Product_1 = __importDefault(require("../Models/Product"));
const Store_1 = __importDefault(require("../Models/Store"));
const Seller_1 = __importDefault(require("../Models/Seller"));
const User_1 = __importDefault(require("../Models/User"));
const createReport = (report) => __awaiter(void 0, void 0, void 0, function* () {
    const existing = yield Report_1.default.find({ productId: report.productId });
    if (existing.length !== 0) {
        let existingReport = existing[0];
        existingReport.reportAmount++;
        existingReport.save();
        return existingReport;
    }
    else {
        const newReport = new Report_1.default(Object.assign(Object.assign({}, report), { reportAmount: 1 }));
        yield newReport.save();
        return newReport;
    }
});
const getAllReports = () => __awaiter(void 0, void 0, void 0, function* () {
    const reports = yield Report_1.default.find({}).populate({
        path: 'productId',
        model: Product_1.default,
        populate: {
            path: 'owner',
            model: Store_1.default,
            populate: {
                path: 'owner',
                model: Seller_1.default,
                populate: {
                    path: 'owner',
                    model: User_1.default,
                }
            }
        }
    }).populate({
        path: 'owner',
        model: User_1.default
    });
    return reports;
});
exports.reportService = {
    createReport,
    getAllReports,
};
