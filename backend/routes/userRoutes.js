import express from "express";

import userController from "../controllers/userController.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.use(protectRoute);
router.get("/me", userController.getMe);
router.patch("/update-profile", userController.updateProfile);

export default router;
