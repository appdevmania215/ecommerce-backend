"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UNAUTHORIZED = exports.NotFoundError = exports.CatchErrorHandler = exports.BadRequestError = exports.ApiError = exports.AppError = void 0;
const responses_1 = require("./responses");
var ErrorType;
(function (ErrorType) {
    ErrorType["BAD_REQUEST"] = "BadRequestError";
    ErrorType["NOT_FOUND"] = "NotFoundError";
    ErrorType["UN_AUTHORIZED"] = "UnAuthorized";
})(ErrorType || (ErrorType = {}));
class AppError {
    constructor(res, code, message) {
        this.res = res;
        this.code = code;
        this.message = message;
    }
}
exports.AppError = AppError;
class ApiError extends Error {
    constructor(type, message = "error", code = 400) {
        super(type);
        this.type = type;
        this.message = message;
        this.code = code;
    }
    static handle(err, res) {
        switch (err.type) {
            case ErrorType.BAD_REQUEST:
                return new responses_1.BadRequestResponse(err.message).send(res);
            case ErrorType.NOT_FOUND:
                return new responses_1.NotFoundResponse(err.message).send(res);
            case ErrorType.UN_AUTHORIZED:
                return new responses_1.BadRequestResponse(err.message, err.code).send(res);
        }
    }
}
exports.ApiError = ApiError;
class BadRequestError extends ApiError {
    constructor(message = "Bad Request") {
        super(ErrorType.BAD_REQUEST, message);
    }
}
exports.BadRequestError = BadRequestError;
const CatchErrorHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
exports.CatchErrorHandler = CatchErrorHandler;
class NotFoundError extends ApiError {
    constructor(message = "Not Found") {
        super(ErrorType.NOT_FOUND, message);
    }
}
exports.NotFoundError = NotFoundError;
class UNAUTHORIZED extends ApiError {
    constructor(message = "UnAuthorized Resource") {
        super(ErrorType.UN_AUTHORIZED, message, 403);
    }
}
exports.UNAUTHORIZED = UNAUTHORIZED;
