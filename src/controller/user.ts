import { Request, NextFunction, Response } from "express";
import passport from "passport";
import { ErrorType, SuccessType } from "../types";
import {
	checkIfUserExist,
	createNewUser,
	getUser,
	updateUserVerificationStatus,
} from "../model/user.model";
import { appMailer } from "../lib";
import { createOtp, verifyOtp } from "../model/otp.model";
import { CustomError } from "../lib/custom/errorConstructor";

export class User {
	login(req: Request, res: Response, next: NextFunction) {
		passport.authenticate(
			"local",
			(err: string, user: any, info: any, status: any) => {
				if (err) {
					const errorResponse: ErrorType = {
						message: err,
						status: false,
						code: 401,
					};
					return res.status(errorResponse.code).jsonp(errorResponse);
				}

				req.logIn(user, () => {
					const successResponse: SuccessType = {
						code: 200,
						message: "Login Successful",
						status: true,
						data: req.user,
					};
					res.status(successResponse.code).jsonp(successResponse);
				});
			}
		)(req, res, next);
	}

	register(req: Request, res: Response, next: NextFunction) {
		checkIfUserExist({ email: req.body.email, username: req.body.username })
			.then((resp) => {
				if (resp) {
					const errorResponse: ErrorType = {
						status: false,
						code: 409,
						message: "username or email aready exist",
					};
					return res.status(errorResponse.code).jsonp(errorResponse);
				}
				createNewUser(req.body)
					.then(() => {
						const successResponse: SuccessType = {
							status: true,
							code: 201,
							message: "Registration Successful!",
						};
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
						const errorResponse: ErrorType = {
							message: "An error occurred",
							code: 500,
							status: false,
						};
						res.status(errorResponse.code).jsonp(errorResponse);
					});
			})
			.catch(() => {
				const errorResponse: ErrorType = {
					message: "An error occurred",
					code: 500,
					status: false,
				};
				res.status(errorResponse.code).jsonp(errorResponse);
			});
	}

	verificationRequest(req: Request, res: Response, next: NextFunction) {
		const id = req.body.id;
		const email = req.body.email;

		getUser({ email })
			.then((user) => {
				if (!user) {
					const errorResponse: ErrorType = {
						status: false,
						code: 404,
						message: "user with id not found",
					};
					throw new CustomError(errorResponse.message, errorResponse);
				}
				const { verified } = user;
				if (Boolean(verified)) {
					const successResponse: SuccessType = {
						status: true,
						code: 200,
						message: "Account already verified",
					};
					return res.status(successResponse.code).jsonp(successResponse);
				}

				createOtp(id)
					.then((response) => {
						const { otp, email } = response;
						const successResponse: SuccessType = {
							status: true,
							code: 201,
							message: "OTP sent to your registered email address",
						};
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
					.catch((error: CustomError) => {
						const errorResponse: ErrorType = {
							message: error.message,
							code: (error.data?.code as number) ?? 500,
							status: false,
						};
						res.status(errorResponse.code).jsonp(errorResponse);
					});
			})
			.catch((error) => {
				const errorResponse: ErrorType = {
					status: false,
					message: error,
					code: 500,
				};
				res.status(errorResponse.code).jsonp(errorResponse);
			});
	}

	async verify(req: Request, res: Response, next: NextFunction) {
		const { id, otp } = req.body;
		verifyOtp(id, otp)
			.then(({ isOtpValid, isOtpExpired }) => {
				if (!isOtpValid) {
					const errorResponse: ErrorType = {
						status: false,
						message: "Invalid otp provided",
						code: 400,
					};
					throw new CustomError(errorResponse.message, errorResponse);
				}
				if (isOtpValid && isOtpExpired) {
					const errorResponse: ErrorType = {
						status: false,
						message: "Otp has expired",
						code: 410,
					};
					throw new CustomError(errorResponse.message, errorResponse);
				}
				updateUserVerificationStatus(id, true)
					.then(() => {
						const successResponse: SuccessType = {
							message: "Otp verification successful",
							status: true,
							code: 200,
							data: { verified: true },
						};
						res.status(successResponse.code).jsonp(successResponse);
					})
					.catch((error: CustomError) => {
						const errorResponse: ErrorType = {
							status: (error.data?.status as boolean) ?? false,
							message: error.message,
							code: (error.data?.code as number) ?? 500,
						};
						res.status(errorResponse.code).jsonp(errorResponse);
					});
			})
			.catch((error: CustomError) => {
				const errorResponse: ErrorType = {
					status: (error.data?.status as boolean) ?? false,
					message: error.message,
					code: (error.data?.code as number) ?? 500,
				};
				res.status(errorResponse.code).jsonp(errorResponse);
			});
	}
}
