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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCustomLogger = exports.logger = void 0;
const winston = __importStar(require("winston"));
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};
const level = () => {
    const env = process.env.NODE_ENV || "development";
    const isDevelopment = env === "development";
    return isDevelopment ? "debug" : "warn";
};
const colors = {
    error: "red",
    warn: "yellow",
    info: "green",
    http: "white",
    debug: "blue",
};
winston.addColors(colors);
const customFormat = winston.format.combine(winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }), winston.format.colorize({ all: true }), winston.format.simple(), winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`));
const transports = [
    new winston.transports.Console(),
    new winston.transports.File({
        filename: "src/logs/error.log",
        level: "error",
    }),
    new winston.transports.File({ filename: "src/logs/all.log" }),
];
exports.logger = winston.createLogger({
    level: level(),
    levels,
    format: customFormat,
    transports,
});
const createCustomLogger = (label) => {
    return winston.createLogger({
        level: level(),
        levels,
        format: winston.format.combine(winston.format.label({ label: "Something shoudl work here" }), winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }), winston.format.colorize({ all: true }), winston.format.simple(), winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)),
        transports,
    });
};
exports.createCustomLogger = createCustomLogger;
