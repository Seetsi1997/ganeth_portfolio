import { Schema, model } from "mongoose";

const projectSchema = new Schema({
    projectName:{
        type: String,
        required: [true, 'Project name is required'],
        trim: true,
        minlenght: [3, " Project must be at least 3 characters long"],
        maxlength: [150, 'Project name cannot exceed 150 characters']
    },
    status: { 
        type: String, 
        enum: ["pending", "approved", "rejected"], 
        default: "pending" 
      },
    addedBy: String,
    createdAt:  {
        type: Date,
        default: Date.now,
        immutable: true},
}, {
    timestamps: true,
    versionKey: false,
});

const Project = model("Project", projectSchema);
export default Project;
