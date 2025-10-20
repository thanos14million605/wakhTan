import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Every message must have a sender."],
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Every message must have a receiver."],
    },
    text: {
      type: String,
    },
    imageUrl: {
      type: String,
    },
    imagePublicId: {
      type: String,
    },
    deletedMessageText: {
      type: String,
      select: false,
    },
    deletedMessageUrl: {
      type: String,
      select: false,
    },
    deletedMessagePublicId: {
      type: String,
      select: false,
    },
    deletedTimestamp: {
      type: Date,
      select: false,
    },
  },
  { timestamps: true, toObject: { virtuals: true }, toJSON: { virtuals: true } }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
