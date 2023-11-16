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
exports.ReportController = void 0;
const services_1 = require("../services");
const addNewReport = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield services_1.services.reportService.createReport(req.body);
        res.status(200).send(result);
    }
    catch (e) {
        res.status(500).send('Internal Server Error');
    }
});
const getReports = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield services_1.services.reportService.getAllReports();
        res.status(200).send(result);
    }
    catch (e) {
        res.status(500).send('Internal Server Error');
    }
});
exports.ReportController = {
    addNewReport,
    getReports,
};
