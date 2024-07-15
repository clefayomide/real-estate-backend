import { Request, NextFunction, Response } from "express";
import passport from "passport";
import {
	checkIfUserExist,
	createNewUser,
	getUser,
	updateUserVerificationStatus,
} from "../model/user.model";
import { appMailer } from "../lib";
import { createOtp, verifyOtp } from "../model/otp.model";
import { CustomError } from "../lib/custom/errorConstructor";
import { ErrorResponseFactory } from "../factory/ErrorFactory";
import { SuccessResponseFactory } from "../factory/SuccessFactory";
import { errorHandler } from "../util/errorHandler";

export class User {
	login(req: Request, res: Response, next: NextFunction) {
		passport.authenticate(
			"local",
			(err: string, user: any, info: any, status: any) => {
				if (err) {
					const { create } = new ErrorResponseFactory();
					const { error: errorResponse } = create(err, 401);
					return res.status(errorResponse.code).jsonp(errorResponse);
				}

				req.logIn(user, () => {
					const { create } = new SuccessResponseFactory();
					const { success: successResponse } = create(
						"Login Successful",
						200,
						req.user
					);
					res.status(successResponse.code).jsonp(successResponse);
				});
			}
		)(req, res, next);
	}

	register(req: Request, res: Response, next: NextFunction) {
		checkIfUserExist({ email: req.body.email, username: req.body.username })
			.then((resp) => {
				if (resp) {
					const { create } = new ErrorResponseFactory();
					const { error: errorResponse } = create(
						"username or email aready exist",
						409
					);
					return res.status(errorResponse.code).jsonp(errorResponse);
				}
				createNewUser(req.body)
					.then(() => {
						const { create } = new SuccessResponseFactory();
						const { success: successResponse } = create(
							"Registration Successful!",
							201
						);
						res.status(successResponse.code).jsonp(successResponse);
						res.render(
							"welcome",
							{ name: req.body.username },
							(error: Error, html: any) => {
								if (!error) {
									appMailer.sendMail({
										from: 'noreply@safespace "safespace@outlook.com"',
										to: req.body.email,
										subject: "Welcome Note",
										html,
									});
								}
							}
						);
					})
					.catch(() => {
						const { create } = new ErrorResponseFactory();
						const { error: errorResponse } = create("An error occurred", 500);
						res.status(errorResponse.code).jsonp(errorResponse);
					});
			})
			.catch(() => {
				const { create } = new ErrorResponseFactory();
				const { error: errorResponse } = create("An error occurred", 500);
				res.status(errorResponse.code).jsonp(errorResponse);
			});
	}

	verificationRequest(req: Request, res: Response, next: NextFunction) {
		const id = req.body.id;
		const email = req.body.email;

		getUser({ email })
			.then((user) => {
				if (!user) {
					const { create } = new ErrorResponseFactory();
					const { error: errorResponse } = create(
						"user with id not found",
						404
					);
					throw new CustomError(errorResponse.message, errorResponse);
				}
				const { verified } = user;
				if (Boolean(verified)) {
					const { create } = new SuccessResponseFactory();
					const { success: successResponse } = create(
						"Account already verified",
						200
					);
					return res.status(successResponse.code).jsonp(successResponse);
				}

				createOtp(id)
					.then((response) => {
						const { otp, email } = response;
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
					})
					.catch((error) => {
						const { errorMessage, data } = errorHandler(error);
						const { create } = new ErrorResponseFactory();
						const { error: errorResponse } = create(
							errorMessage,
							data?.code ?? 500
						);
						res.status(errorResponse.code).jsonp(errorResponse);
					});
			})
			.catch((error) => {
				const { create } = new ErrorResponseFactory();
				const { error: errorResponse } = create(error, 500);
				res.status(errorResponse.code).jsonp(errorResponse);
			});
	}

	async verify(req: Request, res: Response, next: NextFunction) {
		const { id, otp } = req.body;
		verifyOtp(id, otp)
			.then(({ isOtpValid, isOtpExpired }) => {
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
				updateUserVerificationStatus(id, true)
					.then(() => {
						const { create } = new SuccessResponseFactory();
						const { success: successResponse } = create(
							"Otp verification successful",
							200,
							{
								verified: true,
							}
						);
						res.status(successResponse.code).jsonp(successResponse);
					})
					.catch((error) => {
						const { errorMessage, data = null } = errorHandler(error);

						const { create } = new ErrorResponseFactory();
						const { error: errorResponse } = create(
							errorMessage,
							data?.code ?? 500
						);
						res.status(errorResponse.code).jsonp(errorResponse);
					});
			})
			.catch((error) => {
				const { errorMessage, data } = errorHandler(error);
				const { create } = new ErrorResponseFactory();
				const { error: errorResponse } = create(
					errorMessage,
					data?.code ?? 500
				);
				res.status(errorResponse.code).jsonp(errorResponse);
			});
	}
}
