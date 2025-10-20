import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import Message from "../models/messageModel.js";
import User from "../models/userModel.js";
import cloudinary from "./../utils/cloudinary.js";
import { onlineUsers } from "../socket/socket.js";

// const getContacts = asyncHandler(async (req, res, next) => {
//   const user = await User.findById(req.user._id).select("-password");
//   if (!user) {
//     return next(new AppError("User not found.", 404));
//   }

//   const contacts = await User.find({ _id: { $ne: user._id } }).select(
//     "-password -passwordChangedAt -role -email -createdAt -updatedAt +profilePicUrl"
//   );
//   if (contacts?.length === 0) {
//     return next(new AppError("No contacts found.", 404));
//   }

//   res.status(200).json({
//     status: "success",
//     results: contacts.length,
//     data: {
//       contacts,
//     },
//   });
// });

const getContacts = asyncHandler(async (req, res, _next) => {
  const userId = req.user._id;

  const contacts = await User.aggregate([
    {
      $match: { _id: { $ne: userId } },
    },
    {
      $lookup: {
        from: "messages",
        let: { contactId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $or: [
                  {
                    $and: [
                      { $eq: ["$senderId", "$$contactId"] },
                      { $eq: ["$receiverId", userId] },
                    ],
                  },
                  {
                    $and: [
                      { $eq: ["$senderId", userId] },
                      { $eq: ["$receiverId", "$$contactId"] },
                    ],
                  },
                ],
              },
            },
          },
          { $sort: { createdAt: -1 } },
          { $limit: 1 },
        ],
        as: "lastMessage",
      },
    },
    {
      $lookup: {
        from: "messages",
        let: { contactId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$receiverId", userId] },
                  { $eq: ["$senderId", "$$contactId"] },
                  { $eq: ["$seen", false] },
                ],
              },
            },
          },
          { $count: "unseenCount" },
        ],
        as: "unseenMessages",
      },
    },
    {
      $addFields: {
        lastMessage: { $arrayElemAt: ["$lastMessage", 0] },
        unseenCount: {
          $cond: [
            { $gt: [{ $size: "$unseenMessages" }, 0] },
            { $arrayElemAt: ["$unseenMessages.unseenCount", 0] },
            0,
          ],
        },
      },
    },
    { $sort: { "lastMessage.createdAt": -1 } },
    {
      $project: {
        password: 0,
        email: 0,
        role: 0,
        createdAt: 0,
        updatedAt: 0,
        unseenMessages: 0,
      },
    },
  ]);

  res.status(200).json({
    status: "success",
    results: contacts.length,
    data: { contacts },
  });
});

const getMessages = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).select("-password");
  if (!user) {
    return next(new AppError("User not found.", 404));
  }

  const { contactId } = req.params;

  const messages = await Message.find({
    $or: [
      { senderId: user._id, receiverId: contactId },
      { senderId: contactId, receiverId: user._id },
    ],
  }).sort({ createdAt: 1 });

  res.status(200).json({
    status: "success",
    results: messages.length,
    data: {
      messages,
    },
  });
});

const sendMessage = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).select("-password");
  if (!user) {
    return next(new AppError("User not found.", 404));
  }

  const { contactId } = req.params;
  const { image, text } = req.body;
  if (!image && !text) {
    return next(new AppError("Either text or image is required.", 400));
  }

  let result;

  if (image) {
    result = await cloudinary.uploader.upload(image, {
      folder: "wakhtan/messages/images",
      public_id: `image-messages-${user._id}-${contactId}`,
      overwrite: true,
      transformation: [{ quality: "auto" }, { fetch_format: "auto" }],
    });
  }

  const newMessage = await Message.create({
    senderId: user._id,
    receiverId: contactId,
    text,
    imageUrl: result?.secure_url,
    imagePublicId: result?.public_id,
  });

  if (!newMessage) {
    return next(new AppError("Couldn't send message. Try again please.", 500));
  }

  const io = req.app.get("io");
  const receiver = onlineUsers.get(contactId);
  if (receiver?.socketId) {
    io.to(receiver.socketId).emit("newMessage", {
      senderId: user._id.toString(),
      text: newMessage.text,
    });
  }

  res.status(201).json({
    status: "success",
    data: {
      message: newMessage,
    },
  });
});

const deleteMessage = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    return next(new AppError("User not found.", 404));
  }

  const { contactId, messageId } = req.params;

  const message = await Message.findOne({
    _id: messageId,
    senderId: user._id,
    receiverId: contactId,
  }).select(
    "+deletedMessageText +deletedMessageUrl +deletedMessagePublicId +deletedTimestamp"
  );

  if (!message) {
    return next(new AppError("Message not found.", 404));
  }

  if (message.text) {
    message.deletedMessageText = message.text;
    message.text = "This message has been deleted";
    message.deletedTimestamp = new Date();
    await message.save();
  } else {
    message.deletedMessageUrl = message.imageUrl;
    message.deletedMessagePublicId = message.imagePublicId;
    message.deletedTimestamp = new Date();

    message.imageUrl = undefined;
    message.imagePublicId = undefined;
    message.text = "This image has been deleted";
    await message.save();
  }

  const io = req.app.get("io");
  const receiver = onlineUsers.get(contactId);
  if (receiver?.socketId) {
    io.to(receiver.socketId).emit("messageDeleted", {
      senderId: user._id.toString(),
    });
  }

  res.status(200).json({
    status: "success",
    message: "Message deleted successfully.",
  });
});

export default {
  getContacts,
  getMessages,
  sendMessage,
  deleteMessage,
};
