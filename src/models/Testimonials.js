import { Schema, model } from "mongoose";

const testimonialSchema = new Schema({
    userName: {
        type: String,
        required: [true, 'User name is required'],
        trim: true,
        maxlength: [50, 'Name cannot exceed 50 characters']
    },
    review: {
        type: String,
        required: [true, 'Review text is required'],
        minlength: [10, 'Review should be at least 10 characters'],
        maxlength: [500, 'Review cannot exceed 500 characters']
    },
    career: {
        type: String,
        trim: true,
        default: 'Not specified'
    },
    rating: {
        type: Number,
        required: true,
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating cannot exceed 5'],
        validate: {
            validator: Number.isInteger,
            message: 'Rating must be an integer'
        }
    },
    likes: {
        type: Number,
        default: 0,
        min: 0
    },
    createdAt: {
        type: Date,
        default: Date.now,
        immutable: true
    }
}, {
    timestamps: false,
    versionKey: false,
});

const Testimonial = model("Testimonial", testimonialSchema);
export default Testimonial;
