"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.controller = void 0;
const notification_controller_1 = require("./notification.controller");
const chatRoom_controller_1 = require("./chatRoom.controller");
const report_controller_1 = require("./report.controller");
exports.controller = {
    notificationController: notification_controller_1.notificationController,
    chatRoomController: chatRoom_controller_1.chatRoomController,
    ReportController: report_controller_1.ReportController,
};
