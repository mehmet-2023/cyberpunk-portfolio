import React, { useState, useEffect, useRef, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Stats, FlyControls } from "@react-three/drei";
import CityScene from "./components/CityScene";
import LoadingScreen from "./components/LoadingScreen";
import MessageOverlay from "./components/MessageOverlay";
import "./App.css";
import "./Projects.css";

const messages = [
  { text: "Embeded System Developer", time: 1, duration: 4 },
  { text: "RVC/AI Enjoyer", time: 6, duration: 4 },
  { text: "Web Developer", time: 11, duration: 4 },
  { text: "IT Specialist", time: 16, duration: 4 },
  { text: "Welcome to my portfolio.", time: 21, duration: 5 },
];

const tutorialSteps = [
  { text: "Use W / A / S / D / R / F to move around 🕹️", time: 1, duration: 4 },
  {
    text: "move the mouse to look around and click left / right to zoom 👀",
    time: 6,
    duration: 5,
  },
  { text: "Use Q/E to roll", time: 12, duration: 4 },
  {
    text: "Explore freely and discover hidden details!",
    time: 17,
    duration: 5,
  },
];

const projects = [
  {
    title: "Faster",
    imageUrl: "/images/faster.png",
    description:
      "Faster: How fast are you? is an original game idea that has no other examples. The simple goal of the game is to click on a color other than the specified color. Since the game is fun and challenging to play, it has left a positive impact on users and the project continues.",
    link: "https://fasterapp.vercel.app",
    color: "#FFD15D",
    category: "Games",
    featured: true
  },
  {
    title: "TheNest",
    imageUrl: "/images/thenest.png",
    description:
      "The Nest is a multipurpose website aimed at all STEAM-related communities and individuals. It aims to increase communication and connections between STEAM enthusiasts while also creating a platform that offers resources and education.",
    link: "https://the-nest.com.tr",
    color: "#2323FF",
    category: "Websites",
    featured: true
  },
  {
    title: "NatrueGO",
    imageUrl: "/images/naturego.png",
    description:
      "NatureGO is a mobile application designed to bring users closer to nature while fostering online community engagement. Using the phone's camera, users can scan flowers, which are then converted into credits for various features in the app. The app integrates AI to facilitate safe content interaction, ensuring an enjoyable experience for everyone.",
    link: "https://github.com/mehmet-2023/NatureGO",
    color: "#2cff05",
    category: "Mobile Apps",
    featured: true
  },
  {
    title: "CTF (Coding The Future)",
    imageUrl: "/images/ctf.jpg",
    description:
      "A platform where thinkers share program ideas and software developers collaborate to turn them into reality. The project was successfully adapted but not continued.",
    link: "#",
    color: "#C57175",
    category: "Websites",
    featured: false
  },
  {
    title: "MakineAvcıları",
    imageUrl: "/images/makine_avcilari.jpg",
    description:
      "Mobile app version of a board game project that gamifies the subject of simple machines. Semi-finalist at Teknofest 2023.",
    link: "",
    color: "#808080",
    category: "Mobile Apps",
    featured: false
  },
  {
    title: "ROMANIA 14TH ROBOCHALLENGE",
    imageUrl: "/images/robochallange.jpeg",
    description:
      "Competed in the 14th RoboChallange in Romania with three robots in the Mini sumo category, achieving 9th place worldwide.",
    link: "https://www.bilokullari.com.tr/bahcelievler-bil-koleji/basari/uluslararasi-robochallenge-yarismasi-549",
    color: "#8a00c4",
    category: "Robotics",
    featured: true
  },
  {
    title: "2024 ROBOT - CRESCENDO SEASON",
    imageUrl: "/images/2024.png",
    description:
      "Competed in Cezeri Başakşehir Off-Season with the 76111 2024 Robot, winning the Team Spirit and Dean's List awards.",
    link: "https://www.thebluealliance.com/team/7611/2024",
    color: "#ff8800",
    category: "Robotics",
    featured: false
  },
  {
    title: "ICEBERG - REEFSCAPE SEASON",
    imageUrl: "/images/iceberg.jpg",
    description:
      "Participated in Istanbul Bosphorus and South Florida Regional events with the 2025 Robot, reaching semi-finals in Bosphorus (3rd place) and achieving 17.3 EPA in South Florida.",
    link: "https://www.thebluealliance.com/team/7611/2025",
    color: "#33dac6",
    category: "Robotics",
    featured: false
  },
];

