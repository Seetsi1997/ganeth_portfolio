import { Schema, model } from "mongoose";

const  certificatesSchema = new Schema({
  certificateName: {
    type: String,
    required: [true, "Certificates name is required"],
    trim: true,
    maxlength: [100, "Certificates cannot exceed 100 characters"],
  },
  status: { 
    type: String, 
    enum: ["pending", "approved", "rejected"], 
    default: "pending" 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
});

const Certificates = model("Certificates", certificatesSchema);

export default Certificates;
