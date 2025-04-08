import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const portfolioSchema = new Schema({
    projectName: {
        type: String,
        required: [true, 'Project name is required'],
        trim: true,
        minlength: [3, "Project name must be at least 3 characters long"],
        maxlength: [150, 'Project name cannot exceed 150 characters']
    },
    description: {
        type: String,
        required: [true, 'Project description is required'],
        minlength: [10, "Description must be at least 10 characters long"],
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    features: {
        type: [String],
        required: [true, 'At least one feature is required'],
        validate: {
            validator: function(features) {
                return features.length > 0;
            },
            message: 'At least one feature is required'
        }
    },
    technologies: {
        type: [String],
        required: [true, 'At least one technology is required'],
        validate: {
            validator: function(techs) {
                return techs.length > 0;
            },
            message: 'At least one technology is required'
        }
    },
    githubUrl: {
        type: String,
        required: [true, 'GitHub URL is required'],
        match: [/https?:\/\/(www\.)?github\.com\/.+/i, 'Please enter a valid GitHub URL']
    },
    demoUrl: {
        type: String,
        match: [/https?:\/\/.+/i, 'Please enter a valid URL']
    },
    imageUrl: {
        type: String,
        required: [true, 'Image URL is required']
    },
    startDate: {
        type: Date,
        required: [true, 'Start date is required'],
        validate: {
            validator: function(date) {
                return date <= this.endDate;
            },
            message: 'Start date must be before end date'
        }
    },
    endDate: {
        type: Date,
        required: [true, 'End date is required']
    },
    status: {
        type: String,
        enum: ['approved', 'pending'],
        default: 'pending'
      },
    createdAt: {
        type: Date,
        default: Date.now,
        immutable: true
    }
}, {
    timestamps: true,
    versionKey: false,
    toJSON: {
        virtuals: true,
        transform: function(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            return ret;
        }
    },
    toObject: {
        virtuals: true
    }
});

// Virtual for project duration in days
portfolioSchema.virtual('durationDays').get(function() {
    const diffTime = Math.abs(this.endDate - this.startDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Static method to find approved projects
portfolioSchema.statics.findApproved = function() {
    return this.find({ status: 'approved' });
};

// Instance method to format dates
portfolioSchema.methods.getFormattedDates = function() {
   
    return {
        
        startDate: this.startDate.toLocaleDateString('en-ZA', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' ,
            hour12: true
        }).toUpperCase(),
        endDate: this.endDate.toLocaleDateString('en-ZA', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' ,
            hour12: true
        }).toUpperCase(),
        
    };

    
};

const Portfolios = model("Portfolios", portfolioSchema);
export default Portfolios;