
import { model, Schema } from "mongoose";

const serviceSchema = new Schema(
{
    title:{
        type: String,
        required: [true, 'Title name is required'],
        trim: true
    },
    icon:{
        type: String,
        required: [true, 'Icon is required'],
        trim: true,
    },
    description: [{
       name: {
       type: String,
       required: [true, 'Description name is required'],
       trim: true
    },
    }],
    category: {
        type: String,
        enum: ['frontend', 'backend', 'database'],
        required: true,
        default: 'frontend'
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
      },
      updatedAt: { 
        type: Date, 
        default: Date.now 
      },
});

const Services = model('Services', serviceSchema)

export default Services;