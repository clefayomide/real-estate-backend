import { checkIfUserExist, getUser } from "../model/user.model";
import { getUserType, SignUpType } from "../types";

class UserService {
	getUser = async (data: getUserType) => {
		try {
			const response = await getUser(data);
			return response;
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	checkIfUserExist = async ({ email, username }: Omit<SignUpType, "password">) => {
		try {
			const userExist = await checkIfUserExist({ email, username });
			return userExist;
		} catch (error) {
			console.error(error);
			throw error;
		}
	};
}

export default UserService;
