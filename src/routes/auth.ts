import { Router } from "express";
import { body } from "express-validator";
import { appValidationResultMiddleware } from "../middleware";
import { User } from "../controller/user";

const router = Router();
const { register, login } = new User();

router.post(
	"/login",
	body("email").notEmpty().withMessage("email is required"),
	body("email").isEmail().withMessage("provide a valid email"),
	body("password").notEmpty().withMessage("password is required"),
	appValidationResultMiddleware,
	login
);

router.post(
	"/register",
	body("username").notEmpty().withMessage("username is required"),
	body("password")
		.isLength({ min: 8 })
		.withMessage("pasword must be of 8 length"),
	body("email").notEmpty().withMessage("email is required"),
	body("email").isEmail().withMessage("provide a valid email"),
	appValidationResultMiddleware,
	register
);

export default router;
