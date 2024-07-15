"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const error_1 = require("../util/error");
const validationResult = (req, res, next) => {
    const result = (0, express_validator_1.validationResult)(req);
    if (!result.isEmpty()) {
        const errorMessages = (0, error_1.populateError)(result.array());
        const errorResponse = {
            status: false,
            code: 400,
            message: "Validation error",
            error: errorMessages,
        };
        return res.status(errorResponse.code).jsonp(errorResponse);
    }
    next();
};
exports.default = validationResult;
