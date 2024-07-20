"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserVerificationStatus = exports.getUser = exports.checkIfUserExist = exports.createNewUser = void 0;
const cryptography_1 = require("../lib/cryptography/cryptography");
const real_estate_1 = require("../config/db/real-estate");
async function createNewUser(data) {
    const { password, username, email } = data;
    try {
        const { salt, hash } = (0, cryptography_1.generateHash)(password);
        const user = await real_estate_1.db.users.create({
            data: {
                username,
                hash,
                salt,
                email,
            },
            select: null,
        });
        return user;
    }
    catch (error) {
        throw error;
    }
}
exports.createNewUser = createNewUser;
async function checkIfUserExist(data) {
    const { email, username } = data;
    try {
        const user = await real_estate_1.db.users.findMany({
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
    }
    catch (error) {
        throw error;
    }
}
exports.checkIfUserExist = checkIfUserExist;
async function getUser(data) {
    const { email } = data;
    try {
        const user = await real_estate_1.db.users.findUnique({
            where: {
                email,
            },
        });
        return user;
    }
    catch (error) {
        throw error;
    }
}
exports.getUser = getUser;
async function updateUserVerificationStatus(id, status) {
    try {
        await real_estate_1.db.users.update({ where: { id }, data: { verified: status } });
    }
    catch (error) {
        throw error;
    }
}
exports.updateUserVerificationStatus = updateUserVerificationStatus;
