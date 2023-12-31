"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const auth_1 = require("../Middleware/auth");
const router = (0, express_1.Router)();
router.post('/chatRoom', controllers_1.controller.chatRoomController.createChatRoom);
router.get('/chatRoom/', controllers_1.controller.chatRoomController.getChatRoom);
router.get('/buyerChatRoom', controllers_1.controller.chatRoomController.getBuyerChatRoom);
router.get('/sellerChatRoom', controllers_1.controller.chatRoomController.getSellerChatRoom);
router.patch('/chatRoom/status', controllers_1.controller.chatRoomController.closeChatRoom);
router.delete('/deleteChatRoom', auth_1.auth, controllers_1.controller.chatRoomController.deleteChatRoom);
router.get('/buyerChatRoomForAdmin', auth_1.auth, controllers_1.controller.chatRoomController.getBuyerChatRoomForAdmin);
router.get('/adminChatRoom', controllers_1.controller.chatRoomController.getAdminChatRoom);
router.delete('/deleteAdminChatRoom', controllers_1.controller.chatRoomController.deleteAdminChatRoom);
exports.default = router;
