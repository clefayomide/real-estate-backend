import "dotenv/config";
import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
	host: "smtp.gmail.com",
	port: 465,
	secure: true,
	auth: {
		user: process.env.GMAIL_USERNAME,
		pass: process.env.GMAIL_PWD,
	},
});
