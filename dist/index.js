"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importStar(require("express"));
const http_errors_1 = __importDefault(require("http-errors"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const express_session_1 = __importDefault(require("express-session"));
const prisma_session_store_1 = require("@quixo3/prisma-session-store");
const real_estate_1 = require("./config/db/real-estate");
const routes_1 = require("./routes");
const passport_1 = __importDefault(require("passport"));
const isAuthenticated_1 = __importDefault(require("./middleware/isAuthenticated"));
const app = (0, express_1.default)();
const currentVersion = "/v1";
const port = 8000;
const corsOptions = {
    credentials: true,
    origin: process.env.CLIENT_PORT,
};
app.use((0, cors_1.default)(corsOptions));
app.set("views", path_1.default.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use((0, morgan_1.default)("dev"));
app.use((0, express_1.json)());
app.use((0, express_1.urlencoded)({ extended: false }));
app.use((0, cookie_parser_1.default)(process.env.COOKIE_SECRET));
app.use((0, express_1.static)(path_1.default.join(__dirname, "public")));
app.use((0, express_session_1.default)({
    cookie: {
        maxAge: 259200000,
        httpOnly: true,
        secure: app.settings["env"] !== "development",
    },
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    // @ts-ignore
    store: new prisma_session_store_1.PrismaSessionStore(real_estate_1.db, {
        checkPeriod: 2 * 60 * 1000, //ms
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined,
    }),
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
require("./config/passport/local");
app.use(`${currentVersion}/search`, routes_1.searchRoute);
app.use(`${currentVersion}/auth`, routes_1.authRoute);
app.use(`${currentVersion}/verification`, isAuthenticated_1.default, routes_1.verificationRoute);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next((0, http_errors_1.default)(404));
});
// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render("error");
});
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
