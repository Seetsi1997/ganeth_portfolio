import emailjs from "emailjs-com";
import React, { useRef, useState } from "react";
import {
  FaCheckCircle,
  FaMailBulk,
  FaPhoneAlt,
  FaWhatsapp
} from "react-icons/fa";
import "./contact.css";

const Contact = () => {
  const form = useRef();
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const validateForm = (formData) => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.get("name").trim()) {
      newErrors.name = "Name is required";
    } else if (formData.get("name").trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.get("email").trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.get("email"))) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.get("message").trim()) {
      newErrors.message = "Message is required";
    } else if (formData.get("message").trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    if (!validateForm(formData)) return;

    setIsSubmitting(true);
    setSubmitStatus(null);
    setShowSuccess(false);

    try {
      const result = await emailjs.sendForm(
        "service_q3px6yv",
        "template_2wrbctv",
        form.current,
        "npHBNw3XwsamTRurd"
      );

      if (result.status === 200) {
        setSubmitStatus({
          success: true,
          message: "Message sent successfully",
        });
        setShowSuccess(true);
        form.current.reset();

        // Hide after 0.3 seconds
        setTimeout(() => {
          setShowSuccess(false);
        }, 60000);
      }
    } catch (error) {
      console.error("Failed to send:", error);
      setSubmitStatus({
        success: false,
        message: error.text || "Failed to send message. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };



  return (
    <section id="contact" className="section-emphasis">
      <h5>Get in touch with me</h5>
      <h2>Contact Me</h2>

      <div className="container contact__container">
        <div className="contact__options">
          <article className="contact__option">
            <FaMailBulk className="contact__option-icon" />
            <h4>Email</h4>
            <a href="mailto:seetsi1997@gmail.com">Email Me</a>
          </article>
          <article className="contact__option">
            <FaPhoneAlt className="contact__option-icon" />
            <h4>Call me</h4>
            <a href="tel:27609440410">Call Me</a>
          </article>
          <article className="contact__option">
            <FaWhatsapp className="contact__option-icon" />
            <h4>WhatsApp</h4>
            <a href="https://wa.me/27609440410">Chat on WhatsApp</a>
          </article>
        </div>

        <form ref={form} onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="name"
              placeholder="Enter Your Full Name"
              className={errors.name ? "error" : ""}
            />
            {errors.name && (
              <span className="error-message">{errors.name}</span>
            )}
          </div>

          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Enter Your Email"
              className={errors.email ? "error" : ""}
            />
            {errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
          </div>

          <div className="form-group">
            <textarea
              name="message"
              rows="7"
              placeholder="Enter Your Message"
              className={errors.message ? "error" : ""}
            />
              <span className="error-message">{errors.message}</span>
          </div>

          {showSuccess && (
            <div className="submit-status success">
              <FaCheckCircle className="success-icon" />
              {submitStatus.message}
            </div>
          )}

          {submitStatus && !submitStatus.success && (
            <div className="submit-status error">{submitStatus.message}</div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contact;
