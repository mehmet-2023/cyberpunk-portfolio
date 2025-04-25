import React, { useState } from 'react';
import './ProjectGallery.css';

const projects = [
  {
    name: "Faster",
    image: "/textures/road.jpg",
    description: "Reflex and color perception-based mobile game.",
    link: "https://example.com/faster",
    neonColor: "#FFD15D", 
  },
  {
    name: "Robot Simulator",
    image: "/textures/road.jpg",
    description: "A web-based robot simulation platform.",
    link: "https://example.com/robot_simulator",
    neonColor: "#8DCC70",
  },
];

const ProjectGallery = ({ onProjectClick }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div className="project-gallery">
      {projects.map((project, index) => (
        <div
          key={index}
          className="project-card"
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          onClick={() => onProjectClick(project)}
          style={{
            borderColor: project.neonColor,
          }}
        >
          <img src={project.image} alt={project.name} className="project-image" />
          {hoveredIndex === index && (
            <div className="project-name" style={{ color: project.neonColor }}>
              {project.name}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProjectGallery;
