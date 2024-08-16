import { NextFunction, Response, Request } from "express";
import { ErrorResponseFactory } from "../factory/ErrorFactory";
import { verifyJWT } from "../lib/cryptography/cryptography";

export const isAuthenticated = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const authHeader = req.headers["authorization"];
	const token = authHeader?.split(" ")[1];
	if (!token) {
		const { create } = new ErrorResponseFactory();
		const { error: errorResponse } = create("Unauthorized", 401);
		return res.status(errorResponse.code).jsonp(errorResponse);
	}
	try {
		const decoded = verifyJWT(token);
		// @ts-ignore
		req.user = decoded.sub as any;
		next();
	} catch (error) {
		const { create } = new ErrorResponseFactory();
		const { error: errorResponse } = create("Unauthorized", 401);
		res.status(errorResponse.code).jsonp(errorResponse);
	}
};

export const verifySuppliedID = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const suppliedID = req.body.id ?? req.params.id;
	// @ts-ignore
	const loggedInUserID = req.user.id;

	if (Number(suppliedID) !== loggedInUserID) {
		const { create } = new ErrorResponseFactory();
		const { error: errorResponse } = create("Bad request", 400);
		return res.status(errorResponse.code).jsonp(errorResponse);
	}
	next();
};
