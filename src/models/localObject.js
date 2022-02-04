import mongoose, { Schema } from "mongoose";

const LocalObject = new Schema({
  // url: { type: String, trim: true, required: true },
  environmentId: { type: String, trim: true, required: true },
  objectName: { type: String, trim: true, required: true },
  position: { type: String, trim: true, required: true },
  scale: { type: String, trim: true, required: false },
  rotation: { type: String, trim: true, required: false },
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

export default mongoose.model("LocalObject", LocalObject);
