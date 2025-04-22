import React from 'react';
import CTA from './CTA';
import './header.css';
import HeaderSocial from './HeaderSocial';

const Header = () => {
  return (
    <section id='home' className='section-emphasis'>
      <header>
       <div className='container header__container'>
        <h5>Hey I'm</h5>
        <h1>Ganeth Seetsi</h1>
     
         <h5 className="text-light">Frontend Developer</h5>
         <div className="cta-wrapper"> 
            <CTA/>
          </div>
         <HeaderSocial/>
        </div>
      </header>
    </section>
   
  );
}

export default Header;
