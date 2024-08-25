import { ErrorResponseFactory } from "../factory/ErrorFactory";
import { SuccessResponseFactory } from "../factory/SuccessFactory";
import { issueJWT, validateHash } from "../lib/cryptography/cryptography";
import { CustomError } from "../lib/custom/errorConstructor";
import { SignUpType, UserObjectType } from "../types";
import { createNewUser } from "../model/user.model";
import UserService from "./userService";

class AuthService {
	public authenticateUser = async ({
		email: userEmail,
		password: userPassword,
	}: {
		email: string;
		password: string;
	}) => {
		const { getUser } = new UserService();

		try {
			const user = await getUser({ email: userEmail });
			if (!user) {
				const { create } = new ErrorResponseFactory();
				const { error: errorResponse } = create(
					"incorrect email or password",
					400
				);
				throw new CustomError(errorResponse.message, errorResponse);
			}

			const isValidCred = this.validateCredentials(
				userPassword,
				user.salt,
				user.hash
			);

			if (!isValidCred) {
				const { create } = new ErrorResponseFactory();
				const { error: errorResponse } = create(
					"incorrect email or password",
					400
				);
				throw new CustomError(errorResponse.message, errorResponse);
			}

			const issuedJwtToken = this.issueJwtToken({ id: user.id });

			const { id, verified, createdAt, updatedAt, username, email } = user;

			const { create } = new SuccessResponseFactory();
			const { success: successResponse } = create("Login Succesful", 200, {
				id,
				verified,
				createdAt,
				updatedAt,
				username,
				email,
				...issuedJwtToken,
			});
			return successResponse;
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	public registerUser = async ({ email, password, username }: SignUpType) => {
		const { checkIfUserExist } = new UserService();
		try {
			const userExist = await checkIfUserExist({ email, username });
			if (userExist) {
				const { create } = new ErrorResponseFactory();
				const { error: errorResponse } = create(
					"username or email aready exist",
					409
				);
				throw new CustomError(errorResponse.message, errorResponse);
			}
			const newUserCreated = await this.createNewUser({
				email,
				password,
				username,
			});
			return newUserCreated;
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	private validateCredentials = (
		password: string,
		salt: string,
		hash: string
	) => {
		const isValidCred = validateHash(password, salt, hash);
		return isValidCred;
	};

	private issueJwtToken = (user: Pick<UserObjectType, "id">) => {
		const issuedToken = issueJWT(user);
		return issuedToken;
	};

	private createNewUser = async (data: SignUpType) => {
		try {
			await createNewUser(data);
			const { create } = new SuccessResponseFactory();
			const { success: successResponse } = create(
				"Registration Successful!",
				201
			);
			return successResponse;
		} catch (error) {
			console.error(error);
			throw error;
		}
	};
}

export default AuthService;
