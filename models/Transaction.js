import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  amount: Number,
  type: {
    type: String,
    enum: ["INCOME", "EXPENSE"]
  },
   category: {
    type: String,
    enum: ["LIVING", "TRANSPORT", "FOOD", "SHOPPING", "ENTERTAINMENT", "HEALTH", "TRAVEL", "FINANCE", "INCOME"],
    required: true
  },
  note: String,
  date: Date
}, { timestamps: true });

export default mongoose.model("Transaction", transactionSchema);