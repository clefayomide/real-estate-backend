import { Router } from "express";
import { entries } from "../constants";
const router = Router();

router.get("/location", (req, res, next) => {
	res.status(200).jsonp(entries.location);
});

export default router;
