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
exports.chatRoomService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const ChatRoom_1 = __importDefault(require("../Models/ChatRoom"));
const types_1 = require("../socket/types");
const Message_1 = __importDefault(require("../Models/Message"));
const Seller_1 = __importDefault(require("../Models/Seller"));
const createNewChatRoom = (chatRoom) => __awaiter(void 0, void 0, void 0, function* () {
    const existingRoom = yield ChatRoom_1.default.findOne({ roomName: chatRoom.roomName, status: types_1.CHATROOM_STATUS.OPENED });
    if (existingRoom) {
        const result = { room: existingRoom, status: 'existing' };
        return result;
    }
    else {
        const newChatRoom = new ChatRoom_1.default(chatRoom);
        yield newChatRoom.save();
        const result = { room: newChatRoom, status: 'new' };
        return result;
    }
});
const getChatRoom = (buyerId, sellerId, isAdminLoggedIn) => __awaiter(void 0, void 0, void 0, function* () {
    if (isAdminLoggedIn === 'true') {
        const chatRooms = yield ChatRoom_1.default.find({ status: types_1.CHATROOM_STATUS.OPENED, isAdminJoined: true });
        return chatRooms;
    }
    else {
        if (sellerId !== 'null') {
            const normalChat_buyer = yield ChatRoom_1.default.aggregate([
                {
                    $match: {
                        status: types_1.CHATROOM_STATUS.OPENED,
                        type: types_1.CHAT_TYPE.NORMAL_CHAT,
                        buyerId: new mongoose_1.default.Types.ObjectId(buyerId),
                    },
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'buyerId',
                        foreignField: '_id',
                        as: 'buyerDetails', // Alias for the joined buyer document
                    },
                },
                {
                    $lookup: {
                        from: 'products',
                        localField: 'productId',
                        foreignField: '_id',
                        as: 'productDetails', // Alias for the joined product document
                    },
                },
                {
                    $project: {
                        buyerId: 1,
                        roomName: 1,
                        type: 1,
                        isAdminJoined: 1,
                        status: 1,
                        sellerId: 1,
                        createdAt: 1,
                        updatedAt: 1,
                        buyerDetails: {
                            $arrayElemAt: [
                                {
                                    $map: {
                                        input: '$buyerDetails',
                                        as: 'buyer',
                                        in: {
                                            _id: '$$buyer._id',
                                            firstName: '$$buyer.firstName',
                                            lastName: '$$buyer.lastName',
                                        },
                                    },
                                },
                                0,
                            ],
                        },
                        productId: 1,
                        productDetails: {
                            $arrayElemAt: [
                                {
                                    $map: {
                                        input: '$productDetails',
                                        as: 'product',
                                        in: {
                                            _id: '$$product._id',
                                            title: '$$product.title',
                                        },
                                    },
                                },
                                0,
                            ],
                        },
                    },
                },
                {
                    $sort: {
                        createdAt: -1, // Sort in descending order
                    },
                },
            ]);
            // `normalChat_buyer` now contains the desired structure
            const normalChat_seller = yield ChatRoom_1.default.aggregate([
                {
                    $match: {
                        status: types_1.CHATROOM_STATUS.OPENED,
                        type: types_1.CHAT_TYPE.NORMAL_CHAT,
                        sellerId: new mongoose_1.default.Types.ObjectId(sellerId),
                    },
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'buyerId',
                        foreignField: '_id',
                        as: 'buyerDetails', // Alias for the joined buyer document
                    },
                },
                {
                    $lookup: {
                        from: 'products',
                        localField: 'productId',
                        foreignField: '_id',
                        as: 'productDetails', // Alias for the joined product document
                    },
                },
                {
                    $project: {
                        productId: 1,
                        roomName: 1,
                        type: 1,
                        isAdminJoined: 1,
                        status: 1,
                        sellerId: 1,
                        buyerId: 1,
                        createdAt: 1,
                        updatedAt: 1,
                        buyerDetails: {
                            $arrayElemAt: [
                                {
                                    $map: {
                                        input: '$buyerDetails',
                                        as: 'buyer',
                                        in: {
                                            _id: '$$buyer._id',
                                            firstName: '$$buyer.firstName',
                                            lastName: '$$buyer.lastName',
                                        },
                                    },
                                },
                                0,
                            ],
                        },
                        productDetails: {
                            $arrayElemAt: [
                                {
                                    $map: {
                                        input: '$productDetails',
                                        as: 'product',
                                        in: {
                                            _id: '$$product._id',
                                            title: '$$product.title',
                                        },
                                    },
                                },
                                0,
                            ],
                        },
                    },
                },
                {
                    $sort: {
                        createdAt: -1, // Sort in descending order
                    },
                },
            ]);
            // `refundChat_seller` now contains the desired structure
            const refundChat = yield ChatRoom_1.default.aggregate([
                {
                    $match: {
                        status: types_1.CHATROOM_STATUS.OPENED,
                        type: types_1.CHAT_TYPE.REFUND_CHAT,
                        sellerId: new mongoose_1.default.Types.ObjectId(sellerId),
                    },
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'buyerId',
                        foreignField: '_id',
                        as: 'buyerDetails', // Alias for the joined buyer document
                    },
                },
                {
                    $lookup: {
                        from: 'products',
                        localField: 'productId',
                        foreignField: '_id',
                        as: 'productDetails', // Alias for the joined product document
                    },
                },
                {
                    $project: {
                        productId: 1,
                        roomName: 1,
                        type: 1,
                        isAdminJoined: 1,
                        status: 1,
                        sellerId: 1,
                        createdAt: 1,
                        buyerId: 1,
                        updatedAt: 1,
                        buyerDetails: {
                            $arrayElemAt: [
                                {
                                    $map: {
                                        input: '$buyerDetails',
                                        as: 'buyer',
                                        in: {
                                            _id: '$$buyer._id',
                                            firstName: '$$buyer.firstName',
                                            lastName: '$$buyer.lastName',
                                        },
                                    },
                                },
                                0,
                            ],
                        },
                        productDetails: {
                            $arrayElemAt: [
                                {
                                    $map: {
                                        input: '$productDetails',
                                        as: 'product',
                                        in: {
                                            _id: '$$product._id',
                                            title: '$$product.title',
                                        },
                                    },
                                },
                                0,
                            ],
                        },
                    },
                },
                {
                    $sort: {
                        createdAt: -1, // Sort in descending order
                    },
                },
            ]);
            return [...normalChat_buyer, ...normalChat_seller, ...refundChat];
        }
        else {
            const chatRooms = yield ChatRoom_1.default.find({ status: types_1.CHATROOM_STATUS.OPENED, buyerId: new mongoose_1.default.Types.ObjectId(buyerId) });
            return chatRooms;
        }
    }
});
const getSellerChatRoom = (sellerId) => __awaiter(void 0, void 0, void 0, function* () {
    const normalChat_seller = yield ChatRoom_1.default.aggregate([
        {
            $match: {
                status: types_1.CHATROOM_STATUS.OPENED,
                type: types_1.CHAT_TYPE.NORMAL_CHAT,
                sellerId: new mongoose_1.default.Types.ObjectId(sellerId),
                deletedBySellerId: { $ne: sellerId }
            },
        },
        {
            $lookup: {
                from: 'users',
                localField: 'buyerId',
                foreignField: '_id',
                as: 'buyerDetails', // Alias for the joined buyer document
            },
        },
        {
            $lookup: {
                from: 'products',
                localField: 'productId',
                foreignField: '_id',
                as: 'productDetails', // Alias for the joined product document
            },
        },
        {
            $project: {
                productId: 1,
                roomName: 1,
                type: 1,
                isAdminJoined: 1,
                status: 1,
                sellerId: 1,
                buyerId: 1,
                createdAt: 1,
                updatedAt: 1,
                buyerDetails: {
                    $arrayElemAt: [
                        {
                            $map: {
                                input: '$buyerDetails',
                                as: 'buyer',
                                in: {
                                    _id: '$$buyer._id',
                                    firstName: '$$buyer.firstName',
                                    lastName: '$$buyer.lastName',
                                },
                            },
                        },
                        0,
                    ],
                },
                productDetails: {
                    $arrayElemAt: [
                        {
                            $map: {
                                input: '$productDetails',
                                as: 'product',
                                in: {
                                    _id: '$$product._id',
                                    title: '$$product.title',
                                },
                            },
                        },
                        0,
                    ],
                },
            },
        },
        {
            $sort: {
                createdAt: -1, // Sort in descending order
            },
        },
    ]);
    return [...normalChat_seller];
});
const getBuyerChatRoom = (buyerId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const normalChat_buyer = yield ChatRoom_1.default.aggregate([
        {
            $match: {
                status: types_1.CHATROOM_STATUS.OPENED,
                type: types_1.CHAT_TYPE.NORMAL_CHAT,
                buyerId: new mongoose_1.default.Types.ObjectId(buyerId),
                deletedByBuyerId: { $ne: buyerId }
            },
        },
        {
            $lookup: {
                from: 'users',
                localField: 'buyerId',
                foreignField: '_id',
                as: 'buyerDetails',
            },
        },
        {
            $lookup: {
                from: 'products',
                localField: 'productId',
                foreignField: '_id',
                as: 'productDetails',
            },
        },
        {
            $project: {
                buyerId: 1,
                roomName: 1,
                type: 1,
                isAdminJoined: 1,
                status: 1,
                sellerId: 1,
                createdAt: 1,
                updatedAt: 1,
                buyerDetails: {
                    $arrayElemAt: [
                        {
                            $map: {
                                input: '$buyerDetails',
                                as: 'buyer',
                                in: {
                                    _id: '$$buyer._id',
                                    firstName: '$$buyer.firstName',
                                    lastName: '$$buyer.lastName',
                                },
                            },
                        },
                        0,
                    ],
                },
                productId: 1,
                productDetails: {
                    $arrayElemAt: [
                        {
                            $map: {
                                input: '$productDetails',
                                as: 'product',
                                in: {
                                    _id: '$$product._id',
                                    title: '$$product.title',
                                },
                            },
                        },
                        0,
                    ],
                },
            },
        },
        {
            $sort: {
                createdAt: -1, // Sort in descending order
            },
        },
    ]);
    for (let i = 0; i < normalChat_buyer.length; i++) {
        const sellerDetails = yield Seller_1.default.findOne({ _id: normalChat_buyer[i].sellerId })
            .populate({
            path: 'owner',
            select: '_id firstName lastName',
        })
            .select('_id owner');
        if (sellerDetails) {
            const formattedResponse = {
                sellerId: sellerDetails._id,
                owner: {
                    _id: (_a = sellerDetails === null || sellerDetails === void 0 ? void 0 : sellerDetails.owner) === null || _a === void 0 ? void 0 : _a._id,
                    firstName: (_b = sellerDetails === null || sellerDetails === void 0 ? void 0 : sellerDetails.owner) === null || _b === void 0 ? void 0 : _b.firstName,
                    lastName: (_c = sellerDetails === null || sellerDetails === void 0 ? void 0 : sellerDetails.owner) === null || _c === void 0 ? void 0 : _c.lastName,
                },
            };
            Object.assign(normalChat_buyer[i], { sellerDetails: formattedResponse });
        }
    }
    return [...normalChat_buyer];
});
const getBuyerChatRoomForAdmin = (roomName) => __awaiter(void 0, void 0, void 0, function* () {
    const adminChat_buyer = yield Message_1.default.find({
        status: types_1.CHATROOM_STATUS.OPENED,
        type: types_1.CHAT_TYPE.ADMIN_CHAT,
        deletedByRole: null,
        roomName
    });
    return [...adminChat_buyer];
});
const getAdminChatRoom = () => __awaiter(void 0, void 0, void 0, function* () {
    const adminChat_admin = yield ChatRoom_1.default.aggregate([
        {
            $match: {
                status: types_1.CHATROOM_STATUS.OPENED,
                type: types_1.CHAT_TYPE.ADMIN_CHAT,
                deletedByRole: { $ne: "admin" }
            },
        },
        {
            $lookup: {
                from: 'users',
                localField: 'buyerId',
                foreignField: '_id',
                as: 'buyerDetails',
            },
        },
        {
            $project: {
                buyerId: 1,
                roomName: 1,
                type: 1,
                isAdminJoined: 1,
                status: 1,
                createdAt: 1,
                updatedAt: 1,
                buyerDetails: {
                    $arrayElemAt: [
                        {
                            $map: {
                                input: '$buyerDetails',
                                as: 'buyer',
                                in: {
                                    _id: '$$buyer._id',
                                    firstName: '$$buyer.firstName',
                                    lastName: '$$buyer.lastName',
                                },
                            },
                        },
                        0,
                    ],
                },
            },
        },
        {
            $sort: {
                createdAt: -1, // Sort in descending order
            },
        },
    ]);
    return [...adminChat_admin];
});
const deleteChatRoom = (id, user_id, role) => __awaiter(void 0, void 0, void 0, function* () {
    let room;
    if (role == 'user') {
        room = yield ChatRoom_1.default.updateOne({
            roomName: id
        }, { $set: { deletedByBuyerId: user_id, deletedByRole: role } }).exec();
        yield Message_1.default.updateMany({
            roomName: id
        }, { $set: { deletedByBuyerId: user_id, deletedByRole: role } }).exec();
    }
    else if (role == 'seller') {
        room = yield ChatRoom_1.default.updateOne({
            roomName: id
        }, { $set: { deletedBySellerId: user_id, deletedByRole: role } }).exec();
        yield Message_1.default.updateMany({
            roomName: id
        }, { $set: { deletedBySellerId: user_id, deletedByRole: role } }).exec();
    }
    else {
        room = yield ChatRoom_1.default.updateOne({
            roomName: id
        }, { $set: { deletedByRole: role } }).exec();
        yield Message_1.default.updateMany({
            roomName: id
        }, { $set: { deletedByRole: role } }).exec();
    }
    const existingRoom = yield ChatRoom_1.default.findOne({ roomName: id });
    if (existingRoom.deletedBySellerId != null && existingRoom.deletedByBuyerId != null) {
        yield Message_1.default.deleteMany({ roomName: id });
        room = yield ChatRoom_1.default.deleteOne({ roomName: id });
    }
    return room;
});
const deleteAdminChatRoom = (id, role) => __awaiter(void 0, void 0, void 0, function* () {
    let room = yield ChatRoom_1.default.updateOne({
        roomName: id
    }, { $set: { deletedByRole: role } }).exec();
    yield Message_1.default.updateMany({
        roomName: id
    }, { $set: { deletedByRole: role } }).exec();
    return room;
});
const closeChatRoom = (roomName) => __awaiter(void 0, void 0, void 0, function* () {
    let existingChatRoom = yield ChatRoom_1.default.findOne({ roomName, status: types_1.CHATROOM_STATUS.OPENED });
    if (existingChatRoom) {
        existingChatRoom.status = types_1.CHATROOM_STATUS.CLOSED;
        existingChatRoom.save();
        return { status: 200, chatRoom: existingChatRoom };
    }
    else {
        return { status: 404, chatRoom: null };
    }
});
exports.chatRoomService = {
    createNewChatRoom,
    getChatRoom,
    closeChatRoom,
    getBuyerChatRoom,
    getSellerChatRoom,
    deleteChatRoom,
    getBuyerChatRoomForAdmin,
    getAdminChatRoom,
    deleteAdminChatRoom
};
