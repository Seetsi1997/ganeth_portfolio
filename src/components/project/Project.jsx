import axios from "axios";
import React, { useEffect, useState } from "react";
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
// Swiper v11 CSS imports:
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './project.css';


const Portfolio = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [portfolioData, setPortfolioData] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const openModal = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "auto";
  };

  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${process.env.REACT_APP_API_URL}portfolios`);
        
        if (isMounted) {
          if (response.data.success) {
            setPortfolioData(response.data.data || []);
          } else {
            setErrors("Failed to load portfolio data");
          }
        }
      } catch (error) {
        if (isMounted) {
          console.error("Portfolio fetch error:", error);
          setErrors("Failed to load portfolio data");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
  
    fetchData();
  
    return () => {
      isMounted = false;
    };
  }, []); 

 /* const fetchPortfolioData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/portfolios`);
      console.log("Full API response:", response);
      console.log("Response data:", response.data);

      if (response.data.success) {
        // More flexible data extraction
        const projects = response.data.data || [];
        console.log("Raw projects data:", projects);

        // Less strict filtering - only check if project exists
        const validProjects = projects.filter((project) => project);
        console.log("Valid projects after filter:", validProjects);

        setPortfolioData(validProjects);
      } else {
        console.log("API returned success=false");
        setPortfolioData([]);
      }
    } catch (error) {
      console.error("Portfolio fetch error:", error);
      setErrors("Failed to load portfolio data");
      setPortfolioData([]);
    } finally {
      setIsLoading(false);
    }
  };*/

  const handleApproveProject = async (projectId) => {
    setIsUpdating(true);
    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_API_URL}portfolios/${projectId}/approve`
      );

      if (response.data.success) {
        // Update both the list and modal view
        setPortfolioData(prev => prev.map(project =>
          project._id === projectId
            ? { ...project, status: 'approved' }
            : project
        ));

        setSelectedProject(prev => prev && { ...prev, status: 'approved' });
      }
    } catch (error) {
      console.error("Approval failed:", error);
      setErrors("Failed to approve project");
    } finally {
      setIsUpdating(false);
    }
  };


  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toISOString().split("T")[0];
  };


  const renderPortfolioContent = () => {
    if (isLoading) {
      return <div className="loading-indicator">Loading projects...</div>;
    }
    if (errors.portfolio) {
      return <div className="error-message">{errors.portfolio}</div>;
    }
    if (portfolioData.length === 0) {
      return <div className="error-not-found">No Projects Found.</div>;
    }
    return (
      <Swiper
        className="container portfolio__container"
        modules={[Navigation, Pagination]}
        spaceBetween={40}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        breakpoints={{
          0: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 }
        }}
      >
        {portfolioData.map((project) => (
            <SwiperSlide
              key={
                project._id ||
                project.id ||
                project.projectName ||
                `project-${Math.random()}`
              }
              className="portfolio__item"
              onClick={() => openModal(project)}
            >
              <div className="portfolio__item-image">
                <img
                  /*src={`${process.env.REACT_APP_API_URL || ''}${project.imageUrl}`}*/src={project.imageUrl}
                  alt={project.projectName}
                />
              </div>
  
              <div className="portfolio__item-cta">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    className="btn btn-primary"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    GitHub
                  </a>
                )}
                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    className="btn btn-primary"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Live Demo
                  </a>
                )}
              </div>
            </SwiperSlide>
          ))}
      </Swiper>
    );
  };

  return (
    <section id="portfolio" className="section-emphasis">
      <h5>Browse My Recent Projects</h5>
      <h2>Portfolio</h2>
  
      {renderPortfolioContent()}

      {isModalOpen && selectedProject && (
        <div className="project-popup">
          <div className="project__popup-content">
            <button className="close-popup" onClick={closeModal}>
              &times;
            </button>

            <div className="popup-header">
              <h2>{selectedProject.projectName}</h2>
            </div>

            <div className="popup-body">
              <div className="project__popup-body">
                <h3>Description</h3>
                <p>{selectedProject.description}</p>
              </div>

              <div className="project__popup-features">
                <h3>Key Features</h3>
                <ul>
                  {selectedProject.features?.map((feature, index) => (
                    <li key={`${selectedProject._id}-feature-${index}`}>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="project__popup-technologies">
                <h3>Technologies Used</h3>
                <div className="tech__popup-stack">
                  {selectedProject.technologies?.map((tech, index) => (
                    <span
                      key={`${selectedProject._id}-tech-${index}`}
                      className="tech__popup-item"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="footer-popup">
              <div className="project__popup-approval">
                <span className={`status-badge ${selectedProject.status.toLowerCase()}`}>
                  {selectedProject.status}
                </span>

                {selectedProject.status.toLowerCase() === 'pending' && (
                  <button
                    className="approve-btn"
                    onClick={() => handleApproveProject(selectedProject._id)}
                    disabled={isUpdating}
                  >
                    {isUpdating ? 'Approving...' : 'Approve Project'}
                  </button>
                )}
              </div>
              <div className="project__popup-dates">
                <span>Start: {formatDate(selectedProject.startDate)}</span>
                <span>End: {formatDate(selectedProject.endDate)}</span>
              </div>
              <div className="project__popup-created-date">
                <span>CreatedAt: {formatDate(selectedProject.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Portfolio;
