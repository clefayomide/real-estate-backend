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
import { PrismaClient } from "@prisma/client";
import { AuthRoute, SearchRoute } from "./routes";

const app = express();
const port = 8000;

const corsOptions = {
	origin: "http://localhost:3000",
	// optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

const prismaClientInstance = new PrismaClient();

app.use(cors(corsOptions));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(logger("dev"));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(static_(path.join(__dirname, "public")));
app.use(
	expressSession({
		cookie: {
			maxAge: 7 * 24 * 60 * 60 * 1000, // ms
		},
		secret: process.env.COOKIE_SECRET as string,
		resave: true,
		saveUninitialized: true,
		store: new PrismaSessionStore(prismaClientInstance, {
			checkPeriod: 2 * 60 * 1000, //ms
			dbRecordIdIsSessionId: true,
			dbRecordIdFunction: undefined,
		}),
	})
);

app.use("/search", SearchRoute);
app.use("/auth", AuthRoute);

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
