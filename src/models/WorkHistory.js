import { Schema, model } from "mongoose";

const workHistorySchema = new Schema({
  workHistory: {
    type: String,
    required: [true, "Experience is required"],
    trim: true,
    minlength: [10, "Experience must be at least 10 characters long"],
    maxlength: [500, "Experience cannot be more than 500 characters"],
  },
  addedBy: String,
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
});

const WorkHistory = model("WorkHistory", workHistorySchema);

export default WorkHistory;

