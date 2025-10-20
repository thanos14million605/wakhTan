import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Fullname is required."],
    },
    userName: {
      type: String,
      required: [true, "Username is required."],
      trim: true,
      unique: [true, "Username name already exists."],
      maxlength: [30, "Username must be 30 chars or less."],
      validate: [
        validator.isAscii,
        "Username must consist only alhpanumeric and special chars.",
      ],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lower: true,
      validate: [validator.isEmail, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required."],
      minlength: [8, "Password must be 8 chars or more."],
      select: false,
    },
    confirmPassword: {
      type: String,
      required: [true, "Password is required."],
      select: false,
      validate: {
        validator: function (val) {
          return this.password === val;
        },
        message: "Password and password confirm do not match.",
      },
    },
    role: {
      type: String,
      required: [true, "User role is required."],
      default: "user",
      enum: {
        values: ["admin", "user"],
        message: "Unknown role",
      },
    },
    profilePicUrl: {
      type: String,
      select: false,
    },
    profilePicPublicId: {
      type: String,
      select: false,
    },
    passwordChangedAt: {
      type: Date,
      select: false,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;

  next();
});

const User = mongoose.model("User", userSchema);

export default User;
