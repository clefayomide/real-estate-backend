"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const real_estate_1 = require("../db/real-estate");
const cryptography_1 = require("../../lib/cryptography/cryptography");
const user_model_1 = require("../../model/user.model");
passport_1.default.serializeUser(function (user, callback) {
    // @ts-ignore
    callback(null, user.id);
});
passport_1.default.deserializeUser(async function (id, callback) {
    try {
        const user = await real_estate_1.db.users.findUnique({
            where: {
                id: id,
            },
            select: {
                id: true,
                hash: false,
                salt: false,
            },
        });
        if (!user)
            throw new Error("user not found");
        callback(null, user);
    }
    catch (error) {
        callback(error, null);
    }
});
async function verify(email, password, callback) {
    (0, user_model_1.getUser)({ email })
        .then((user) => {
        if (!user)
            return callback("invalid username or password", null);
        const isValid = (0, cryptography_1.validateHash)(password, user?.salt, user?.hash);
        if (!isValid)
            return callback("invalid username or password", null);
        const userObject = { ...user };
        delete userObject.hash;
        delete userObject.salt;
        callback(null, userObject);
    })
        .catch((error) => {
        callback(error, null);
    });
}
const strategy = new passport_local_1.Strategy({ usernameField: "email" }, verify);
exports.default = passport_1.default.use(strategy);
