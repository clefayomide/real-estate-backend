import crypto from "crypto";
import { UserObjectType } from "../../types";
import jsonwebtoken from "jsonwebtoken";
import { appConfig } from "../../config/app";

export const validateHash = (
	password: string,
	salt: string,
	storedHash: string
): boolean => {
	const hashResult = crypto
		.pbkdf2Sync(password, salt, 310000, 64, "sha512")
		.toString("hex");
	return storedHash === hashResult;
};

export const generateHash = (password: string) => {
	const salt = crypto.randomBytes(64).toString("hex");
	const hash = crypto
		.pbkdf2Sync(password, salt, 310000, 64, "sha512")
		.toString("hex");
	return {
		salt,
		hash,
	};
};

export const issueJWT = (user: UserObjectType) => {
	const expiresIn = "1d";

	const payload = {
		sub: user,
		iat: Math.floor(Date.now() / 1000),
	};

	const signedToken = jsonwebtoken.sign(
		payload,
		appConfig.jwtSecret as string,
		{
			expiresIn: expiresIn,
		}
	);

	return {
		token: signedToken,
		expires: expiresIn,
		tokenType: "Bearer",
	};
};

export const verifyJWT = (token: string) => {
	try {
		const decoded = jsonwebtoken.verify(token, appConfig.jwtSecret as string);
		return decoded;
	} catch (error) {
		console.error(error);
		throw error;
	}
};
