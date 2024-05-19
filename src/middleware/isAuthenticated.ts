import { NextFunction, Request, Response } from "express";
import { ErrorType } from "../types";

const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
	if (!req.isAuthenticated()) {
		const errorResponse: ErrorType = {
			status: false,
			code: 401,
			message: "user not authenticated",
		};
		return res.status(errorResponse.code).jsonp(errorResponse);
	}
	next();
};

export default isAuthenticated;
