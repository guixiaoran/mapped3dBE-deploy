import mongoose, { Schema } from "mongoose";

const localObject = new Schema({
  environmentId: { type: Schema.Types.ObjectId, ref: "environment" },
  localObjectItem: [{ type: Schema.Types.ObjectId, ref: "localObjectItem" }],
});

export default mongoose.model("localObject", localObject);
