import passport from "passport";
import { Strategy } from "passport-local";
import { db } from "../db/real-estate";
import { validateHash } from "../../lib/cryptography/cryptography";
import { UserObjectType } from "../../types";
import { getUser } from "../../model/user.model";

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
	getUser({ email })
		.then((user: any) => {
			if (!user) return callback("invalid username or password", null);
			const isValid = validateHash(password, user?.salt, user?.hash);
			if (!isValid) return callback("invalid username or password", null);
			const userObject: UserObjectType = { ...user };
			delete userObject.hash;
			delete userObject.salt;
			callback(null, userObject);
		})
		.catch((error) => {
			callback(error, null);
		});
}

const strategy = new Strategy({ usernameField: "email" }, verify);
export default passport.use(strategy);
