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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.userName.trim()) {
      newErrors.userName = 'Name is required';
    } else if (formData.userName.trim().length < 4) {
      newErrors.userName = 'Name must be at least 4 characters';
    }
    
    if (!formData.career.trim()) {
      newErrors.career = 'Career is required';
    } else if (formData.career.trim().length < 2) { 
      newErrors.career = 'Career must be at least 2 characters';
    } else if (formData.career.trim().length > 50) {  
      newErrors.career = 'Career cannot exceed 50 characters';
    }

    if (!formData.review.trim()) {
      newErrors.review = 'Review is required';
    } else if (formData.review.trim().length < 10) {
      newErrors.review = 'Review must be at least 10 characters';
    }
    
    if (!formData.rating) {
      newErrors.rating = 'Rating is required';
    } else if (formData.rating < 1 || formData.rating > 5) {
      newErrors.rating = 'Rating must be between 1-5';
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
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await axios.post("/api/testimonials", formData);
      
      if (response.status === 201) {
        setSubmitSuccess(true);
        
        if (onTestimonialAdded) {
          onTestimonialAdded(response.data);
        }
        
        setTimeout(() => {
          setFormData({
            userName: "",
            review: "",
            career: "",
            rating: "",
          });
          onClose();
        }, 2000);
      }
    } catch (error) {
      console.error("Submission error:", error);
      
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } 
      else if (error.code === 'ERR_NETWORK') {
        alert('Network error - please check your connection');
      }
      else {
        alert(error.response?.data?.message || 'Failed to submit testimonial');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
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
            onClick={handleClose}
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
          onClick={handleClose}
          disabled={isSubmitting}
        >
          &times;
        </button>
        
        <h2>Add Your Testimonial</h2>
        
        <div className="client__avatar">
          <img src={IMG} alt="User avatar" />
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="userName"
              placeholder="Your Name"
              value={formData.userName}
              onChange={handleChange}
              className={errors.userName ? 'error' : ''}
            />
            {errors.userName && <span className="error-message">{errors.userName}</span>}
          </div>

          <div className="form-group">
            <input
              type="text"
              name="career"
              placeholder="Your Career"
              value={formData.career}
              onChange={handleChange}
              className={errors.career ? 'error' : ''}
            />
            {errors.career && <span className="error-message">{errors.career}</span>}
          </div>
          
          <div className="form-group">
            <textarea
              name="review"
              placeholder="Your Review"
              value={formData.review}
              onChange={handleChange}
              className={errors.review ? 'error' : ''}
            ></textarea>
            {errors.review && <span className="error-message">{errors.review}</span>}
          </div>
          
          <div className="form-group">
            <input
              type="number"
              name="rating"
              placeholder="Rating (1-5)"
              min="1"
              max="5"
              value={formData.rating}
              onChange={handleChange}
              className={errors.rating ? 'error' : ''}
            />
            {errors.rating && <span className="error-message">{errors.rating}</span>}
          </div>
          
          <button 
            type="submit" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                Submitting...
                <span className="spinner"></span>
              </>
            ) : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTestimonialForm;