"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const middleware_1 = require("../middleware");
const user_1 = require("../controller/user");
const router = (0, express_1.Router)();
const auth = new user_1.User();
router.post("/login", (0, express_validator_1.body)("email").notEmpty().withMessage("email is required"), (0, express_validator_1.body)("email").isEmail().withMessage("provide a valid email"), (0, express_validator_1.body)("password").notEmpty().withMessage("password is required"), middleware_1.appValidationResultMiddleware, (req, res, next) => auth.login(req, res, next));
router.post("/register", (0, express_validator_1.body)("username").notEmpty().withMessage("username is required"), (0, express_validator_1.body)("password")
    .isLength({ min: 8 })
    .withMessage("pasword must be of 8 length"), (0, express_validator_1.body)("email").notEmpty().withMessage("email is required"), (0, express_validator_1.body)("email").isEmail().withMessage("provide a valid email"), middleware_1.appValidationResultMiddleware, (req, res, next) => auth.register(req, res, next));
exports.default = router;
