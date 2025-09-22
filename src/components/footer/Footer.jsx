import React, { useEffect, useState } from "react";
import { BsGithub, BsInstagram, BsLinkedin } from "react-icons/bs";
import "./footer.css";

const Footer = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [formattedDateTime, setFormattedDateTime] = useState("");

// Function to format the date
const formatDate = (date) => {
  const options = { weekday: "long", day: "numeric", month: "long", year: "numeric" };
  
  const formattedDate = new Intl.DateTimeFormat("en-US", options).formatToParts(date);
  
  // Extract the parts manually
  let weekday = "", day = "", month = "", year = "";

  formattedDate.forEach(({ type, value }) => {
    if (type === "weekday") weekday = value;
    if (type === "day") day = value;
    if (type === "month") month = value;
    if (type === "year") year = value;
  });

  return `${weekday}, ${day} ${month} ${year}`; 
};

useEffect(() => {
  const myDate = new Date();
  const formattedDate = formatDate(myDate); 
  setFormattedDateTime(formattedDate);
  setYear(myDate.getUTCFullYear());
}, []);


  return (
    <footer className="footer" id="footer">
      <div className="footer__bg">
        <div className="footer__container container grid">
          <div>
            <span className="footer__copy" id="datetime">
              {formattedDateTime}
            </span>
            <h1 className="footer__title">Ganeth Seetsi</h1>
            <span className="footer__subtitle">Full Stack Developer</span>
          </div>

          <ul className="footer__links">
            <li>
              <a href="#skills" className="footer__link">
                Skills
              </a>
            </li>
            <li>
              <a href="#services" className="footer__link">
                Services
              </a>
            </li>
            <li>
              <a href="#portfolio" className="footer__link">
                Projects
              </a>
            </li>
          </ul>

          <div className="footer__socials">
            <a
              href="https://linkedin.com/in/ganeth-seetsi-531098168/"
              target="_blank"
              rel="noreferrer"
            >
              <BsLinkedin />
            </a>
            <a
              href="https://instagram.com/ganeth14/"
              target="_blank"
              rel="noreferrer"
            >
              <BsInstagram />
            </a>
            <a
              href="https://github.com/seetsi1997/"
              target="_blank"
              rel="noreferrer"
            >
              <BsGithub />
            </a>
          </div>
        </div>

        <p className="footer__copy">
          2023-<span id="year">{year}</span> &#169; Designed and Developed by
          Ganeth Seetsi. All Rights Reserved.
        </p>

        <div id="socials-container"></div>
      </div>
    </footer>
  );
};

export default Footer;