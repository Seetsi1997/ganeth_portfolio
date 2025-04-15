import React, { useState, useEffect } from 'react';
import './service.css';

const ServiceCard = ({ service }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 600);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const closePopup = (e) => {
    if (e) e.stopPropagation();
    setIsPopupOpen(false);
  };

  return (
    <>
      <div className="service-card">
        <div className="service-icon">
          <img src={service.icon} alt={service.title} />
        </div>
        <h3 className="service-title">{service.title}</h3>
        
        {isMobile ? (
          <>
            <div className="service-brief">{service.brief}</div>
            <div className="service__card-details">
              {Array.isArray(service.description) ? (
                service.description.map((item, index) => (
                  <p key={index}>{item.name || item}</p>
                ))
              ) : (
                <p>{service.description}</p>
              )}
            </div>
            {service.category && (
              <div className="service__card-meta">
                <span className={`category ${service.category.toLowerCase()}`}>
                  {service.category}
                </span>
              </div>
            )}
          </>
        ) : (
          <>
            <p className="service-brief">{service.brief || service.description[0]?.name}</p>
            <button 
              className="service-button"
              onClick={togglePopup}
            >
              View Details
            </button>
          </>
        )}
      </div>

      {/* Popup Overlay */}
      <div 
        className={`service-popup-overlay ${isPopupOpen ? 'active' : ''}`}
        onClick={closePopup}
      >
        <div 
          className="service__popup-content"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="close__service-card"
            onClick={closePopup}
            aria-label="Close popup"
          >
            &times;
          </button>
          <h3>{service.title}</h3>
          <div className="service__card-details">
            {Array.isArray(service.description) ? (
              service.description.map((item, index) => (
                <p key={index}>{item.name || item}</p>
              ))
            ) : (
              <p>{service.description}</p>
            )}
          </div>
          {service.category && (
            <div className="service__card-meta">
              <span className={`category ${service.category.toLowerCase()}`}>
                {service.category}
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ServiceCard;