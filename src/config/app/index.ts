import "dotenv/config";
export const appConfig = {
	gmailUsername: process.env.GMAIL_USERNAME,
	gmailPwd: process.env.GMAIL_PWD,
	port: process.env.PORT ?? 8000,
	clientOrigin: process.env.CLIENT_ORIGIN,
	cookieSecret: process.env.COOKIE_SECRET,
	jwtIssuer: process.env.JWT_ISSUER,
	jwtAudience: process.env.JWT_AUDIENCE,
	jwtSecret: process.env.JWT_SECRET,
};
