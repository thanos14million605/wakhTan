import express from "express";
import authController from "../controllers/authController.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/login", authController.login);
router.post("/signup", authController.signup);
router.post("/logout", authController.logout);

router.use(protectRoute);

router.get("/check", authController.checkAuth);

export default router;
