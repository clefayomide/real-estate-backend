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
class User {
    login(req, res, next) {
        passport_1.default.authenticate("local", (err, user, info, status) => {
            if (err) {
                const errorResponse = {
                    message: err,
                    status: false,
                    code: 401,
                };
                return res.status(errorResponse.code).jsonp(errorResponse);
            }
            req.logIn(user, () => {
                const successResponse = {
                    code: 200,
                    message: "Login Successful",
                    status: true,
                    data: req.user,
                };
                res.status(successResponse.code).jsonp(successResponse);
            });
        })(req, res, next);
    }
    register(req, res, next) {
        (0, user_model_1.checkIfUserExist)({ email: req.body.email, username: req.body.username })
            .then((resp) => {
            if (resp) {
                const errorResponse = {
                    status: false,
                    code: 409,
                    message: "username or email aready exist",
                };
                return res.status(errorResponse.code).jsonp(errorResponse);
            }
            (0, user_model_1.createNewUser)(req.body)
                .then(() => {
                const successResponse = {
                    status: true,
                    code: 201,
                    message: "Registration Successful!",
                };
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
                const errorResponse = {
                    message: "An error occurred",
                    code: 500,
                    status: false,
                };
                res.status(errorResponse.code).jsonp(errorResponse);
            });
        })
            .catch(() => {
            const errorResponse = {
                message: "An error occurred",
                code: 500,
                status: false,
            };
            res.status(errorResponse.code).jsonp(errorResponse);
        });
    }
    verificationRequest(req, res, next) {
        const id = req.body.id;
        const email = req.body.email;
        (0, user_model_1.getUser)({ email })
            .then((user) => {
            if (!user) {
                const errorResponse = {
                    status: false,
                    code: 404,
                    message: "user with id not found",
                };
                throw new errorConstructor_1.CustomError(errorResponse.message, errorResponse);
            }
            const { verified } = user;
            if (Boolean(verified)) {
                const successResponse = {
                    status: true,
                    code: 200,
                    message: "Account already verified",
                };
                return res.status(successResponse.code).jsonp(successResponse);
            }
            (0, otp_model_1.createOtp)(id)
                .then((response) => {
                const { otp, email } = response;
                const successResponse = {
                    status: true,
                    code: 201,
                    message: "OTP sent to your registered email address",
                };
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
                const errorResponse = {
                    message: error.message,
                    code: error.data?.code ?? 500,
                    status: false,
                };
                res.status(errorResponse.code).jsonp(errorResponse);
            });
        })
            .catch((error) => {
            const errorResponse = {
                status: false,
                message: error,
                code: 500,
            };
            res.status(errorResponse.code).jsonp(errorResponse);
        });
    }
    async verify(req, res, next) {
        const { id, otp } = req.body;
        (0, otp_model_1.verifyOtp)(id, otp)
            .then(({ isOtpValid, isOtpExpired }) => {
            if (!isOtpValid) {
                const errorResponse = {
                    status: false,
                    message: "Invalid otp provided",
                    code: 400,
                };
                throw new errorConstructor_1.CustomError(errorResponse.message, errorResponse);
            }
            if (isOtpValid && isOtpExpired) {
                const errorResponse = {
                    status: false,
                    message: "Otp has expired",
                    code: 410,
                };
                throw new errorConstructor_1.CustomError(errorResponse.message, errorResponse);
            }
            (0, user_model_1.updateUserVerificationStatus)(id, true)
                .then(() => {
                const successResponse = {
                    message: "Otp verification successful",
                    status: true,
                    code: 200,
                    data: { verified: true },
                };
                res.status(successResponse.code).jsonp(successResponse);
            })
                .catch((error) => {
                const errorResponse = {
                    status: error.data?.status ?? false,
                    message: error.message,
                    code: error.data?.code ?? 500,
                };
                res.status(errorResponse.code).jsonp(errorResponse);
            });
        })
            .catch((error) => {
            const errorResponse = {
                status: error.data?.status ?? false,
                message: error.message,
                code: error.data?.code ?? 500,
            };
            res.status(errorResponse.code).jsonp(errorResponse);
        });
    }
}
exports.User = User;
