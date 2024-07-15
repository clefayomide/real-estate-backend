"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verificationRoute = exports.searchRoute = exports.authRoute = void 0;
var auth_1 = require("./auth");
Object.defineProperty(exports, "authRoute", { enumerable: true, get: function () { return __importDefault(auth_1).default; } });
var search_1 = require("./search");
Object.defineProperty(exports, "searchRoute", { enumerable: true, get: function () { return __importDefault(search_1).default; } });
var verification_1 = require("./verification");
Object.defineProperty(exports, "verificationRoute", { enumerable: true, get: function () { return __importDefault(verification_1).default; } });
