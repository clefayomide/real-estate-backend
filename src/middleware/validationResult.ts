import { NextFunction, Request, Response } from "express";
import { validationResult as expressValidationResult } from "express-validator";
import { populateError } from "../util/error";
import { ErrorType } from "../types";

const validationResult = (req: Request, res: Response, next: NextFunction) => {
	const result = expressValidationResult(req);
	if (!result.isEmpty()) {
		const errorMessages = populateError(result.array());
		const errorResponse: ErrorType = {
			status: false,
			code: 400,
			message: "Some fields are missing",
			error: errorMessages,
		};
		return res.status(errorResponse.code).jsonp(errorResponse);
	}
	next();
};

export default validationResult;
