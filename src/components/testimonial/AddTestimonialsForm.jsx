import axios from "axios";
import { useState } from "react";
import IMG from '../../assets/me.jpg';
import './addTestimonialForm.css';

const AddTestimonialForm = ({ onClose, isActive, onTestimonialAdded }) => {
  const [formData, setFormData] = useState({
    userName: "",
    review: "",
    career: "",
    rating: "",
  });
  
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const validateForm = (isSubmitted = false) => {
    const newErrors = {};
    const { userName, review, career, rating } = formData;
    
    const shouldValidate = (field) => isSubmitted || touched[field];
    
    // Name validation
    if (shouldValidate('userName')) {
      if (!userName.trim()) {
        newErrors.userName = 'Name is required';
      } else if (userName.trim().length < 4) {
        newErrors.userName = 'Name must be at least 4 characters';
      } else if (!/^[a-zA-Z\s]+$/.test(userName.trim())) {
        newErrors.userName = 'Name can only contain letters and spaces';
      }
    }
    
    // Career validation
    if (shouldValidate('career')) {
      if (!career.trim()) {
        newErrors.career = 'Career is required';
      } else if (career.trim().length < 2) {
        newErrors.career = 'Career must be at least 2 characters';
      } else if (career.trim().length > 50) {
        newErrors.career = 'Career cannot exceed 50 characters';
      }
    }

    // Review validation
    if (shouldValidate('review')) {
      if (!review.trim()) {
        newErrors.review = 'Review is required';
      } else if (review.trim().length < 10) {
        newErrors.review = 'Review must be at least 10 characters';
      } else if (review.trim().length > 500) {
        newErrors.review = 'Review cannot exceed 500 characters';
      }
    }
    
    // Rating validation
    if (shouldValidate('rating')) {
      if (!rating) {
        newErrors.rating = 'Rating is required';
      } else if (isNaN(rating) || rating < 1 || rating > 5) {
        newErrors.rating = 'Please provide a valid rating (1-5)';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value) || '' : value
    }));
    
    setTouched(prev => ({ ...prev, [name]: true }));
    
    if (touched[name] || errors[name]) {
      validateForm();
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm(true)) return;
    
    setIsSubmitting(true);
    setSubmitSuccess(false);
    
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/testimonials`, 
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      
      if (response.status === 201) {
        setSubmitSuccess(true);
        onTestimonialAdded(response.data);
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    } catch (error) {
      console.error("Submission error:", error);
      
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else if (error.code === 'ERR_NETWORK') {
        setErrors({ 
          server: 'Network error - please check your connection' 
        });
      } else {
        setErrors({ 
          server: error.response?.data?.message || 'Failed to submit testimonial' 
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className={`add__testimonial-form-popup ${isActive ? 'active' : ''}`}>
        <div className="add__testimonial-form-content success-message">
          <h2>Thank You!</h2>
          <p>Your testimonial has been submitted successfully.</p>
          <button 
            className="close__testimonial-form" 
            onClick={onClose}
          >
            &times;
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`add__testimonial-form-popup ${isActive ? 'active' : ''}`}>
      <div className="add__testimonial-form-content">
        <button 
          className="close__testimonial-form" 
          onClick={onClose}
          disabled={isSubmitting}
          aria-label="Close form"
        >
          &times;
        </button>
        
        <h2>Add Your Testimonial</h2>
        
        <div className="client__avatar">
          <img src={IMG} alt="User avatar" />
        </div>
        
        {errors.server && (
          <div className="server-error-message">
            {errors.server}
          </div>
        )}
        
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <input
              type="text"
              name="userName"
              placeholder="Your Name"
              value={formData.userName}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`${errors.userName ? 'error' : ''}`}
              disabled={isSubmitting}
              required
            />
            {errors.userName && (
              <span className="error-message">{errors.userName}</span>
            )}
          </div>

          <div className="form-group">
            <input
              type="text"
              name="career"
              placeholder="Your Career (e.g., Software Developer)"
              value={formData.career}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`${errors.career ? 'error' : ''}`}
              disabled={isSubmitting}
              required
            />
            {errors.career && (
              <span className="error-message">{errors.career}</span>
            )}
          </div>
          
          <div className="form-group">
            <textarea
              name="review"
              placeholder="Share your experience..."
              value={formData.review}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`${errors.review ? 'error' : ''}`}
              disabled={isSubmitting}
              rows="5"
              required
            ></textarea>
            {errors.review && (
              <span className="error-message">{errors.review}</span>
            )}
          </div>
          
          <div className="form-group rating-group">
            <label htmlFor="rating">Your Rating:</label>
            <input
              type="number"
              id="rating"
              name="rating"
              placeholder="1-5"
              min="1"
              max="5"
              value={formData.rating}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`${errors.rating ? 'error' : ''}`}
              disabled={isSubmitting}
              required
            />
            {errors.rating && (
              <span className="error-message">{errors.rating}</span>
            )}
          </div>
          
          <button 
            type="submit" 
            className="submit-button"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner"></span>
                Submitting...
              </>
            ) : 'Submit Testimonial'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTestimonialForm;