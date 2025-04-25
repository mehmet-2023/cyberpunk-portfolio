import React from 'react';
import './ProjectPopup.css';

const ProjectPopup = ({ project, onClose }) => {
  return (
    <div className="popup-overlay">
      <div className="popup-content" style={{ borderColor: project.neonColor }}>
        <div className="popup-header">
          <h2 style={{ color: project.neonColor }}>{project.name}</h2>
          <div className="neon-line" style={{ backgroundColor: project.neonColor }} />
        </div>

        <img src={project.image} alt={project.name} className="popup-image" />

        <p>{project.description}</p>

        <a href={project.link} target="_blank" rel="noopener noreferrer" className="popup-link">
          Visit Project
        </a>

        <button onClick={onClose} className="popup-close-btn">
          Close
        </button>
      </div>
    </div>
  );
};

export default ProjectPopup;