export default function App() {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [ready, setReady] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showFinalBox, setShowFinalBox] = useState(false);
  const [showPopup, setShowPopup] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const audioRef = useRef(null);
  const finalbox_shown = useRef(false);
  const [exploreMode, setExploreMode] = useState(false);
  const finalShown = useRef(false);
  const cameraRef = useRef();
  const [tutorialIndex, setTutorialIndex] = useState(0);
  const [showTutorial, setShowTutorial] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!ready || exploreMode) return;
    const interval = setInterval(() => setElapsed((prev) => prev + 0.1), 100);
    return () => clearInterval(interval);
  }, [ready, exploreMode]);

  useEffect(() => {
    if (!showTutorial || tutorialIndex >= tutorialSteps.length) return;
    const currentStep = tutorialSteps[tutorialIndex];
    const timer = setTimeout(() => {
      setTutorialIndex((prev) => prev + 1);
    }, currentStep.duration * 1000);
    return () => clearTimeout(timer);
  }, [tutorialIndex, showTutorial]);

  useEffect(() => {
    if (!ready || exploreMode) return;
    const idx = messages.findIndex(
      (m) => elapsed >= m.time && elapsed <= m.time + m.duration
    );
    setCurrentMessageIndex(idx !== -1 ? idx : null);
    const last = messages[messages.length - 1];
    if (
      elapsed > last.time + last.duration + 1 &&
      !showFinalBox &&
      !finalShown.current
    ) {
      setShowFinalBox(true);
      finalShown.current = true;
    }
  }, [elapsed, ready, exploreMode]);

  const handleInteraction = () => {
    if (audioRef.current && !hasInteracted) {
      audioRef.current.volume = 0.2;
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn("Autoplay failed:", err);
        });
      }
      setHasInteracted(true);
      setReady(true);
    }
  };

  const handleProjectClick = (project) => {
    setShowPopup(project);
    setShowFinalBox(false);
  };

  const closePopup = () => {
    setShowPopup(null);
    setShowFinalBox(true);
  };

  const getGridColumns = () => {
    if (isMobile) return "1fr";
    const projectCount = projects.length;
    if (projectCount <= 2) return "repeat(2, 1fr)";
    if (projectCount <= 6) return "repeat(3, 1fr)";
    return "repeat(4, 1fr)";
  };

  const startExploration = () => {
    setShowFinalBox(false);
    setExploreMode(true);
  };

  const reopenFinalBox = () => {
    if (cameraRef.current) {
      cameraRef.current.position.set(9, 4, 3);
      cameraRef.current.lookAt(0, 0, 0);
    }
    setExploreMode(false);
    setShowTutorial(false);
    setTutorialIndex(0);
    setShowFinalBox(true);
  };

  const startTutorial = () => {
    startExploration();
    setShowTutorial(true);
    setTutorialIndex(0);
  };

  return (
    <div className="app-container">
      <audio ref={audioRef} src="/no_diggity.mp3" preload="auto" loop />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
      />
      
      {!ready && (
        <div className="start-screen" onClick={handleInteraction}>
          <div className="start-content">
            <h1>Welcome to My Portfolio</h1>
            <p>Tap anywhere to start exploring</p>
          </div>
        </div>
      )}
      
      {ready && (
        <>
          <Canvas
            shadows
            camera={{ position: [9, 4, 3], fov: 20 }}
            onCreated={({ camera }) => {
              cameraRef.current = camera;
            }}
          >
            <Suspense fallback={<LoadingScreen />}>
              <ambientLight intensity={0.4} />
              <directionalLight
                castShadow
                position={[2, 1, 3]}
                intensity={1.2}
              />
              <CityScene pauseMotion={exploreMode} />
              {exploreMode && !isMobile && (
                <FlyControls
                  movementSpeed={1}
                  rollSpeed={0.25}
                  dragToLook={false}
                />
              )}
            </Suspense>
          </Canvas>
          
          {exploreMode && !isMobile && (
            <button className="exit-tour-btn" onClick={reopenFinalBox}>
              <i className="fas fa-times"></i> Exit Tour
            </button>
          )}
          
          {showTutorial && tutorialIndex < tutorialSteps.length && (
            <MessageOverlay
              text={tutorialSteps[tutorialIndex].text}
              duration={tutorialSteps[tutorialIndex].duration}
            />
          )}
          
          {currentMessageIndex !== null && messages[currentMessageIndex] && (
            <MessageOverlay
              key={currentMessageIndex}
              text={messages[currentMessageIndex].text}
              duration={messages[currentMessageIndex].duration}
            />
          )}
          
          {showFinalBox && (
            <div className="portfolio-overlay">
              <div className="portfolio-container">
                <div className="portfolio-header">
                  <h1>Mehmet Efe Öçal</h1>
                  <p>Let's build the future together!</p>
                </div>
              
              <div className="projects-section">
                {/* Featured Projects */}
                <div className="featured-section">
                  <h2>Featured Projects</h2>
                  <div className="featured-projects">
                    {projects.filter(project => project.featured).map((project, index) => (
                      <div key={index} className="featured-project">
                        <div className="featured-image-container">
                          <img src={project.imageUrl} alt={project.title} />
                          <div className="featured-badge">Featured</div>
                        </div>
                        <div className="featured-content">
                          <h3>{project.title}</h3>
                          <span className="featured-category">{project.category}</span>
                          <p className="featured-description">{project.description}</p>
                          <a 
                            href={project.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="project-link"
                            style={{ color: project.color }}
                          >
                            View Project <i className="fas fa-arrow-right"></i>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Category Filter */}
                <div className="category-filter">
                  <h3>Filter by Category</h3>
                  <div className="category-buttons">
                    <button 
                      className={activeCategory === 'All' ? 'active' : ''}
                      onClick={() => setActiveCategory('All')}
                    >
                      All Projects
                    </button>
                    {[...new Set(projects.map(p => p.category))].map((category, i) => (
                      <button
                        key={i}
                        className={activeCategory === category ? 'active' : ''}
                        onClick={() => setActiveCategory(category)}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Regular Projects List */}
                <div className="regular-projects">
                  <h2>{activeCategory === 'All' ? 'All Projects' : activeCategory}</h2>
                  {projects
                    .filter(project => !project.featured && (activeCategory === 'All' || project.category === activeCategory))
                    .map((project, index) => (
                      <div key={index} className="project-item">
                        <div className="project-header">
                          <h3 className="project-title">{project.title}</h3>
                          <span className="project-category">{project.category}</span>
                        </div>
                        <p className="project-description">{project.description}</p>
                        <a 
                          href={project.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="project-link"
                          style={{ color: project.color }}
                        >
                          View Project <i className="fas fa-arrow-right"></i>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
                              <div className="social-section">
                <h2>Connect With Me</h2>
                <div className="social-links">
                  <a
                    href="https://github.com/mehmet-2023"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link github"
                  >
                    <i className="fab fa-github"></i>
                  </a>
                  <a
                    href="https://www.linkedin.com/in/mehmet-efe-%C3%B6%C3%A7al-7b8925337/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link linkedin"
                  >
                    <i className="fab fa-linkedin-in"></i>
                  </a>
                  <a
                    href="https://www.instagram.com/mhmtt1520/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link instagram"
                  >
                    <i className="fab fa-instagram"></i>
                  </a>
                  {!isMobile && (
                    <button className="tour-btn" onClick={startTutorial}>
                      <i className="fas fa-helicopter"></i> City Tour
                    </button>
                  )}
                </div>
              </div>
            </div>
              </div>
          )}
          
          {showPopup && (
            <div className="project-popup">
              <div className="popup-header" style={{ backgroundColor: showPopup.color }}>
                <h2>{showPopup.title}</h2>
                <button className="close-popup" onClick={closePopup}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="popup-content">
                <div className="popup-image">
                  <img src={showPopup.imageUrl} alt={showPopup.title} />
                </div>
                <div className="popup-description">
                  <p>{showPopup.description}</p>
                  {showPopup.link && showPopup.link !== "#" && (
                    <a 
                      href={showPopup.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="visit-project-btn"
                      style={{ backgroundColor: showPopup.color }}
                    >
                      Visit Project <i className="fas fa-external-link-alt"></i>
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}