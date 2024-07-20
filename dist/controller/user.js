"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const passport_1 = __importDefault(require("passport"));
const user_model_1 = require("../model/user.model");
const lib_1 = require("../lib");
const otp_model_1 = require("../model/otp.model");
const errorConstructor_1 = require("../lib/custom/errorConstructor");
const ErrorFactory_1 = require("../factory/ErrorFactory");
const SuccessFactory_1 = require("../factory/SuccessFactory");
const errorHandler_1 = require("../util/errorHandler");
class User {
    login(req, res, next) {
        passport_1.default.authenticate("local", (err, user, info, status) => {
            if (err) {
                const { create } = new ErrorFactory_1.ErrorResponseFactory();
                const { error: errorResponse } = create(err, 401);
                return res.status(errorResponse.code).jsonp(errorResponse);
            }
            req.logIn(user, () => {
                const { create } = new SuccessFactory_1.SuccessResponseFactory();
                const { success: successResponse } = create("Login Successful", 200, req.user);
                res.status(successResponse.code).jsonp(successResponse);
            });
        })(req, res, next);
    }
    register(req, res, next) {
        (0, user_model_1.checkIfUserExist)({ email: req.body.email, username: req.body.username })
            .then((resp) => {
            if (resp) {
                const { create } = new ErrorFactory_1.ErrorResponseFactory();
                const { error: errorResponse } = create("username or email aready exist", 409);
                return res.status(errorResponse.code).jsonp(errorResponse);
            }
            (0, user_model_1.createNewUser)(req.body)
                .then(() => {
                const { create } = new SuccessFactory_1.SuccessResponseFactory();
                const { success: successResponse } = create("Registration Successful!", 201);
                res.status(successResponse.code).jsonp(successResponse);
                res.render("welcome", { name: req.body.username }, (error, html) => {
                    if (!error) {
                        lib_1.appMailer.sendMail({
                            from: 'noreply@safespace "safespace@outlook.com"',
                            to: req.body.email,
                            subject: "Welcome Note",
                            html,
                        });
                    }
                });
            })
                .catch(() => {
                const { create } = new ErrorFactory_1.ErrorResponseFactory();
                const { error: errorResponse } = create("An error occurred", 500);
                res.status(errorResponse.code).jsonp(errorResponse);
            });
        })
            .catch(() => {
            const { create } = new ErrorFactory_1.ErrorResponseFactory();
            const { error: errorResponse } = create("An error occurred", 500);
            res.status(errorResponse.code).jsonp(errorResponse);
        });
    }
    verificationRequest(req, res, next) {
        const id = req.body.id;
        const email = req.body.email;
        (0, user_model_1.getUser)({ email })
            .then((user) => {
            if (!user) {
                const { create } = new ErrorFactory_1.ErrorResponseFactory();
                const { error: errorResponse } = create("user with id not found", 404);
                throw new errorConstructor_1.CustomError(errorResponse.message, errorResponse);
            }
            const { verified } = user;
            if (Boolean(verified)) {
                const { create } = new SuccessFactory_1.SuccessResponseFactory();
                const { success: successResponse } = create("Account already verified", 200);
                return res.status(successResponse.code).jsonp(successResponse);
            }
            (0, otp_model_1.createOtp)(id)
                .then((response) => {
                const { otp, email } = response;
                const { create } = new SuccessFactory_1.SuccessResponseFactory();
                const { success: successResponse } = create("OTP sent to your registered email address", 201);
                res.status(successResponse.code).jsonp(successResponse);
                res.render("otp", { otp }, (error, html) => {
                    if (!error) {
                        lib_1.appMailer.sendMail({
                            from: 'noreply@safespace "safespace@outlook.com"',
                            to: email,
                            subject: "Verification",
                            html,
                        });
                    }
                });
            })
                .catch((error) => {
                const { errorMessage, data } = (0, errorHandler_1.errorHandler)(error);
                const { create } = new ErrorFactory_1.ErrorResponseFactory();
                const { error: errorResponse } = create(errorMessage, data?.code ?? 500);
                res.status(errorResponse.code).jsonp(errorResponse);
            });
        })
            .catch((error) => {
            const { create } = new ErrorFactory_1.ErrorResponseFactory();
            const { error: errorResponse } = create(error, 500);
            res.status(errorResponse.code).jsonp(errorResponse);
        });
    }
    async verify(req, res, next) {
        const { id, otp } = req.body;
        (0, otp_model_1.verifyOtp)(id, otp)
            .then(({ isOtpValid, isOtpExpired }) => {
            if (!isOtpValid) {
                const { create } = new ErrorFactory_1.ErrorResponseFactory();
                const { error: errorResponse } = create("Invalid otp provided", 400);
                throw new errorConstructor_1.CustomError(errorResponse.message, errorResponse);
            }
            if (isOtpValid && isOtpExpired) {
                const { create } = new ErrorFactory_1.ErrorResponseFactory();
                const { error: errorResponse } = create("Otp has expired", 410);
                throw new errorConstructor_1.CustomError(errorResponse.message, errorResponse);
            }
            (0, user_model_1.updateUserVerificationStatus)(id, true)
                .then(() => {
                const { create } = new SuccessFactory_1.SuccessResponseFactory();
                const { success: successResponse } = create("Otp verification successful", 200, {
                    verified: true,
                });
                res.status(successResponse.code).jsonp(successResponse);
            })
                .catch((error) => {
                const { errorMessage, data = null } = (0, errorHandler_1.errorHandler)(error);
                const { create } = new ErrorFactory_1.ErrorResponseFactory();
                const { error: errorResponse } = create(errorMessage, data?.code ?? 500);
                res.status(errorResponse.code).jsonp(errorResponse);
            });
        })
            .catch((error) => {
            const { errorMessage, data } = (0, errorHandler_1.errorHandler)(error);
            const { create } = new ErrorFactory_1.ErrorResponseFactory();
            const { error: errorResponse } = create(errorMessage, data?.code ?? 500);
            res.status(errorResponse.code).jsonp(errorResponse);
        });
    }
}
exports.User = User;
