import mongoose, { Schema } from "mongoose";

const LocalObject = new Schema({
  // url: { type: String, trim: true, required: true },
  // environmentId: { type: String, trim: true, required: true },
  objectName: { type: String, trim: true, required: true },
  position: { type: String, trim: true, required: true },
  scale: { type: String, trim: true, required: false },
  rotation: { type: String, trim: true, required: false },
  url: { type: String, trim: true, required: false },

  // requirements: [{ type: String, trim: true, required: true }],
});

export default mongoose.model("LocalObject", LocalObject);
