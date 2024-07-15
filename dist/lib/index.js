"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appMailer = void 0;
var mailer_1 = require("./notification/mailer");
Object.defineProperty(exports, "appMailer", { enumerable: true, get: function () { return mailer_1.transporter; } });
