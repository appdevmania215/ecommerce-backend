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
const Mongoose = __importStar(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userSchema = new Mongoose.Schema({
    email: {
        type: String,
        unique: true,
        trim: true,
        required: true,
        lowercase: true,
        validate(value) {
            if (!validator_1.default.isEmail(value)) {
                throw new Error("Email is invalid");
            }
        },
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        minlength: [2, "Must be at least two characters"],
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        minlength: [2, "Must be at least two characters"],
    },
    following: [String],
    password: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes("password")) {
                throw new Error("Password must not contain password");
            }
        },
        minLength: 6,
    },
    tokens: [
        {
            token: {
                type: String,
                required: true,
            },
        },
    ],
    role: {
        type: String,
        trim: true,
        default: "user",
        lowercase: true,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    phone: {
        type: String,
    },
    country: {
        type: String,
    },
    otp: {
        type: Number,
        required: true,
    },
    customer_id: {
        type: String,
        required: true,
    },
    plan: {
        type: String,
        trim: true,
        minLength: 3,
        maxLength: 10,
    },
    endDate: {
        type: Date,
    },
    subId: {
        type: String,
        trim: true,
    },
    accId: {
        type: String,
        trim: true,
    },
    orders: {
        type: Number,
        default: 0,
    },
    language: {
        type: String,
        default: "en",
    },
    currency: {
        type: String,
        default: "usd",
    },
    payId: {
        type: String,
    },
    shipping: {
        type: String,
    },
    isClosed: {
        type: Boolean,
        default: false,
    },
    sellerId: {
        type: mongoose_1.default.Types.ObjectId,
    },
}, {
    timestamps: true,
});
userSchema.methods.toJSON = function () {
    const user = this;
    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.tokens;
    delete userObj.otp;
    return userObj;
};
userSchema.methods.generateAuthToken = function () {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this;
        try {
            const token = yield jsonwebtoken_1.default.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
            user.tokens = user.tokens.concat({ token });
            yield user.save();
            return token;
        }
        catch (e) {
            return null;
        }
    });
};
userSchema.statics.findByCredentials = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User.findOne({ email });
    if (!user) {
        throw new Error("Unable to login");
    }
    const isMatch = yield bcrypt_1.default.compare(password, user.password);
    if (!isMatch) {
        throw new Error("Unable to login");
    }
    return user;
});
userSchema.pre("save", function (next, opts) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this;
        if (user.isModified("password")) {
            user.password = yield bcrypt_1.default.hash(user.password, 8);
        }
        next();
    });
});
const User = mongoose_1.default.model("user", userSchema);
exports.default = User;
