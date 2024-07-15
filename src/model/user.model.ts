import { generateHash } from "../lib/cryptography/cryptography";
import { SignUpType } from "../types";
import { db } from "../config/db/real-estate";

export async function createNewUser(data: SignUpType) {
	const { password, username, email } = data;
	try {
		const { salt, hash } = generateHash(password);
		const user = await db.users.create({
			data: {
				username,
				hash,
				salt,
				email,
			},
			select: null,
		});
		return user;
	} catch (error) {
		throw error;
	}
}

export async function checkIfUserExist(data: Omit<SignUpType, "password">) {
	const { email, username } = data;
	try {
		const user = await db.users.findMany({
			where: {
				OR: [
					{
						email: {
							equals: email,
						},
					},
					{
						username: { equals: username },
					},
				],
			},
			select: {
				username: true,
				email: true,
			},
		});
		return user.length > 0;
	} catch (error) {
		throw error;
	}
}

export async function getUser(
	data: Omit<Omit<SignUpType, "username">, "password">
) {
	const { email } = data;
	try {
		const user = await db.users.findUnique({
			where: {
				email,
			},
		});
		return user;
	} catch (error) {
		throw error;
	}
}

export async function updateUserVerificationStatus(
	id: number,
	status: boolean
) {
	try {
		await db.users.update({ where: { id }, data: { verified: status } });
	} catch (error) {
		throw error;
	}
}
