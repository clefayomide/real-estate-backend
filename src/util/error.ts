import { ValidationError } from "express-validator";

export const populateError = (error: ValidationError[]) => {
	const errorArray: String[] = [];
	error.forEach((error) => {
		errorArray.push(error.msg);
	});
	return errorArray;
};
