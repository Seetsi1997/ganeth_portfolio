import React, { useEffect, useState } from 'react';
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

  return (
    <div className="service-card">
      <div className="service-icon">
        <img src={service.icon} alt={service.title} />
      </div>
      <h3 className="service-title">{service.title}</h3>
      
      {/* Different content display for mobile vs desktop */}
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
            onClick={() => setIsPopupOpen(true)}
          >
            View Details
          </button>

          {/* Popup for desktop */}
          {isPopupOpen && (
            <div className="service-popup">
              <div 
                className="service__popup-content"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="close__service-card"
                  onClick={() => setIsPopupOpen(false)}
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
          )}
        </>
      )}
    </div>
  );
};

export default ServiceCard;