import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaAward, FaBriefcase, FaCertificate, FaFolder } from "react-icons/fa";
import ME from "../../assets/about_me.jpg";
import "./about.css";


const About = () => {
  const [popup, setPopup] = useState(null);
  //Notable projects I've worked on, highlighting your skills and contributions, useState
  const [projects, setProjects] = useState([]);
  const [formProjectData, setFormProjectData] = useState({ projectName: "" });
  //Work Experience, useState
  const [works, setWorks] = useState([]);
  const [formWorkHistoryData, setFormWorkHistoryData] = useState({
    workHistory: "",
  });
  //Certifications I have completed, useState
  const [certificatesName, setCertificatesName] = useState([]);
  const [formCertificatesData, setFormCertificatesData] = useState({
    certificateName: "",
  });
  const [approvingId, setApprovingId] = useState(null);
  // Organizations I have been employed at or gained experience towards my work
  const [companiesName, setCompaniesName] = useState([]);
  const [formCompaniesData, setFormCompaniesData] = useState({
    companyName: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // Handle Open Popup ||  Handle close Popup
  const handleOpenPopup = (card) => {
    setPopup(card);
  };

  const handleClosePopup = () => {
    setPopup(null);
    setErrors({});
  };

  const [counts, setCounts] = useState({
    experiences: 0,
    projects: 0,
    companies: 0,
    certificates: 0
  });

  // Separate handlers for projects and work history and certificates and company i worked
  // Updates the correct field in project data ||  work history data
  const handleChangeProjects = (e) => {
    const { name, value } = e.target;
    setFormProjectData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChangeWorkHistory = (e) => {
    const { name, value } = e.target;
    setFormWorkHistoryData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChangeCertificate = (e) => {
    const { name, value } = e.target;
    setFormCertificatesData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChangeCompanies = (e) => {
    const { name, value } = e.target;
    setFormCompaniesData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  // Validate Projects Form | Validate Work History Form |
  // Validate Certificates Form  |  Validate Company I Worked Form
  const validateProjectsForm = () => {
    const newErrors = {};
    const projectName = formProjectData.projectName;

    // Check if projectName exists and is a string
    if (typeof projectName !== 'string') {
      newErrors.projectName = "Invalid project name format";
    }
    // Check minimum length (example: 3 characters)
    else if (projectName.trim().length < 3) {
      newErrors.projectName = "Project name must be at least 3 characters";
    }
    // Check maximum length
    else if (projectName.length > 150) {
      newErrors.projectName = "Project name cannot exceed 150 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateWorkHistoryForm = () => {
    // Clear previous errors
    setErrors({});

    const { workHistory } = formWorkHistoryData;

    if (!workHistory?.trim()) {
      setErrors({ workHistory: "Work history cannot be empty." });
      return false;
    }

    if (workHistory.length < 10) {
      setErrors({
        workHistory: "Please provide more details (min 10 chars)",
      });
      return false;
    }

    if (workHistory.length > 500) {
      setErrors({
        workHistory: "Your work history entry must be within 350 characters.",
      });
      return false;
    }

    return true;
  };

  const validateCertificateForm = () => {
    // Clear previous errors
    setErrors({});

    const { certificateName } = formCertificatesData;

    if (!certificateName?.trim()) {
      setErrors({ certificateName: "Certificate name cannot be empty" });
      return false;
    }

    if (certificateName.length < 10) {
      setErrors({
        certificateName: "Certificate name must be at least 10 characters",
      });
      return false;
    }

    if (certificateName.length > 100) {
      setErrors({
        certificateName: "Certificate name cannot exceed 100 characters",
      });
      return false;
    }

    return true;
  };

  const validateCompaniesForm = () => {
    // Clear previous errors
    setErrors({});

    const { companyName } = formCompaniesData;

    if (!companyName?.trim()) {
      setErrors({ companyName: "Company name cannot be empty" });
      return false;
    }

    if (companyName.length < 10) {
      setErrors({
        companyName: "Company name must be at least 10 characters",
      });
      return false;
    }

    if (companyName.length > 150) {
      setErrors({
        companyName: "Company name cannot exceed 150 characters",
      });
      return false;
    }

    return true;
  };

  // Handle Submit Project Details |  Handle Submit Work History Details
  // Handle Submit Certificate Details |  Handle Submit Companies I worked Details
  const handleSubmitProject = async (e) => {
    e.preventDefault();

    // Double-check validation
    const projectName = formProjectData.projectName || "";
    if (!validateProjectsForm()) {
      return;
    }

     // Double check we're in admin mode (client-side protection)
     if (process.env.REACT_APP_IS_ADMIN !== 'true') {
      setErrors({ submit: "Admin access required" });
      return;
    }

    setIsSubmitting(true);
    const tempId = Date.now().toString();
    const trimmedProjectName = projectName.trim();

    try {
      console.log("Submitting:", {
        name: trimmedProjectName,
        length: trimmedProjectName.length
      });

      // Optimistic update
      setProjects(prev => [...prev, {
        _id: tempId,
        projectName: trimmedProjectName,
        status: "approved",
        createdAt: new Date().toISOString(),
        isOptimistic: true
      }]);


      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/projects`,
        {
          projectName: trimmedProjectName,
          status: "approved",
        },
        {
          params: {
            secret: process.env.REACT_APP_ADMIN_SECRET
          },
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      // Update with server response
      setProjects(prev =>
        prev.map(project =>
          project._id === tempId
            ? {
              ...response.data,
              _id: response.data._id || tempId,
              createdAt: response.data.createdAt || project.createdAt,
              isOptimistic: undefined,
            }
            : project
        )
      );

      setFormProjectData({ projectName: "" });
      setErrors({});

    } catch (error) {
      console.error("Full error:", {
        status: error.response?.status,
        data: error.response?.data,
        config: error.config // Shows the exact request sent
      });

      // Rollback
      setProjects(prev => prev.filter(item => item._id !== tempId));

      setErrors({
        submit: error.response?.data?.error ||
          `Server error (${error.response?.status || 'no response'})`
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitWorkHistory = async (e) => {
    e.preventDefault();
    if (!validateWorkHistoryForm()) return;

     // Double check we're in admin mode (client-side protection)
     if (process.env.REACT_APP_IS_ADMIN !== 'true') {
      setErrors({ submit: "Admin access required" });
      return;
    }

    setIsSubmitting(true);
    const tempId = Date.now().toString();

    try {
      // Optimistic update
      setWorks((prev) => [
        ...prev,
        {
          _id: tempId,
          workHistory: formWorkHistoryData.workHistory.trim(), // Added trim()
          createdAt: new Date().toISOString(),
          isOptimistic: true,
        },
      ]);


      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/workhistories`,
        {
          workHistory: formWorkHistoryData.workHistory.trim(),

        },
        {
          params: {
            secret: process.env.REACT_APP_ADMIN_SECRET
          },
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      // More robust response handling
      setWorks((prev) =>
        prev.map((item) =>
          item._id === tempId
            ? {
              ...response.data,
              _id: response.data._id || tempId,
              workHistory: response.data.workHistory || item.workHistory,
              createdAt: response.data.createdAt || item.createdAt,
            }
            : item
        )
      );

      setFormWorkHistoryData({ workHistory: "" });
      setErrors({});
    } catch (error) {
      console.error("Submission error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });

      setWorks((prev) => prev.filter((item) => item._id !== tempId));
      setErrors({
        submit:
          error.response?.data?.error?.message ||
          error.response?.data?.message ||
          "Failed to add work history. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitCertificates = async (e) => {
    e.preventDefault();
    if (!validateCertificateForm()) return;

    // Double check we're in admin mode (client-side protection)
    if (process.env.REACT_APP_IS_ADMIN !== 'true') {
      setErrors({ submit: "Admin access required" });
      return;
    }

    setIsSubmitting(true);
    const tempId = Date.now().toString();
    const trimmedCertificateName = formCertificatesData.certificateName.trim();

    try {
      // Optimistic update
      setCertificatesName((prev) => [
        ...prev,
        {
          _id: tempId,
          certificateName: trimmedCertificateName,
          // Match server response
          status: "approved",
          createdAt: new Date().toISOString(),
          isOptimistic: true,
        },
      ]);

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/certificates`,
        {
          certificateName: trimmedCertificateName,
          status: "approved",
        },
        {
          params: {
            secret: process.env.REACT_APP_ADMIN_SECRET,
          },
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      // Replace optimistic update with server response
      setCertificatesName((prev) =>
        prev.map((item) =>
          item._id === tempId
            ? {
              ...response.data,
              // Fallback to tempId
              _id: response.data._id || tempId,
              // Ensure createdAt exists in response or keep optimistic date
              createdAt: response.data.createdAt || item.createdAt,
              // Remove optimistic flag
              isOptimistic: undefined,
            }
            : item
        )
      );

      setFormCertificatesData({ certificateName: "" });
      setErrors({});

      // Optional: Show success message
      // toast.success("Certificate added successfully");
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);

      // Rollback optimistic update
      setCertificatesName((prev) => prev.filter((item) => item._id !== tempId));

      // Enhanced error handling
      const errorMessage =
        error.response?.data?.error ||
        (error.response?.status === 409
          ? "Certificate already exists"
          : "Failed to add certificate");

      setErrors({ submit: errorMessage });

      // Optional: Show error message
      // toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitCompany = async (e) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateCompaniesForm()) return;

    // Double check we're in admin mode (client-side protection)
    if (process.env.REACT_APP_IS_ADMIN !== 'true') {
      setErrors({ submit: "Admin access required" });
      return;
    }

    setIsSubmitting(true);
    const tempId = Date.now().toString();
    const trimmedCompanyName = formCompaniesData.companyName.trim();

    try {
      // Optimistic UI update
      setCompaniesName((prev) => [
        ...prev,
        {
          _id: tempId,
          companyName: trimmedCompanyName,
          status: "approved",
          createdAt: new Date().toISOString(),
          isOptimistic: true,
        },
      ]);

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/companies`,
        { companyName: trimmedCompanyName },
        {
          params: {
            secret: process.env.REACT_APP_ADMIN_SECRET
          },
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      // Replace optimistic update with server data
      setCompaniesName((prev) =>
        prev.map((item) =>
          item._id === tempId ? {
            ...response.data,
            _id: response.data._id || tempId,
            createdAt: response.data.createdAt || item.createdAt,
            isOptimistic: undefined,
          } : item
        )
      );

      // Reset form
      setFormCompaniesData({ companyName: "" });
      setErrors({});

    } catch (error) {
      console.error("Submission error:", error);
      // Rollback optimistic update
      setCompaniesName((prev) => prev.filter((item) => item._id !== tempId));

      // Enhanced error handling
      const errorMessage = error.response?.data?.error ||
        (error.response?.status === 403 ? "Admin access denied" :
          error.response?.status === 409 ? "Company already exists" :
            "Failed to add company");

      setErrors({ submit: errorMessage });

    } finally {
      setIsSubmitting(false);
    }
  };


  // Approvals
  const approveProject = async (projectId) => {
    setApprovingId(projectId);
    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_API_URL}/projects/${projectId}/approve`,
        {},
        {
          params: { secret: process.env.REACT_APP_ADMIN_SECRET },
          headers: { "Content-Type": "application/json" },
        }
      );

      // Update local state with server response
      setProjects((prev) =>
        prev.map((pro) =>
          pro._id === projectId
            ? // Use server response
            { ...response.data }
            : pro
        )
      );
    } catch (error) {
      console.error("Approval failed:", error);
      setErrors(error.response?.data?.error || "Failed to approve project");
      // Consider adding a toast notification:
      // toast.error(error.response?.data?.error || "Approval failed");
    } finally {
      setApprovingId(null);
    }
  };

  const approveCompanyWorked = async (companyId) => {
    setApprovingId(companyId);
    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_API_URL}/companies/${companyId}/approve`,
        {},
        {
          params: { secret: process.env.REACT_APP_ADMIN_SECRET },
          headers: { "Content-Type": "application/json" },
        }
      );

      // Update local state with server response
      setCompaniesName((prev) =>
        prev.map((comp) =>
          comp._id === companyId
            ? // Use server response
            { ...response.data }
            : comp
        )
      );
    } catch (error) {
      console.error("Approval failed:", error);
      setErrors(error.response?.data?.error || "Failed to approve project");
      // Consider adding a toast notification:
      // toast.error(error.response?.data?.error || "Approval failed");
    } finally {
      setApprovingId(null);
    }
  };

  const approveCertificate = async (certificateId) => {
    setApprovingId(certificateId);
    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_API_URL}/certificates/${certificateId}/approve`,
        {},
        {
          params: { secret: process.env.REACT_APP_ADMIN_SECRET },
          headers: { "Content-Type": "application/json" },
        }
      );

      // Update local state with server response
      setCertificatesName((prev) =>
        prev.map((cert) =>
          cert._id === certificateId
            ? { ...response.data } // Use server response
            : cert
        )
      );
    } catch (error) {
      console.error("Approval failed:", error);
      setErrors(error.response?.data?.error || "Failed to approve certificate");
      // Consider adding a toast notification:
      // toast.error(error.response?.data?.error || "Approval failed");
    } finally {
      setApprovingId(null);
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      setErrors({});

      try {
        // Configure default axios settings
        const apiClient = axios.create({
          baseURL: process.env.REACT_APP_API_URL,
          withCredentials: true,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          timeout: 10000 // 10 second timeout
        });

        // Parallel API calls with better error isolation
        const requests = {
          projects: apiClient.get('/projects'),
          workHistory: apiClient.get('/workhistories'),
          certificates: apiClient.get('/certificates'),
          companies: apiClient.get('/companies')
        };

        const responses = await Promise.allSettled(Object.values(requests));

        // Process responses
        const result = {
          projects: responses[0].status === 'fulfilled' ? responses[0].value.data : null,
          workHistory: responses[1].status === 'fulfilled' ? responses[1].value.data : null,
          certificates: responses[2].status === 'fulfilled' ? responses[2].value.data : null,
          companies: responses[3].status === 'fulfilled' ? responses[3].value.data : null
        };

        // Set states with fallbacks
        setProjects(result.projects?.data || result.projects || []);
        setWorks(result.workHistory?.data || result.workHistory || []);
        setCertificatesName(result.certificates?.data || result.certificates || []);
        setCompaniesName(result.companies?.data || result.companies || []);

        // Update counts
        setCounts({
          projects: result.projects?.length || 0,
          certificates: result.certificates?.length || 0,
          companies: result.companies?.length || 0,
          experiences: result.workHistory?.length || 0,
        });

        // Set individual errors if any requests failed
        const errorState = {};
        Object.keys(requests).forEach((key, index) => {
          if (responses[index].status === 'rejected') {
            const error = responses[index].reason;
            errorState[key] = error.response?.status === 404
              ? `${key} not found`
              : `Failed to load ${key}`;
            console.error(`API Error (${key}):`, error);
          }
        });

        if (Object.keys(errorState).length > 0) {
          setErrors(errorState);
        }

      } catch (error) {
        console.error("Unexpected Error:", error);
        setErrors({ general: "An unexpected error occurred" });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, []);

  return (
    <section id="about" className="section-emphasis">
      {/* ... other existing code ... */}
      <h5>Get To Know</h5>
      <h2>About Me</h2>

      <div className="container about__container">
        {/* About Me Image Section */}
        <div className="about__me">
          <div className="about__me-image">
            <img src={ME} alt="About Images" />
          </div>
        </div>

        {/* About Content Section */}
        <div className="about__content">
          <div className="about__cards">
            {/* Experience */}
            <article
              className="about__card"
              onClick={() => handleOpenPopup("experience")}
            >
              <FaAward className="about__icon" />
              <h5>Experience</h5>
              <small>0-{counts.experiences} Years Working</small>
            </article>

            {/* Projects */}
            <article
              className="about__card"
              onClick={() => handleOpenPopup("projects")}
            >
              <FaFolder className="about__icon" />
              <h5>Projects</h5>
              <small>{counts.projects}+ Completed</small>
            </article>

            {/* Companies Worked */}
            <article
              className="about__card"
              onClick={() => handleOpenPopup("companies")}
            >
              <FaBriefcase className="about__icon" />
              <h5>Companies</h5>
              <small>{counts.companies}+</small>
            </article>

            {/* Completed Certificates */}
            <article
              className="about__card"
              onClick={() => handleOpenPopup("certificates")}
            >
              <FaCertificate className="about__icon" />
              <h5>Certificate</h5>
              <small>{counts.certificates}+ Completed</small>
            </article>
          </div>

          <p>
            Highly skilled in frontend programming, with a proven track record
            of delivering top-notch work and creating intuitive, user-friendly
            interfaces.
          </p>
          <a href="https://wa.me/27609440410" className="btn">
            Let's Talk
          </a>
        </div>
      </div>

      {/* Popup Box */}
      <div className={`about__popup ${popup ? "active" : ""}`}>
        <div className="about__popup-content">
          <span className="close__about-popup" onClick={handleClosePopup}>
            &times;
          </span>
          {popup === "experience" && (
            <>
              {process.env.REACT_APP_IS_ADMIN === 'true' && (
                <>
                  <h1>Add a New Work Experience</h1>
                  <form onSubmit={handleSubmitWorkHistory} className="form-details">
                    <div className="form-group">
                      <input
                        id="workHistory"
                        type="text"
                        name="workHistory"
                        placeholder="Enter work history"
                        value={formWorkHistoryData.workHistory}
                        onChange={handleChangeWorkHistory}
                        className={errors.workHistory ? "error" : ""}
                      />
                      {errors.workHistory && (
                        <span className="error-message">{errors.workHistory}</span>
                      )}
                    </div>
                    {errors.submit && (
                      <div className="error-message">{errors.submit}</div>
                    )}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn btn-primary"
                    >
                      {isSubmitting ? "Submitting..." : "Add"}
                    </button>
                  </form>
                </>
              )}

              <h1>My Experience</h1>
              {/* My Experience list */}
              {isLoading ? (
                <p className="loading">Retrieving work history...</p>
              ) : works.length === 0 ? (
                <p className="loading">
                  Currently, there’s no work experience listed. Add your first
                  entry to get started.
                </p>
              ) : (
                <ul>
                  {works.map((work) => (
                    <li key={work._id || work.createdAt}>
                      {work.workHistory}{" "}
                      <p>
                        {new Date(work.createdAt).toLocaleDateString(
                          "en-ZA",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
          {popup === "projects" && (
            <>
              {process.env.REACT_APP_IS_ADMIN === 'true' && (

                <>
                  <h1>Add New Project</h1>
                  <form onSubmit={handleSubmitProject} className="form-details">
                    <div className="form-group">
                      <input
                        id="projectName"
                        type="text"
                        name="projectName"
                        placeholder="Project Name"
                        value={formProjectData.projectName}
                        onChange={handleChangeProjects}
                        className={errors.projectName ? "error" : ""}
                      />
                      {errors.projectName && (
                        <span className="error-message">{errors.projectName}</span>
                      )}
                    </div>
                    {errors.submit && (
                      <div className="error-message">{errors.submit}</div>
                    )}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn btn-primary"
                    >
                      {isSubmitting ? "Adding..." : "Add"}
                    </button>
                  </form>
                </>
              )}

              <h1>Projects I Completed</h1>
              {/*  List of Project I've completed */}
              {isLoading ? (
                <p className="loading">Retrieving projects...</p>
              ) : projects.length === 0 ? (
                <p className="loading">
                  Your project list is empty. Time to create your first project.
                </p>
              ) : (
                <div className="details-list">
                  {projects.map((project) => (
                    <div key={project._id || project.createdAt} className="details-item">
                      <div className="details-info">
                        <h3>{project.projectName}</h3>

                      </div>

                      <div className="status-column">
                        <div className="status-section">
                          <span className={`status-badge ${project.status}`}>
                            {project.status}
                          </span>
                          {project.status === "pending" && (
                            <button
                              className="btn-approve"
                              onClick={() => approveProject(project._id)}
                              disabled={approvingId === project._id}
                            >
                              {approvingId === project._id ? "Approving..." : "Approve"}
                            </button>
                          )}
                        </div>
                        <p className="createdAt-date">
                          {new Date(project.createdAt).toLocaleDateString("en-ZA", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
          {popup === "companies" && (
            <>
              {/* Only show form in admin mode */}
              {process.env.REACT_APP_IS_ADMIN === 'true' && (
                <>
                  <h1>Add New Company You Worked</h1>
                  <form onSubmit={handleSubmitCompany} className="form-details">
                    <div className="form-group">
                      <input
                        id="companyName"
                        type="text"
                        name="companyName"
                        placeholder="Enter Company Name"
                        value={formCompaniesData.companyName}
                        onChange={handleChangeCompanies}
                        className={errors.companyName ? "error" : ""}
                      />
                      {errors.companyName && (
                        <span className="error-message">{errors.companyName}</span>
                      )}
                    </div>
                    {errors.submit && (
                      <div className="error-message">{errors.submit}</div>
                    )}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn btn-primary"
                    >
                      {isSubmitting ? "Submitting..." : "Add"}
                    </button>
                  </form>
                </>
              )}

              <h1>Companies I've Worked With</h1>
              {/* Certificates list */}
              {isLoading ? (
                <p className="loading">Retrieving company names...</p>
              ) : companiesName.length === 0 ? (
                <p className="loading">
                  {" "}
                  Currently, no companies are displayed. You can add your first
                  one to begin.{" "}
                </p>
              ) : (
                <div className="details-list">
                  {companiesName.map((company) => (
                    <div key={company._id || company.createdAt} className="details-item">
                      <div className="details-info">
                        <h3>{company.companyName}</h3>

                      </div>

                      <div className="status-column">
                        <div className="status-section">
                          <span className={`status-badge ${company.status}`}>
                            {company.status}
                          </span>
                          {handleSubmitCompany.status === "pending" && (
                            <button
                              className="btn-approve"
                              onClick={() => approveCompanyWorked(company._id)}
                              disabled={approvingId === company._id}
                            >
                              {approvingId === company._id ? "Approving..." : "Approve"}
                            </button>
                          )}
                        </div>
                        <p className="createdAt-date">
                          {new Date(company.createdAt).toLocaleDateString("en-ZA", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
          {popup === "certificates" && (
            <>
              {/* Only show form in admin mode */}
              {process.env.REACT_APP_IS_ADMIN === 'true' && (
                <>
                  <h1>Add New Certificates</h1>
                  <form
                    onSubmit={handleSubmitCertificates}
                    className="form-details"
                  >
                    <div className="form-group">
                      <input
                        id="certificateName"
                        type="text"
                        name="certificateName"
                        placeholder="Enter Certificate Name"
                        value={formCertificatesData.certificateName}
                        onChange={handleChangeCertificate}
                        className={errors.certificateName ? "error" : ""}
                      />
                      {errors.certificateName && (
                        <span className="error-message">
                          {errors.certificateName}
                        </span>
                      )}
                    </div>
                    {errors.submit && (
                      <div className="error-message">{errors.submit}</div>
                    )}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn btn-primary"
                    >
                      {isSubmitting ? "Submitting..." : "Add"}
                    </button>
                  </form>
                </>
              )}


              <h1>My Certificates</h1>
              {/*  List of Certificates I've completed */}
              {isLoading ? (
                <p className="loading">Retrieving certificate names...</p>
              ) : certificatesName.length === 0 ? (
                <p className="loading">
                  Currently, no certificates are displayed. You can add your
                  first one to begin.
                </p>
              ) : (

                <div className="details-list">
                  {certificatesName.map((certificate) => (
                    <div key={certificate._id || certificate.createdAt} className="details-item">
                      <div className="details-info">
                        <h3>{certificate.certificateName}</h3>
                      </div>

                      <div className="status-column">
                        <div className="status-section">
                          <span className={`status-badge ${certificate.status}`}>
                            {certificate.status}
                          </span>
                          {handleSubmitCertificates.status === "pending" && (
                            <button
                              className="btn-approve"
                              onClick={() => approveCertificate(certificate._id)}
                              disabled={approvingId === certificate._id}
                            >
                              {approvingId === certificate._id ? "Approving..." : "Approve"}
                            </button>
                          )}
                        </div>
                        <p className="createdAt-date">
                          {new Date(certificate.createdAt).toLocaleDateString("en-ZA", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default About;
