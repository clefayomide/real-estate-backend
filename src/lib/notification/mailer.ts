import "dotenv/config";
import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport("SMTP", {
	service: "Gmail",
	auth: {
		user: process.env.GMAIL_USERNAME,
		pass: process.env.GMAIL_PWD,
	},
});
