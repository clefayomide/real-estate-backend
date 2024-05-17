import passport from "passport";
import { Strategy } from "passport-local";
import { db } from "../db/real-estate";
import { validateHash } from "../../lib/cryptography/cryptography";
import { UserObjectType } from "../../types";

passport.serializeUser(function (user, callback) {
	// @ts-ignore
	callback(null, user.id);
});

passport.deserializeUser(async function (id: number, callback) {
	try {
		const user = await db.users.findUnique({
			where: {
				id: id,
			},
			select: {
				id: true,
				hash: false,
				salt: false,
			},
		});
		if (!user) throw new Error("user not found");
		callback(null, user);
	} catch (error) {
		callback(error, null);
	}
});

async function verify(email: string, password: string, callback: any) {
	try {
		const user = await db.users.findUnique({
			where: {
				email: email,
			},
		});
		if (!user) throw new Error("invalid username or password");

		const isValid = validateHash(password, user?.salt, user?.hash);

		if (!isValid) throw new Error("invalid username or password");
		const userObject: UserObjectType = { ...user };
		delete userObject.hash;
		delete userObject.salt;
		callback(null, userObject);
	} catch (error) {
		callback(error, null);
	}
}

const strategy = new Strategy({ usernameField: "email" }, verify);

export default passport.use(strategy);
