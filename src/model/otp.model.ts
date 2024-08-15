import { db } from "../config/db/real-estate";
import { ErrorResponseFactory } from "../factory/ErrorFactory";
import { generateHash, validateHash } from "../lib/cryptography/cryptography";
import { CustomError } from "../lib/custom/errorConstructor";
import { generateOTP } from "../util/otpGenerator";

export async function createOtp(userId: number) {
	try {
		const user = await db.users.findUnique({
			where: { id: userId },
			select: {
				email: true,
				id: true,
				verified: true,
			},
		});
		const { id = "", email = "" } = user ?? {};
		const otp = generateOTP();
		const { hash, salt } = generateHash(otp);
		const expiresAt = new Date(new Date().getTime() + 3 * 60 * 1000);
		const data = { hash, salt, expiresAt, userId: id as number };

		await db.otp.upsert({
			where: {
				userId: id as number,
			},
			update: {
				hash,
				salt,
				expiresAt,
			},
			create: data,
		});
		return { otp, email: email };
	} catch (error) {
		console.error(error);
		throw error;
	}
}

export async function verifyOtp(userId: number, otp: number | string) {
	try {
		const userWithOtp = await db.otp.findUnique({ where: { userId } });
		if (!userWithOtp) {
			const { create } = new ErrorResponseFactory();
			const { error: errorResponse } = create("user with id not found", 404);
			throw new CustomError(errorResponse.message, errorResponse);
		}
		const { hash, salt, expiresAt } = userWithOtp;
		const isOtpValid = validateHash(String(otp), salt, hash);
		let isOtpExpired;
		if (isOtpValid) {
			const isValid = new Date(expiresAt) > new Date();
			isOtpExpired = !isValid;
		}
		const checks = { isOtpValid, isOtpExpired };
		return checks;
	} catch (error) {
		console.error(error);
		throw error;
	}
}
