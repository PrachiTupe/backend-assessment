import mongoose from "mongoose";

const viewerAccessSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  viewerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }

}, { timestamps: true });

export default mongoose.model("ViewerAccess", viewerAccessSchema);