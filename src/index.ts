import "dotenv/config";
import express, {
	json,
	urlencoded,
	static as static_,
	Response,
	NextFunction,
	Request,
} from "express";
import createError from "http-errors";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import logger from "morgan";
import expressSession from "express-session";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import { db } from "./config/db/real-estate";
import { authRoute, searchRoute, verificationRoute } from "./routes";
import passport from "passport";
import isAuthenticated from "./middleware/isAuthenticated";

const app = express();
const currentVersion = "/v1";

const port = process.env.PORT ?? 8000;

const corsOptions = {
	credentials: true,
	origin: process.env.CLIENT_PORT,
};

app.use(cors(corsOptions));
app.set("view engine", "hbs");
app.use(static_(path.join(__dirname, "./public")));
app.set("views", path.join(__dirname, "./views"));
app.use(logger("dev"));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
	expressSession({
		cookie: {
			maxAge: 259200000,
			httpOnly: true,
			secure: app.settings["env"] !== "development",
		},
		secret: process.env.COOKIE_SECRET as string,
		resave: false,
		saveUninitialized: false,
		// @ts-ignore
		store: new PrismaSessionStore(db, {
			checkPeriod: 2 * 60 * 1000, //ms
			dbRecordIdIsSessionId: true,
			dbRecordIdFunction: undefined,
		}),
	})
);
app.use(passport.initialize());
app.use(passport.session());
require("./config/passport/local");

app.use(`${currentVersion}/search`, searchRoute);
app.use(`${currentVersion}/auth`, authRoute);
app.use(`${currentVersion}/verification`, isAuthenticated, verificationRoute);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (
	err: any,
	req: Request,
	res: Response,
	next: NextFunction
): void {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render("error");
});

app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});
