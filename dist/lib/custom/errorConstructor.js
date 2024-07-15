"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomError = void 0;
class CustomError extends Error {
    constructor(message, data) {
        super(message);
        this.name = "CustomError";
        this.data = data;
        Error.captureStackTrace(this, CustomError);
    }
}
exports.CustomError = CustomError;
