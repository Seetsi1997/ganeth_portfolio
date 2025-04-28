import axios from "axios";
import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
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

  // Fetch testimonials when the component mounts
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/testimonials`)
      .then(response => setTestimonials(response.data))
      .catch(error => console.error("Error fetching testimonials:", error));
  }, []);

  // Function to handle liking a testimonial
  async function likeTestimonial(id) {
    try {
      // Send a like request to the API
      await fetch(`${process.env.REACT_APP_API_URL}/testimonials/likes/${id}`, { method: "POST" });

      // Reload testimonials after liking to get updated data (or you could just update the likes count locally)
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/testimonials`);
      setTestimonials(response.data); // Update state with the latest testimonials
    } catch (error) {
      console.error("Error liking testimonial:", error);
    }
  }

  return (
    <section id='testimonials' className="section-emphasis">
      <h5>What people are saying</h5>
      <h2>Testimonials</h2>

      <AddTestimonialForm
        isActive={showPopup}
        onClose={() => setShowPopup(false)}
      />

      <Swiper
        className="container testimonials__container"
        modules={[Pagination]}
        spaceBetween={40}
        slidesPerView={1}
        pagination={{ clickable: true }}
      >
        {testimonials.map((testimonial) => (
          <SwiperSlide key={testimonial._id} className="testimonial">
            <div className="client__avatar">
              <img src={IMG} alt={testimonial.userName} />
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
                <FaStar />
                <span>{testimonial.rating}/5</span>
              </p>
              <p className='client__date'>{new Date(testimonial.createdAt).toLocaleString()}</p>
            </div>

            {/* Like button */}
            <button onClick={() => likeTestimonial(testimonial._id)}>
              ❤️ ({testimonial.likes || 0}) {/* Display likes count */}
            </button>
          </SwiperSlide>
        ))}
      </Swiper>

      <button className="btn btn-primary" onClick={() => setShowPopup(true)}>Post a Testimonial</button>
    </section>
  );
};

export default Testimonial;
