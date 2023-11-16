"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.stripe = void 0;
const express_1 = __importStar(require("express"));
const user_1 = __importDefault(require("./routers/user"));
const connect_1 = require("./db/connect");
const Seller_1 = __importDefault(require("./routers/Seller"));
const Category_1 = __importDefault(require("./routers/Category"));
const product_1 = __importDefault(require("./routers/product"));
const notification_routes_1 = __importDefault(require("./routers/notification.routes"));
const index_1 = __importDefault(require("./components/currency/routes/index"));
const admin_1 = __importDefault(require("./routers/admin"));
const chatRoom_routes_1 = __importDefault(require("./routers/chatRoom.routes"));
const report_routes_1 = __importDefault(require("./routers/report.routes"));
const services_1 = require("./components/currency/services");
const routers_1 = __importDefault(require("./routers"));
const http = __importStar(require("http"));
const cors_1 = __importDefault(require("cors"));
const node_cron_1 = __importDefault(require("node-cron"));
const helpers_1 = require("./Helpers/helpers");
const stripe_1 = __importDefault(require("stripe"));
const socket_1 = require("./socket");
const app = (0, express_1.default)();
exports.stripe = new stripe_1.default(process.env.SECRETKEY, {
    apiVersion: "2022-08-01",
});
const treblle = __importStar(require("treblle"));
const { createProxyMiddleware } = require('http-proxy-middleware');
const posthog_node_1 = require("posthog-node");
const client = new posthog_node_1.PostHog("phc_g0aaulGWsWuWDEYoUJbrtP2zOPs6GYYwQRblImjrQja", {
    host: "https://eu.posthog.com",
});
client.capture({
    distinctId: "test-id",
    event: "test-event",
});
// Send queued events immediately. Use for example in a serverless environment
// where the program may terminate before everything is sent
client.flush();
// Set up CORS middleware for multiple origins
app.use((0, cors_1.default)({
    origin: ["https://lincon.store", "https://admin.lincon.store"],
}));
const server = http.createServer(app);
connect_1.dbconnect;
(0, socket_1.initializeSocket)(server);
// Define a common CORS header for all routes
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
// Schedule cron jobs for periodic tasks
node_cron_1.default.schedule("*/1 * * * *", () => {
    (0, helpers_1.updateShipping)();
    (0, helpers_1.updateProductStatus)();
    (0, helpers_1.updateOrders)();
    (0, helpers_1.deleteInvalidStores)();
});
node_cron_1.default.schedule("*/10 * * * *", () => {
    (0, helpers_1.updateHotdeals)();
});
node_cron_1.default.schedule("*/5 * * * *", () => {
    (0, helpers_1.updateStoreActivity)();
});
node_cron_1.default.schedule("0 8 * * *", () => {
    services_1.ExchangeRateService.generateExchangeRate();
});
node_cron_1.default.schedule("0 18 * * *", () => {
    services_1.ExchangeRateService.generateExchangeRate();
});
node_cron_1.default.schedule("*/10 * * * *", () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, helpers_1.updateCart)();
}));
node_cron_1.default.schedule("0 0 0 * * *", () => {
    (0, helpers_1.updateShipping)();
    (0, helpers_1.updateActivity)();
    (0, helpers_1.handleSetSellerRep)();
});
const port = process.env.PORT;
//webhooks event for receiving stripe subscription
app.post("/webhooks", express_1.default.raw({ type: "application/json" }), (req, res) => {
    // @ts-ignore
    const sig = req.headers["stripe-signature"];
    let event;
    try {
        event = exports.stripe.webhooks.constructEvent(req.body, sig, process.env.endpointSecret);
    }
    catch (err) {
        express_1.response.status(400).send(`webhook error : ${err.message}`);
        return;
    }
    //handling the event
    switch (event.type) {
        case "customer.subscription.created":
            const subscription = event.data.object;
            break;
        case "customer.subscription.deleted":
            const subscription1 = event.data.object;
            break;
        case "customer.subscription.updated":
            const subscription2 = event.data.object;
            break;
        default:
            console.log(`unhandled event type ${event.type}`);
    }
    express_1.response.status(200).send();
});
app.use(express_1.default.json()); //allows us to parse incoming request to json
app.use(routers_1.default);
app.use(user_1.default);
app.use(admin_1.default);
app.use(Category_1.default);
app.use(Seller_1.default);
app.use(product_1.default);
app.use(notification_routes_1.default);
app.use(chatRoom_routes_1.default);
app.use(report_routes_1.default);
app.use(index_1.default);
treblle.useTreblle(app, {
    apiKey: process.env.TREBLLE_APIKEY,
    projectId: process.env.TREBLLE_PROJECTID,
});
// Create a proxy middleware
const proxyMiddlewareUser = createProxyMiddleware({
    target: 'https://lincon.store',
    changeOrigin: true,
});
const proxyMiddlewareAdmin = createProxyMiddleware({
    target: 'https://admin.lincon.store',
    changeOrigin: true,
});
// Add the proxy middleware to your Express app
app.use('/', proxyMiddlewareUser);
app.use('/', proxyMiddlewareAdmin);
server.listen(port, () => {
    console.log("running on port " + " " + port);
});
