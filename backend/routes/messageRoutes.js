import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import messageController from "../controllers/messageController.js";

const router = express.Router();

router.use(protectRoute);

router.get("/contacts", messageController.getContacts);

router
  .route("/:contactId")
  .get(messageController.getMessages)
  .post(messageController.sendMessage);

router.delete("/:contactId/:messageId", messageController.deleteMessage);

export default router;
