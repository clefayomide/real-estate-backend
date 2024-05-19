import { Router } from "express";
import { entries } from "../constants";
const router = Router();

router.get("/quick", (req, res, next) => {
	res.status(200).jsonp(entries);
});

export default router;
