import { Request, NextFunction, Response } from "express";
import passport from "passport";
import { ErrorType, SuccessType } from "../types";
import { checkIfUserExist, createNewUser } from "../model/user.model";
import { appMailer } from "../lib";

export class Auth {
	loginController(req: Request, res: Response, next: NextFunction) {
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

	registerController(req: Request, res: Response, next: NextFunction) {
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
							code: 200,
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
}
