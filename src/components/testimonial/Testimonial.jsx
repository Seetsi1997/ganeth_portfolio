import axios from "axios";
import { useEffect, useState } from "react";
import { FaStar, FaHeart } from "react-icons/fa";
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import IMG from '../../assets/me.jpg';
import AddTestimonialForm from "./AddTestimonialsForm";
import './testimonial.css';

const Testimonial = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch testimonials with proper error handling
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/testimonials`,
          { timeout: 5000 } // Add timeout
        );
        setTestimonials(response.data);
      } catch (err) {
        console.error("Error fetching testimonials:", err);
        setError(err.response?.data?.message || "Failed to load testimonials");
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  // Optimized like functionality with loading states
  const likeTestimonial = async (id) => {
    try {
      setTestimonials(prev => prev.map(t => 
        t._id === id ? { ...t, likes: t.likes + 1, isLiking: true } : t
      ));

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/testimonials/${id}/likes`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            // Add auth header if needed:
            // 'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      setTestimonials(prev => prev.map(t => 
        t._id === id ? { ...t, likes: response.data.likes, isLiking: false } : t
      ));
    } catch (error) {
      console.error("Error liking testimonial:", error);
      // Revert optimistic update on error
      setTestimonials(prev => prev.map(t => 
        t._id === id ? { ...t, isLiking: false } : t
      ));
    }
  };

  // Handle new testimonial addition
  const handleNewTestimonial = (newTestimonial) => {
    setTestimonials(prev => [newTestimonial, ...prev]);
    setShowPopup(false);
  };

  if (loading) return <div className="loading-spinner">Loading testimonials...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <section id='testimonials' className="section-emphasis">
      <h5>What people are saying</h5>
      <h2>Testimonials</h2>

      <AddTestimonialForm
        isActive={showPopup}
        onClose={() => setShowPopup(false)}
        onTestimonialAdded={handleNewTestimonial}
      />

      <Swiper
        className="container testimonials__container"
        modules={[Pagination]}
        spaceBetween={40}
        slidesPerView={1}
        pagination={{ clickable: true }}
      >
        {testimonials.map((testimonial) => (
          <TestimonialSlide 
            key={testimonial._id}
            testimonial={testimonial}
            onLike={likeTestimonial}
          />
        ))}
      </Swiper>

      <button 
        className="btn btn-primary" 
        onClick={() => setShowPopup(true)}
        aria-label="Add your testimonial"
      >
        Post a Testimonial
      </button>
    </section>
  );
};

// Separate component for individual testimonial slide
const TestimonialSlide = ({ testimonial, onLike }) => {
  const formattedDate = new Date(testimonial.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <SwiperSlide className="testimonial">
      <div className="client__avatar">
        <img src={IMG} alt={testimonial.userName} loading="lazy" />
      </div>
      <h5 className='client__name'>{testimonial.userName}</h5>
      <small className='client__review'>
        <span className='quote-one'>&ldquo;</span>
        {testimonial.review}
        <span className='quote-two'>&rdquo;</span>
      </small>
      <h4 className='client__career'>{testimonial.career}</h4>

      <div className="client__likes">
        <p className='client__rating'>
          <FaStar color="#FFD700" />
          <span>{testimonial.rating}/5</span>
        </p>
        <p className='client__date'>{formattedDate}</p>
      </div>

      <button 
        onClick={() => onLike(testimonial._id)}
        className="like-button"
        disabled={testimonial.isLiking}
        aria-label={`Like ${testimonial.userName}'s testimonial`}
      >
        <FaHeart color={testimonial.isLiking ? "#ccc" : "#ff6b6b"} />
        {testimonial.likes || 0}
      </button>
    </SwiperSlide>
  );
};

export default Testimonial;