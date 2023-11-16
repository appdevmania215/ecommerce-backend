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
const mongoose_1 = __importDefault(require("mongoose"));
const validator = __importStar(require("validator"));
const bcrypt = __importStar(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const adminSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid');
            }
        }
    },
    username: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password must not contain password');
            }
        }
    },
    section: {
        type: String,
        trim: true
    },
    language: {
        type: String,
        trim: true,
    },
    region: {
        type: String,
        trim: true,
    },
    otp: {
        type: Number
    },
    tokens: [{
            token: {
                type: String,
                required: true
            }
        }]
});
adminSchema.methods.toJSON = function () {
    const user = this;
    const userObj = user.toObject();
    delete userObj.otp;
    delete userObj.password;
    delete userObj.tokens;
    return userObj;
};
adminSchema.methods.generateAuthToken = function () {
    return __awaiter(this, void 0, void 0, function* () {
        const admin = this;
        const token = yield jsonwebtoken_1.default.sign({ _id: admin._id.toString() }, process.env.JWT_SECRET, {
            expiresIn: '6hr'
        });
        admin.tokens = admin.tokens.concat({ token });
        admin.save();
        return token;
    });
};
adminSchema.pre('save', function (next, opts) {
    return __awaiter(this, void 0, void 0, function* () {
        const admin = this;
        if (admin.isModified('password')) {
            admin.password = yield bcrypt.hash(admin.password, 8);
        }
        next();
    });
});
adminSchema.statics.findByCredentials = function (email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const admin = yield Admin.findOne({ email });
        if (!admin) {
            throw new Error('Unable to login');
        }
        const isMatch = yield bcrypt.compare(password, admin.password);
        if (!isMatch) {
            throw new Error('Unable to login');
        }
        return admin;
    });
};
const Admin = mongoose_1.default.model('admin', adminSchema);
exports.default = Admin;
