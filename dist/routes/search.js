"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const constants_1 = require("../constants");
const router = (0, express_1.Router)();
router.get("/quick", (req, res, next) => {
    res.status(200).jsonp(constants_1.entries);
});
exports.default = router;
