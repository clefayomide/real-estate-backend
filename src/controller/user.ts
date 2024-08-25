import { Request, NextFunction, Response } from "express";
import { appMailer } from "../lib";
import { ErrorResponseFactory } from "../factory/ErrorFactory";
import { SuccessResponseFactory } from "../factory/SuccessFactory";
import { errorHandler } from "../util/errorHandler";
import AuthService from "../services/authService";
import VerificationService from "../services/verificationService";
import { SuccessType } from "../types";

export class User {
	async login(req: Request, res: Response, next: NextFunction) {
		const { email = "", password = "" } = req.body;
		const { authenticateUser } = new AuthService();
		try {
			const userAuthSuccess = await authenticateUser({ email, password });
			res.status(userAuthSuccess.code).json(userAuthSuccess);
		} catch (error) {
			const { errorMessage = "An error occurred", data: { code = 500 } = {} } =
				errorHandler(error as any);
			const { create } = new ErrorResponseFactory();
			const { error: errorResponse } = create(errorMessage, code);
			res.status(errorResponse.code).json(errorResponse);
		}
	}

	async register(req: Request, res: Response, next: NextFunction) {
		const { registerUser } = new AuthService();
		try {
			const userRegistered = await registerUser(req.body);
			res.status(userRegistered.code).json(userRegistered);
			res.render(
				"welcome",
				{ name: req.body.username },
				(error: Error, html: any) => {
					if (error) {
						return console.error(error);
					}

					appMailer.sendMail({
						from: 'noreply@safespace "safespace@outlook.com"',
						to: req.body.email,
						subject: "Welcome Note",
						html,
					});
				}
			);
		} catch (error) {
			const { errorMessage = "An error occurred", data: { code = 500 } = {} } =
				errorHandler(error as any);
			const { create } = new ErrorResponseFactory();
			const { error: errorResponse } = create(errorMessage, code);
			res.status(errorResponse.code).json(errorResponse);
		}
	}

	async verificationRequest(req: Request, res: Response, next: NextFunction) {
		const id = req.body.id;
		const { verificationRequest } = new VerificationService();
		try {
			const response = await verificationRequest(id);
			if (response.hasOwnProperty("status")) {
				const { message, code, status } = response as SuccessType;
				return res.status(code).json({ message, status, code });
			}
			const { otp, email } = response as {
				otp: string;
				email: string;
			};
			const { create } = new SuccessResponseFactory();
			const { success: successResponse } = create(
				"OTP sent to your registered email address",
				201
			);
			res.status(successResponse.code).jsonp(successResponse);
			res.render("otp", { otp }, (error, html) => {
				if (!error) {
					appMailer.sendMail({
						from: 'noreply@safespace "safespace@outlook.com"',
						to: email,
						subject: "Verification",
						html,
					});
				}
			});
		} catch (error) {
			const { errorMessage, data } = errorHandler(error as any);
			const { create } = new ErrorResponseFactory();
			const { error: errorResponse } = create(errorMessage, data?.code ?? 500);
			res.status(errorResponse.code).jsonp(errorResponse);
		}
	}

	async verify(req: Request, res: Response, next: NextFunction) {
		const { id, otp } = req.body;
		const { verifyOtp } = new VerificationService();
		try {
			const response = await verifyOtp(id, otp);
			res.status(response.code).json(response);
		} catch (error) {
			const { errorMessage, data = null } = errorHandler(error as any);
			const { create } = new ErrorResponseFactory();
			const { error: errorResponse } = create(errorMessage, data?.code ?? 500);
			res.status(errorResponse.code).jsonp(errorResponse);
		}
	}
}
