"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const auth_1 = require("../Middleware/auth");
const router = (0, express_1.Router)();
router.get('/api/notification/:userId', auth_1.auth, controllers_1.controller.notificationController.getNotifications);
router.get('/api/notification/markRead/:id', auth_1.auth, controllers_1.controller.notificationController.markNotificationsRead);
exports.default = router;
