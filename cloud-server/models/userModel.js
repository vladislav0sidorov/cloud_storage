import { model, Schema } from "mongoose";

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isActivated: { type: Boolean, default: false },
  activationLink: { type: String },
  resetPasswordLink: { type: String },
  avatar: { type: String },
  gender: { type: String },
  firstName: { type: String },
  lastName: { type: String },
  patronymic: { type: String },
  dateOfBirth: { type: Date },
  locality: { type: String },
  phone: { type: String },
})

export const UserModel = model("User", userSchema);
