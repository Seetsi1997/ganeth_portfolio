import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import ServiceCard from './ServiceCard.jsx';
import './service.css';

const Service = () => {
  const [servicesData, setServicesData] = useState([]);
  const [loading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState(null);

  useEffect(() => {

    const fetchServices = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/services`);
        console.log('API Response:', response); // Debug log

        // Handle both wrapped and unwrapped responses
        setServicesData(response.data?.data || response.data || []);

      } catch (error) {
        if (error.response) {
          // Server responded with error status
          console.error('API Error:', error.response.status, error.response.data);
          if (error.response.status === 404) {
            setServicesData([]); // No services is valid
          } else {
            setErrors('Server error loading services');
          }
        } else {
          // Network/request setup error
          console.error('Network Error:', error.message);
          setErrors('Cannot connect to server');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) return <div className="loading">Loading services...</div>;
  if (errors) return <div className="error">Error: {errors}</div>;

  return (
    <section id='services' className='services'>
      <h5>My knowledge</h5>
      <h2>Services</h2>


      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={30}
        slidesPerView={3}
        navigation
        pagination={{ clickable: true }}
        breakpoints={{
          0: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 }
        }}
      >
        {servicesData.map((service) => (
          <SwiperSlide key={service._id} style={{ height: 'auto' }}>
            <ServiceCard service={service} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Service;