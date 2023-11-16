"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.services = void 0;
const notification_service_1 = require("./notification.service");
const chatRoom_service_1 = require("./chatRoom.service");
const report_service_1 = require("./report.service");
exports.services = {
    notificationService: notification_service_1.notificationService,
    chatRoomService: chatRoom_service_1.chatRoomService,
    reportService: report_service_1.reportService,
};
