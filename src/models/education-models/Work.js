import { Schema, model } from "mongoose";

const workSchema = new Schema({
  companyName: { 
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
    maxlength: [100, 'Company name cannot exceed 100 characters']
  },
  position: {
    type: String,
    required: [true, 'Position title is required'],
    trim: true,
    maxlength: [100, 'Position title cannot exceed 100 characters']
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required'],
    validate: {
      validator: function(value) {
        return value <= this.endDate;
      },
      message: 'Start date must be before end date'
    }
  },
  endDate: {
    type: Date,
    required: function() {
      return !this.currentlyWorking; 
    },
    validate: {
      validator: function(value) {
        return value >= this.startDate;
      },
      message: 'End date must be after start date'
    }
  },
  currentlyWorking: {
    type: Boolean,
    default: false
  },
  employmentType: {
    type: String,
    enum: {
      values: ['learnership', 'permanent', 'contract', 'internship', 'freelance'],
      message: '{VALUE} is not a valid employment type'
    },
    required: [true, 'Employment type is required'],
    default: 'contract'
  },
  skills: [{
    name: {
      type: String,
      required: [true, 'Skill name is required'],
      trim: true
    },
    proficiency: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'expert'],
      default: 'intermediate'
    }
  }],
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  achievements: [{
    type: String,
    trim: true
  }],
  referenceContact: {
    name: String,
    position: String,
    email: String,
    phone: String
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for duration calculation
workSchema.virtual('duration').get(function() {
  const end = this.currentlyWorking ? new Date() : this.endDate;
  const diff = end.getTime() - this.startDate.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 30)); // Return months
});

// Indexes for better query performance
workSchema.index({ companyName: 1 });
workSchema.index({ startDate: -1 });
workSchema.index({ employmentType: 1 });

const Works = model('Works', workSchema);

export default Works;