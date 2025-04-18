import axios from 'axios';
import React, { useEffect, useState } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import './service.css';
import ServiceCard from './ServiceCard.jsx';

const Service = () => {
  const [servicesData, setServicesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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


  const renderServicesContent = () => {
    if (isLoading) {
      return <div className="loading-indicator">Loading Services...</div>;
    }
    if (errors) {
      return <div className="error-message">{errors}</div>;
    }
    if (servicesData.length === 0) {
      return <div className="error-not-found">No Services Found.</div>;
    }
    return ( 
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
    );
  };

  
  return (
    <section id='services' className='section-emphasis services'>
      <h5>My knowledge</h5>
      <h2>Services</h2>
        
      {renderServicesContent()}
     
    </section>
  );
};

export default Service;