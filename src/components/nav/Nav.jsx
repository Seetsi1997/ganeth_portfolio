import React, { useState } from 'react';
import { FaChevronDown, FaGraduationCap, FaHome, FaTools, FaUser } from "react-icons/fa";
import { FaPhone } from "react-icons/fa6";
import { GoQuote } from "react-icons/go";
import { MdAssignment } from "react-icons/md";
import { RiServerLine } from 'react-icons/ri';
import './nav.css';

const Nav = () => {
  const [activeNav, setActiveNav] = useState("#home"); 

  return (
    <nav>
      <a href="#home" onClick={() => setActiveNav("#home")} className={activeNav === "#home" ? "active" : ""}><FaHome /></a>
      <a href="#about" onClick={() => setActiveNav("#about")} className={activeNav === "#about" ? "active" : ""}><FaUser /></a>
      <a href="#qualification" onClick={() => setActiveNav("#qualification")} className={activeNav === "#qualification" ? "active" : ""}><FaGraduationCap /></a>
      <a href="#skills" onClick={() => setActiveNav("#skills")} className={activeNav === "#skills" ? "active" : ""}><FaTools /></a>
      <a href="#services" onClick={() => setActiveNav("#services")} className={activeNav === "#services" ? "active" : ""}><RiServerLine /></a>
      <a href="#portfolio" onClick={() => setActiveNav("#portfolio")} className={activeNav === "#portfolio" ? "active" : ""}><MdAssignment /></a>
      <a href="#testimonials" onClick={() => setActiveNav("#testimonials")} className={activeNav === "#testimonials" ? "active" : ""}><GoQuote /></a>
      <a href="#contact" onClick={() => setActiveNav("#contact")} className={activeNav === "#contact" ? "active" : ""}><FaPhone /></a>
      <a href="#footer" onClick={() => setActiveNav("#footer")} className={activeNav === "#footer" ? "active" : ""}><FaChevronDown /></a>
    </nav>
  );
};


export default Nav
