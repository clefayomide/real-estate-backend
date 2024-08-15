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
import logger from "morgan";
import { authRoute, searchRoute, verificationRoute } from "./routes";
import {
	checkIfUserIsAuthenticated,
	verifyUserSuppliedID,
} from "./middleware";
import { appConfig } from "./config/app";

const app = express();
const currentVersion = "/v1";

const port = appConfig.port;

const corsOptions = {
	credentials: true,
	origin: appConfig.clientOrigin,
};

app.use(cors(corsOptions));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(static_(path.join(__dirname, "public")));
app.use(logger("dev"));
app.use(json());
app.use(urlencoded({ extended: false }));
<<<<<<< Updated upstream
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
	expressSession({
		cookie: {
			maxAge: 259200000,
			httpOnly: true,
			secure: app.settings["env"] !== "development",
			sameSite: "none",
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
=======
>>>>>>> Stashed changes

app.use(`${currentVersion}/search`, searchRoute);
app.use(`${currentVersion}/auth`, authRoute);
app.use(
	`${currentVersion}/verification`,
	checkIfUserIsAuthenticated,
	verifyUserSuppliedID,
	verificationRoute
);

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
