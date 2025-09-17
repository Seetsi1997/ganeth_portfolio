import React, { useState } from 'react';
import { FaChevronDown } from "react-icons/fa";
import './skills.css';

const Skills = () => {
  const [openSkill, setOpenSkill] = useState(null);

  const toggleSkill = (index) => {
    setOpenSkill(openSkill === index ? null : index);
  };

  const skillsData = [
    {
      title: 'Frontend',
      subtitle: 'More than 0-1 years',
      skills: [
        { name: 'HTML', percentage: 80 },
        { name: 'CSS', percentage: 70 },
        { name: 'JavaScript', percentage: 25 },
        { name: 'Flutter', percentage: 60 },
        {name: 'Angular', percentage: 50},
      ],
    },
    {
      title: 'Backend',
      subtitle: 'More than 0-1 years',
      skills: [
        { name: 'ASP-NET', percentage: 35 },
        { name: 'Dart', percentage: 35 },
        { name: 'Java', percentage: 25 },
        {name: 'Spring Boot', percentage: 45},
      ],
    },
    {
      title: 'Database',
      subtitle: 'More than 0-6 months',
      skills: [
        { name: 'Backendless', percentage: 25 },
        { name: 'Firebase', percentage: 25 },
        { name: 'SQL', percentage: 50 },
        { name: 'MongoDB', percentage: 10 },
        { name: 'PostgreSQL', percentage:  55},
      ],
    },
  ];

  return (
    <section id="skills" className='section-emphasis skills'>
       <h5>Explore my technical level of experience</h5>
       <h2>Skills</h2>
       
      
      <div className="skills__container container">
        {skillsData.map((skill, index) => (
          <div key={index}>
            <div
              className={`skills__content ${openSkill === index ? 'skills__open' : 'skills__close'}`}
            >
              <div className="skills__header" onClick={() => toggleSkill(index)}>
                <div>
                  <h1 className="skills__title">{skill.title}</h1>
                  <span className="skills__subtitle">{skill.subtitle}</span> 
                </div>
                <FaChevronDown className="skills__arrow" />
              </div>

              <div className="skills__list grid">
                {skill.skills.map((item, i) => (
                  <div key={i} className="skills__data">
                    <div className="skills__titles">
                      <h3 className="skills__name">{item.name}</h3>
                      <span className="skills__number">{item.percentage}%</span>
                    </div>
                    <div className="skills__bar">
                      <span
                        className={`skills__percentage skills__${item.name.toLowerCase()}`}
                        style={{ width: `${item.percentage}%` }}
                      ></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Skills;
