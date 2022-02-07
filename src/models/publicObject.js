import mongoose, { Schema } from "mongoose";

const PublicObject = new Schema({
  objectName: { type: String, trim: true, required: true },
  url: { type: String, trim: true, required: false },

  // requirements: [{ type: String, trim: true, required: true }],
  deakinSSO: { type: Boolean, default: false },
  firstLogin: { type: Boolean, default: false },
  code: { type: String, trim: true },
  OTPCode: { type: String, trim: true },
  registrationDate: { type: Date, default: Date.now },
  codeUpdatedAt: { type: Date, default: Date.now, required: true },
  isBlocked: { type: Boolean, default: false, required: true },
});

export default mongoose.model("PublicObject", PublicObject);
