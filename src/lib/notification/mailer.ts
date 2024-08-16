import "dotenv/config";
import nodemailer from "nodemailer";
import { appConfig } from "../../config/app";

export const transporter = nodemailer.createTransport({
	host: "smtp.gmail.com",
	port: 465,
	secure: true,
	auth: {
		user: appConfig.gmailUsername,
		pass: appConfig.gmailPwd,
	},
});
