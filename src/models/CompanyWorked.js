import { Schema, model } from "mongoose";

const  companySchema = new Schema({
  companyName: {
    type: String,
    required: [true, "Company name is required"],
    trim: true,
    maxlength: [150, "Company name cannot exceed 50 characters"],
  },
  status: { 
    type: String, 
    enum: ["pending", "approved", "rejected"], 
    default: "pending" 
  },
  addedBy: String,
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
});

const Company = model("Company", companySchema);

export default Company;
