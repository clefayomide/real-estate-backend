import { NextFunction, Request, Response } from "express";
import { ErrorType } from "../types";

const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
	// check if user is authenticated
	if (!req.isAuthenticated()) {
		console.log(!req.isAuthenticated());
		const errorResponse: ErrorType = {
			status: false,
			code: 401,
			message: "user not authenticated",
		};
		return res.status(errorResponse.code).jsonp(errorResponse);
	}

	// check if the id supplied in request body corresponds with the id of the currently logged in user
	// this is to prevent querying the db if there's no match
	if (req.user.hasOwnProperty("id") && req.body.hasOwnProperty("id")) {
		const id = req.body.id;
		const { id: userId } = req.user as { id: number };
		if (id != userId) {
			const errorResponse: ErrorType = {
				status: false,
				code: 400,
				message: "bad request",
			};
			return res.status(errorResponse.code).jsonp(errorResponse);
		}
	}
	next();
};

export default isAuthenticated;
