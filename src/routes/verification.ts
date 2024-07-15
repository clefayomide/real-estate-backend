import { Router } from "express";
import { User } from "../controller/user";
import { body } from "express-validator";
import { appValidationResultMiddleware } from "../middleware";
import { isInteger } from "../util/isInteger";

const router = Router();
const { verificationRequest, verify } = new User();

router.post(
	"/verify",
	body("id").notEmpty().withMessage("id is required"),
	body("id").custom(isInteger).withMessage("id must be an integer number"),
	body("otp").notEmpty().withMessage("otp is required"),
	body("otp").isString().withMessage("otp must be a string"),
	appValidationResultMiddleware,
	verify
);

router.post(
	"/request",
	body("id").notEmpty().withMessage("id is required"),
	body("id").custom(isInteger).withMessage("id must be an integer number"),
	body("email").notEmpty().withMessage("email is required"),
	body("email").isEmail().withMessage("provide a valid email"),
	appValidationResultMiddleware,
	verificationRequest
);

export default router;
