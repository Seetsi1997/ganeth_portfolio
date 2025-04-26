import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaBriefcase, FaCalendarAlt, FaGraduationCap } from 'react-icons/fa';
import './qualification.css';

const Qualification = () => {
    const [activeTab, setActiveTab] = useState('education');
    const [popupData, setPopupData] = useState(null);
    const [educationData, setEducationData] = useState([]);
    const [workData, setWorkData] = useState([]);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchEducationData = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/educations`);
                if (response.data.success) {
                    setEducationData(response.data.data || []);
                }
                // Clear any previous errors
                setErrors(prev => ({ ...prev, education: null }));
            } catch (error) {
                if (error.response?.status === 404) {
                    // 404 means endpoint exists but no data - not a true error
                    setEducationData([]);
                } else {
                    // Real network/server errors
                    console.error("Education fetch error:", error);
                    setErrors(prev => ({ ...prev, education: "Failed to load education data" }));
                }

            } finally {
                setIsLoading(false);
            }
        };

        const fetchWorkData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/works`);

                // Successful request
                // const data = response.data.data || [];
                // setWorkData(data);
                if (response.data.success) {
                    setWorkData(response.data.data || []);
                }
                // Clear any previous errors
                setErrors(prev => ({ ...prev, work: null }));

            } catch (error) {
                if (error.response?.status === 404) {
                    // 404 means endpoint exists but no data - not a true error
                    setWorkData([]);
                } else {
                    // Real network/server errors
                    setErrors(prev => ({ ...prev, work: "Failed to load work experience" }));
                }
            } finally {
                setIsLoading(false);
            }
        };
        fetchEducationData();
        fetchWorkData();
    }, []);

    const handleItemClick = (item) => {
        setPopupData({
            ...item,
            calendar: item.startDate ?
                `${new Date(item.startDate).getFullYear()} - ${item.endDate === 'Present' ?
                    'Present' : new Date(item.endDate).getFullYear()}`
                : 'N/A'
        });
    };

    const closePopup = () => {
        setPopupData(null);
    };

    const renderQuaExpContent = () => {
        // Safely get the data for current tab
        const displayedData = activeTab === 'education' ? educationData : workData;
        const hasData = displayedData && displayedData.length > 0;
        const tabError = errors[activeTab];

        // Handle loading state (only when no data exists yet)
        if (isLoading && !educationData.length && !workData.length) {
            return <div className="qualification__loading">Loading data...</div>;
        }

        // Handle errors - check for specific tab error first
        if (tabError) {
            return <div className="qualification__error">{tabError}</div>;
        }

        // Handle case where both datasets are empty
        if (!educationData.length && !workData.length) {
            return <div className="error-not-found">No records found.</div>;
        }

        // Handle case where current tab has no data
        if (!hasData) {
            return (
                <div className="no-records-message">
                    {activeTab === 'education' ? 'No education records found' : 'No work records found'}
                </div>
            );
        }

        // Render the timeline (simplified with shared logic)
        return (
            <div className="qualification__timeline">
                {displayedData.map((item, index) => (
                    <div
                        key={item._id || index}
                        className="qualification__item"
                        onClick={() => handleItemClick(item)}
                    >
                        <div className="qualification__dot"></div>
                        <div className={`qualification__content ${index % 2 === 0 ? 'left' : 'right'}`}>
                            <div className="qualification__connector"></div>
                            <h3>
                                {activeTab === 'education'
                                    ? item.schoolName || item.title || 'No title'
                                    : item.companyName || 'No company name'
                                }
                            </h3>
                            <p>
                                {activeTab === 'education'
                                    ? item.qualification || item.subtitle || ''
                                    : item.position || ''
                                }
                            </p>
                            <span className="qualification__meta">
                                <span className="qualification__calendar">
                                    <FaCalendarAlt />
                                    {item.startDate
                                        ? `${new Date(item.startDate).getFullYear()} - ${activeTab === 'work' && item.currentlyWorking
                                            ? 'Present'
                                            : new Date(item.endDate).getFullYear()
                                        }`
                                        : 'N/A'
                                    }
                                </span>
                                <span className="qualification__separator">•</span>
                                <span className="work-type-tag">
                                    {activeTab === 'education'
                                        ? item.institutionType
                                        : item.employmentType
                                    }
                                </span>
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <section id="qualification" className="qualification">
            <h5>My personal journey</h5>
            <h2>My Qualifications</h2>
            {/*Tabbar Different Buttons */}
            <div className="qualification__tabs">
                <button
                    className={activeTab === 'education' ? 'active' : ''}
                    onClick={() => setActiveTab('education')}
                >
                    <FaGraduationCap /> Education
                </button>
                <button
                    className={activeTab === 'work' ? 'active' : ''}
                    onClick={() => setActiveTab('work')}
                >
                    <FaBriefcase /> Work
                </button>
            </div>

            {renderQuaExpContent()}
            {/*Popup */}
            {popupData && (
                <div className="qualification__popup active">
                    <div className="qualification__popup__content">
                        <span className="close__about-popup" onClick={closePopup}>
                            &times;
                        </span>

                        {activeTab === 'education' ? (
                            <>
                                {/*Performance */}
                                <div className="popup-header">
                                    <h1>Performance</h1>
                                    <p className="qualification-type">
                                        {popupData.schoolName}
                                    </p>
                                </div>
                                {/*Performance I Managed through My Educations */}
                                <div className="performance-summary">
                                    <div className="performance-grid">
                                        <div className="performance-item">
                                            <span className="performance-label">Period</span>
                                            <span className="performance-value">{popupData.calendar || 'N/A'}</span>
                                        </div>
                                        <div className="performance-item highlight">
                                            <span className="performance-label">Highest</span>
                                            <span className="performance-value">{popupData.highest || 'N/A'}</span>
                                        </div>
                                        <div className="performance-item">
                                            <span className="performance-label">Lowest</span>
                                            <span className="performance-value">{popupData.lowest || 'N/A'}</span>
                                        </div>
                                        <div className={`performance-item ${!popupData.failMessage?.includes('Failed') ? 'success' : 'warning'}`}>
                                            <span className="performance-label">Performance</span>
                                            <span className="performance-value">
                                                {popupData.failMessage || 'No data'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                {/*Modules I Did */}
                                <div className="modules-section">
                                    <h3>All Subjects</h3>
                                    <ul className="modules-list">
                                        {popupData.modules?.length > 0 ? (
                                            popupData.modules.map((module, index) => {
                                                const isFailed = (popupData.institutionType === 'highSchool' && module.percent < 30) ||
                                                    (popupData.institutionType === 'university' && module.percent < 50);

                                                return (
                                                    <li key={index} className={isFailed ? 'module-failed' : 'module-passed'}>
                                                        <span className="module-name">{module.name}</span>
                                                        <span className="module-status">
                                                            {isFailed ? (
                                                                <span className="status-badge failed">Failed</span>
                                                            ) : (
                                                                <span className="status-badge passed">Passed</span>
                                                            )}
                                                        </span>
                                                    </li>
                                                );
                                            })
                                        ) : (
                                            <li className="no-modules">No subjects information available</li>
                                        )}
                                    </ul>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="popup-header">
                                    <h1>{popupData.companyName}</h1>
                                    <p className="work-position">{popupData.position}</p>
                                </div>
                                {/*Work Details */}
                                <div className="work-details-summary">
                                    <div className="detail-grid">
                                        <div className="detail-item">
                                            <span className="detail-label">Period</span>
                                            <span className="detail-value">{popupData.employmentPeriod}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Duration</span>
                                            <span className="detail-value">{popupData.duration}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Type</span>
                                            <span className="detail-value">{popupData.employmentType}</span>
                                        </div>
                                        <div className="detail-item highlight">
                                            <span className="detail-label">Primary Skill</span>
                                            <span className="detail-value">{popupData.primarySkill}</span>
                                        </div>
                                    </div>
                                </div>

                                {popupData.description && (
                                    <div className="work-description-section">
                                        <h3>Role Description</h3>
                                        <ul className='work-description-list'>
                                           <li>{popupData.description}</li>
                                        </ul>
                                    </div>
                                )}
                                {/*Achievements coming */}
                                <div className="achievement-section">
                                    <h3>Achievements</h3>
                                   {/*<p className="proficiency-summary">Achievements</p>*/}
                                    <ul className="achievement-list">
                                        {popupData.achievements?.map((achievement, index) => (
                                            <li key={index} className={`achievement-item ${achievement.proficiency}`}>
                                                <span className="achievement-name">{achievement.name}</span>
                                                {achievement.proficiency && (
                                                    <span className="achievement-level">({achievement.proficiency})</span>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                {/*Skills */}
                                <div className="skills-section">
                                    <h3>Skills Gained (<span>{popupData.skillCount}</span>)</h3>
                                    <p className="proficiency-summary">{popupData.proficiencySummary}</p>
                                    <ul className="skills-list">
                                        {popupData.skills?.map((skill, index) => (
                                            <li key={index} className={`skill-item ${skill.proficiency}`}>
                                                <span className="skill-name">{skill.name} -</span>
                                                <span className="skill-level">({skill.proficiency})</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/*Employer Details */}
                                <div className="employee-section">
                                    <h3>Details of Employee (<span>{popupData.referenceContact?.name || "N/A"}</span>)</h3>
                                    <p className="proficiency-summary">Reference Contact Details</p>

                                    <ul className="skills-list reference-contacts">
                                        <li className="skill-item reference-contact-item">
                                            <div className="reference-detail">
                                                <span className="reference-position">
                                                    {popupData.referenceContact?.position || "Position not provided"}
                                                </span>
                                            </div>
                                            <div className="reference-contact">
                                                <div className="contact-item">
                                                    <div className="contact-label">Email</div>
                                                    <div className="contact-value">
                                                        {popupData.referenceContact?.email || "Not provided"}
                                                    </div>
                                                </div>
                                                <div className="contact-item">
                                                    <div className="contact-label">Phone</div>
                                                    <div className="contact-value">
                                                        {popupData.referenceContact?.phone || "Not provided"}
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </section>
    );
};

export default Qualification;