import React from 'react';
import CV from '../../assets/GanethCV.pdf';

const CTA = () => {
  return (
    <div className="cta">
      <div className="btn-wrapper">
        <a href={CV} download className="btn">Download CV</a>
      </div>
      <div className="btn-wrapper">
        <a href="#contact" className="btn btn-primary">Let's Talk</a>
      </div>
    </div>

  );
};

export default CTA;
