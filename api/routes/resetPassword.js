import express from "express";
import { resetPassEmail, setPassword, verifyLink } from "../controllers/resetPasswordController.js";

const router = express.Router();

router.post("/send",resetPassEmail);
router.get("/verify/:id/:token",verifyLink);
router.post("/reset/:id/:token",setPassword);
export default router;
