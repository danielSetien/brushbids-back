import { Schema, model } from "mongoose";

export const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  administrator: {
    type: Boolean,
    required: true,
  },
});

export const User = model("user", UserSchema, "users");
