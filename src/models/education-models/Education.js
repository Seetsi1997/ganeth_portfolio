import { Schema, model } from "mongoose";

const educationSchema = new Schema({
  schoolName: { 
    type: String,
    required: true
  },
  qualification: { 
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  institutionType: {
    type: String,
    enum: ['highSchool', 'university', 'certificates', 'learnership', 'internship'],
    required: true,
    default: 'highSchool'
  },
  modules: [{
    name: {
      type: String,
      required: true
    },
    percent: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    }
  }],
  // Added fields that will be calculated
  highest: String,
  lowest: String,
  failMessage: String
}, { timestamps: true });

const Educations = model('Educations', educationSchema);

export default Educations;