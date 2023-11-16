"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundResponse = exports.BadRequestResponse = exports.SuccessResponse = void 0;
class SuccessResponse {
    constructor(code, data = null, message = "success") {
        this.code = code;
        this.data = data;
        this.message = message;
    }
    send(res) {
        return res.status(this.code).json({
            message: this.message,
            status: true,
            code: this.code,
            data: this.data,
        });
    }
}
exports.SuccessResponse = SuccessResponse;
class BadRequestResponse {
    constructor(message, code = 400) {
        this.code = code;
        this.message = message;
    }
    send(res) {
        return res.status(this.code).json({
            message: this.message,
            status: false,
            code: this.code,
        });
    }
}
exports.BadRequestResponse = BadRequestResponse;
class NotFoundResponse {
    constructor(message = "Not Found", code = 404) {
        this.code = code;
        this.message = message;
    }
    send(res) {
        return res.status(this.code).json({
            message: this.message,
            status: false,
            code: this.code,
        });
    }
}
exports.NotFoundResponse = NotFoundResponse;
