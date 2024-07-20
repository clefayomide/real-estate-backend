"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOtp = exports.createOtp = void 0;
const real_estate_1 = require("../config/db/real-estate");
const ErrorFactory_1 = require("../factory/ErrorFactory");
const cryptography_1 = require("../lib/cryptography/cryptography");
const errorConstructor_1 = require("../lib/custom/errorConstructor");
const otpGenerator_1 = require("../util/otpGenerator");
async function createOtp(userId) {
    try {
        const user = await real_estate_1.db.users.findUnique({
            where: { id: userId },
            select: {
                email: true,
                id: true,
                verified: true,
            },
        });
        const { id = "", email = "" } = user ?? {};
        const otp = (0, otpGenerator_1.generateOTP)();
        const { hash, salt } = (0, cryptography_1.generateHash)(otp);
        const expiresAt = new Date(new Date().getTime() + 3 * 60 * 1000);
        const data = { hash, salt, expiresAt, userId: id };
        await real_estate_1.db.otp.upsert({
            where: {
                userId: id,
            },
            update: {
                hash,
                salt,
                expiresAt,
            },
            create: data,
        });
        return { otp, email: email };
    }
    catch (error) {
        throw error;
    }
}
exports.createOtp = createOtp;
async function verifyOtp(userId, otp) {
    try {
        const userWithOtp = await real_estate_1.db.otp.findUnique({ where: { userId } });
        if (!userWithOtp) {
            const { create } = new ErrorFactory_1.ErrorResponseFactory();
            const { error: errorResponse } = create("user with id not found", 404);
            throw new errorConstructor_1.CustomError(errorResponse.message, errorResponse);
        }
        const { hash, salt, expiresAt } = userWithOtp;
        const isOtpValid = (0, cryptography_1.validateHash)(String(otp), salt, hash);
        let isOtpExpired;
        if (isOtpValid) {
            const isValid = new Date(expiresAt) > new Date();
            isOtpExpired = !isValid;
        }
        const checks = { isOtpValid, isOtpExpired };
        return checks;
    }
    catch (error) {
        throw error;
    }
}
exports.verifyOtp = verifyOtp;
