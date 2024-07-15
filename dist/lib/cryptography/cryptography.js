"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateHash = exports.validateHash = void 0;
const crypto_1 = __importDefault(require("crypto"));
const validateHash = (password, salt, storedHash) => {
    const hashResult = crypto_1.default
        .pbkdf2Sync(password, salt, 310000, 64, "sha512")
        .toString("hex");
    return storedHash === hashResult;
};
exports.validateHash = validateHash;
const generateHash = (password) => {
    const salt = crypto_1.default.randomBytes(64).toString("hex");
    const hash = crypto_1.default
        .pbkdf2Sync(password, salt, 310000, 64, "sha512")
        .toString("hex");
    return {
        salt,
        hash,
    };
};
exports.generateHash = generateHash;
