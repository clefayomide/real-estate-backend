import { ErrorResponseFactory } from "../factory/ErrorFactory";
import { SuccessResponseFactory } from "../factory/SuccessFactory";
import { CustomError } from "../lib/custom/errorConstructor";
import { createOtp, verifyOtp } from "../model/otp.model";
import { updateUserVerificationStatus } from "../model/user.model";
import UserService from "./userService";

class VerificationService {
	public verificationRequest = async (id: number) => {
		const { getUser } = new UserService();
		try {
			const user = await getUser({ id });
			if (!user) {
				const { create } = new ErrorResponseFactory();
				const { error: errorResponse } = create("user with id not found", 404);
				throw new CustomError(errorResponse.message, errorResponse);
			}

			const { verified } = user;
			if (verified) {
				const { create } = new SuccessResponseFactory();
				const { success: successResponse } = create(
					"Account already verified",
					200
				);
				return successResponse;
			}

			const otpCreated = await this.generateOtp(id);
			return otpCreated;
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	public verifyOtp = async (id: number, otp: string) => {
		try {
			const { isOtpExpired, isOtpValid } = await verifyOtp(id, otp);
			if (!isOtpValid) {
				const { create } = new ErrorResponseFactory();
				const { error: errorResponse } = create("Invalid otp provided", 400);
				throw new CustomError(errorResponse.message, errorResponse);
			}
			if (isOtpValid && isOtpExpired) {
				const { create } = new ErrorResponseFactory();
				const { error: errorResponse } = create("Otp has expired", 410);
				throw new CustomError(errorResponse.message, errorResponse);
			}
			await this.updateVerificationStatus({ id, status: true });
			const { create } = new SuccessResponseFactory();
			const { success: successResponse } = create(
				"Otp verification successful",
				200,
				{
					verified: true,
				}
			);
			return successResponse;
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	private generateOtp = async (id: number) => {
		try {
			const otpCreated = await createOtp(id);
			return otpCreated;
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	private updateVerificationStatus = async ({
		id,
		status,
	}: {
		id: number;
		status: boolean;
	}) => {
		try {
			await updateUserVerificationStatus(id, status);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};
}

export default VerificationService;
