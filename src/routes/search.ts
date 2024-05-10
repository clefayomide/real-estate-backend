import { Router } from "express";
import { entries } from "../constants";
const router = Router();

router.get("/location", (req, res, next) => {
	res.json(entries);
});

export default router;
