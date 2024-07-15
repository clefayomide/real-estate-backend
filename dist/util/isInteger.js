"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isInteger = void 0;
const isInteger = (value) => {
    if (typeof value === "string") {
        return false;
    }
    return typeof value === "number" && Number.isInteger(value);
};
exports.isInteger = isInteger;
