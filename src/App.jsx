import React, { useState, useEffect, useRef, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Stats, FlyControls } from "@react-three/drei";
import CityScene from "./components/CityScene";
import LoadingScreen from "./components/LoadingScreen";
import MessageOverlay from "./components/MessageOverlay";
import "./App.css";

const messages = [
  { text: "FRC Software Developer", time: 1, duration: 4 },
  { text: "RVC/AI Enjoyer", time: 6, duration: 4 },
  { text: "Founder Of Faster", time: 11, duration: 4 },
  { text: "UI/UX Specialist", time: 16, duration: 4 },
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
  },
  {
    title: "TheNest",
    imageUrl: "/images/thenest.png",
    description:
      "The Nest is a multipurpose website aimed at all STEAM-related communities and individuals. It aims to increase communication and connections between STEAM enthusiasts while also creating a platform that offers resources and education.",
    link: "https://the-nest.com.tr",
    color: "#2323FF",
  },
  {
    title: "NatrueGO",
    imageUrl: "/images/naturego.png",
    description:
      "NatureGO is a mobile application designed to bring users closer to nature while fostering online community engagement. Using the phone's camera, users can scan flowers, which are then converted into credits for various features in the app. The app integrates AI to facilitate safe content interaction, ensuring an enjoyable experience for everyone.",
    link: "https://github.com/mehmet-2023/NatureGO",
    color: "#2cff05",
  },
  {
    title: "CTF(Coding The Future)",
    imageUrl: "/images/ctf.jpg",
    description:
      "This project is a project where people we call thinkers give program ideas and a group of software developers who are willing to learn turn these ideas into reality. The project was successfully adapted but the project was not continued.",
    link: "#",
    color: "#C57175",
  },
  {
    title: "MakineAvcıları",
    imageUrl: "/images/makine_avcilari.jpg",
    description:
      "Machine Hunters is the mobile app version of our board game project that gamifies the subject of simple machines. The project made it to the semi-finals at Teknofest 2023 but was unfortunately eliminated from the finals.",
    link: "",
    color: "#808080",
  },
  {
    title: "ROMANIA 14TH ROBOCHALLENGE",
    imageUrl: "/images/robochallange.jpeg",
    description:
      "We participated in the 14th RoboChallange competition held in Romania with three robots in the Mini sumo category and came 9th in the world.",
    link: "https://www.bilokullari.com.tr/bahcelievler-bil-koleji/basari/uluslararasi-robochallenge-yarismasi-549",
    color: "#8a00c4",
  },
  {
    title: "2024 ROBOT - CRESCENDO SEASON",
    imageUrl: "/images/2024.png",
    description:
      "I participated in the Cezeri Başakşehir Off-Season competition with the 76111 2024 Robot and we received the team spirit award and the Dean's List award in this competition.",
    link: "https://www.thebluealliance.com/team/7611/2024",
    color: "#ff8800",
  },
  {
    title: "ICEBERG - REEFSCAPE SEASON",
    imageUrl: "/images/iceberg.jpg",
    description:
      "We participated in Istanbul Bosphorus and South Florida Regional events with the 2025 Robot, whose software I undertook a large part in. Although we reached the semi-finals in the Bosphorus region and came in 3rd, we could not play in the Play-Off in the South Florida Region, but we made 17.3 EPA.",
    link: "https://www.thebluealliance.com/team/7611/2025",
    color: "#33dac6",
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
    <div
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: "#000",
        position: "relative",
      }}
    >
      <audio ref={audioRef} src="/no_diggity.mp3" preload="auto" loop />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
      />
      {!ready && (
        <div
          onClick={handleInteraction}
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backgroundColor: "#000",
            color: "#FFD15D",
            fontSize: "1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            zIndex: 1000,
          }}
        >
          Tap anywhere to start 🚀
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
            <button
              onClick={reopenFinalBox}
              style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                padding: "10px 20px",
                backgroundColor: "#C57175",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                boxShadow: "0 0 10px #C57175aa",
                cursor: "pointer",
                zIndex: 1000,
              }}
            >
              Exit Tour
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
             utz
              key={currentMessageIndex}
              text={messages[currentMessageIndex].text}
              duration={messages[currentMessageIndex].duration}
            />
          )}

          {showFinalBox && (
            <div
              className="finalbox"
              style={{
                position: "absolute",
                top: isMobile ? "0" : "50%",
                left: isMobile ? "0" : "50%",
                transform: isMobile ? "none" : "translate(-50%, -50%)",
                background: isMobile
                  ? "linear-gradient(180deg, rgba(18, 18, 18, 0.9), rgba(0, 0, 0, 0.95))"
                  : "linear-gradient(135deg, rgba(18, 18, 18, 0.7), rgba(0, 0, 0, 0.9))",
                border: isMobile ? "none" : "2px solid #33dac6",
                borderRadius: isMobile ? "0" : "12px",
                padding: isMobile ? "1rem 0" : "2rem",
                width: isMobile ? "100vw" : "100%",
                height: isMobile ? "100vh" : "auto",
                maxWidth: isMobile ? "100vw" : "min(90vw, 1000px)",
                color: "#fff",
                fontSize: isMobile ? "clamp(1.2rem, 3vw, 1.4rem)" : "clamp(1rem, 2vw, 1.2rem)",
                zIndex: 10,
                backdropFilter: "blur(10px)",
                boxShadow: isMobile ? "none" : "0 0 40px rgba(51, 218, 198, 0.5)",
                animation: isMobile ? "fadeInMobile 1s ease-out" : "fadeIn 1s ease-out, neonPulse 3s infinite alternate",
                overflowY: isMobile ? "auto" : "visible",
                overflowX: "hidden",
                boxSizing: "border-box",
              }}
            >
              <style>
                {`
                  @keyframes fadeIn {
                    from { opacity: 0; transform: translate(-50%, -60%); }
                    to { opacity: 1; transform: translate(-50%, -50%); }
                  }
                  @keyframes fadeInMobile {
                    from { opacity: 0; }
                    to { opacity: 1; }
                  }
                  @keyframes neonPulse {
                    0% { box-shadow: 0 0 20px rgba(51, 218, 198, 0.3), 0 0 40px rgba(51, 218, 198, 0.2); }
                    100% { box-shadow: 0 0 30px rgba(51, 218, 198, 0.6), 0 0 60px rgba(51, 218, 198, 0.4); }
                  }
                `}
              </style>
              <h1 style={{ fontSize: isMobile ? "clamp(2rem, 4vw, 2.5rem)" : "clamp(1.8rem, 3vw, 2.5rem)", margin: isMobile ? "0 0 1rem 1rem" : "0 0 1rem", textShadow: "0 0 10px #33dac6" }}>
                Mehmet Efe Öçal
              </h1>
              <p style={{ fontSize: isMobile ? "clamp(1.2rem, 3vw, 1.4rem)" : "clamp(1rem, 2vw, 1.2rem)", opacity: 0.8, margin: isMobile ? "0 1rem 1rem" : "0 0 1rem" }}>
                Let’s build the future together!
              </p>
              <div
                style={{
                  borderTop: "1px solid #33dac6",
                  margin: isMobile ? "0 1rem 1rem" : "1rem 0",
                  boxShadow: "0 0 15px rgba(51, 218, 198, 0.3)",
                }}
              ></div>

              <div
                className="grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: getGridColumns(),
                  gap: "20px",
                  marginTop: "0.5rem",
                  padding: isMobile ? "2.5rem" : "0 1rem",
                }}
              >
                {projects.map((project, index) => (
                  <div
                    key={index}
                    onClick={() => handleProjectClick(project)}
                    className="project-item"
                    style={{
                      cursor: "pointer",
                      borderRadius: "8px",
                      overflow: "hidden",
                      border: `2px solid ${project.color}`,
                      position: "relative",
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                      boxShadow: `0 0 10px ${project.color}`,
                      backgroundColor: "rgba(0, 0, 0, 0.8)",
                      maxWidth: "90%",
                      margin: "0 auto",
                      marginBottom: "0.5rem",
                      maxHeight: "250px",
                      minHeight: "250px",
                      aspectRatio: "3/2",
                      boxSizing: "border-box",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.05)";
                      e.currentTarget.style.boxShadow = `0 0 25px ${project.color}`;
                      e.currentTarget.querySelector(".project-title").style.display = "block";
                      e.currentTarget.querySelector(".project-title").style.opacity = "1";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                      e.currentTarget.style.boxShadow = `0 0 10px ${project.color}`;
                      e.currentTarget.querySelector(".project-title").style.display = "none";
                      e.currentTarget.querySelector(".project-title").style.opacity = "0";
                    }}
                  >
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: "center",
                        opacity: 0.85,
                        display: "block",
                        maxHeight: "300px",
                        minHeight: "300px",
                      }}
                    />
                    <div
                      className="project-title"
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        color: "#fff",
                        fontSize: isMobile ? "clamp(1.4rem, 4vw, 1.6rem)" : "clamp(1rem, 1.8vw, 1.2rem)",
                        textAlign: "center",
                        textShadow: `0 0 5px ${project.color}`,
                        display: "none",
                        opacity: 0,
                        transition: "opacity 0.3s ease",
                        fontWeight: "bold",
                        padding: isMobile ? "0 1rem" : "0",
                      }}
                    >
                      {project.title}
                    </div>
                  </div>
                ))}
              </div>

              <div
                style={{
                  borderTop: "1px solid #33dac6",
                  margin: isMobile ? "1rem 1rem 1.5rem" : "1.5rem 0",
                  boxShadow: "0 0 15px rgba(51, 218, 198, 0.3)",
                }}
              ></div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "15px",
                  flexWrap: "wrap",
                  padding: isMobile ? "0 1rem" : "0",
                }}
              >
                <a
                  href="https://github.com/mehmet-2023"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    border: "2px solid #fff",
                    borderRadius: "50%",
                    padding: "10px",
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    boxShadow: "0 0 10px #fff",
                    color: "#fff",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                  <i className="fab fa-github" style={{ fontSize: isMobile ? "1.4rem" : "1.2rem" }}></i>
                </a>
                <a
                  href="https://www.linkedin.com/in/mehmet-efe-%C3%B6%C3%A7al-7b8925337/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    border: "2px solid #0077b5",
                    borderRadius: "50%",
                    padding: "10px",
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    boxShadow: "0 0 10px #0077b5",
                    color: "#0077b5",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                  <i className="fab fa-linkedin-in" style={{ fontSize: isMobile ? "1.4rem" : "1.2rem" }}></i>
                </a>
                <a
                  href="https://www.instagram.com/mhmtt1520/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    border: "2px solid #C13584",
                    borderRadius: "50%",
                    padding: "10px",
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    boxShadow: "0 0 10px #C13584",
                    color: "#C13584",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                  <i className="fab fa-instagram" style={{ fontSize: isMobile ? "1.4rem" : "1.2rem" }}></i>
                </a>
                {!isMobile && (
                  <button
                    onClick={startTutorial}
                    style={{
                      padding: "8px 20px",
                      backgroundColor: "#33dac6",
                      border: "none",
                      borderRadius: "6px",
                      color: "#fff",
                      boxShadow: "0 0 10px rgba(51, 218, 198, 0.5)",
                      cursor: "pointer",
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  >
                    City Tour 🚁
                  </button>
                )}
              </div>
            </div>
          )}

          {showPopup && (
            <div
              style={{
                position: "fixed",
                top: isMobile ? "0" : "50%",
                left: isMobile ? "0" : "50%",
                transform: isMobile ? "none" : "translate(-50%, -50%)",
                background: isMobile
                  ? "linear-gradient(180deg, rgba(18, 18, 18, 0.9), rgba(0, 0, 0, 0.95))"
                  : "linear-gradient(135deg, rgba(18, 18, 18, 0.7), rgba(0, 0, 0, 0.9))",
                padding: isMobile ? "1rem" : "2rem",
                borderRadius: isMobile ? "0" : "12px",
                width: isMobile ? "100vw" : "min(80vw, 600px)",
                height: isMobile ? "100vh" : "auto",
                zIndex: 15,
                textAlign: "center",
                color: "#fff",
                boxShadow: isMobile ? "none" : `0 0 20px ${showPopup.color}`,
                border: isMobile ? "none" : `2px solid ${showPopup.color}`,
                backdropFilter: "blur(10px)",
                animation: isMobile ? "fadeInMobile 0.5s ease-out" : "fadeIn 0.5s ease-out",
                overflowY: isMobile ? "auto" : "visible",
                overflowX: "hidden",
                boxSizing: "border-box",
              }}
            >
              <style>
                {`
                  @keyframes fadeIn {
                    from { opacity: 0; transform: translate(-50%, -60%); }
                    to { opacity: 1; transform: translate(-50%, -50%); }
                  }
                  @keyframes fadeInMobile {
                    from { opacity: 0; }
                    to { opacity: 1; }
                  }
                `}
              </style>
              <h2 style={{ textShadow: `0 0 5px ${showPopup.color}`, fontSize: isMobile ? "clamp(1.8rem, 4vw, 2.2rem)" : "clamp(1.5rem, 3vw, 1.8rem)", margin: isMobile ? "0 1rem 1rem" : "0 0 1rem" }}>
                {showPopup.title}
              </h2>
              <div
                style={{
                  borderTop: `1px solid ${showPopup.color}`,
                  margin: isMobile ? "0 1rem 1rem" : "1rem 0",
                  boxShadow: `0 0 10px ${showPopup.color}`,
                }}
              ></div>
              <p style={{ fontSize: isMobile ? "clamp(1.2rem, 3vw, 1.4rem)" : "clamp(1rem, 2vw, 1.2rem)", margin: isMobile ? "0 1rem 1rem" : "0 0 1rem" }}>
                {showPopup.description}
              </p>
              <a
                href={showPopup.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: showPopup.color,
                  textDecoration: "none",
                  display: "block",
                  margin: isMobile ? "0 1rem 1.5rem" : "1.5rem 0",
                  fontWeight: "bold",
                  textShadow: `0 0 5px ${showPopup.color}`,
                  fontSize: isMobile ? "clamp(1.2rem, 3vw, 1.4rem)" : "clamp(1rem, 2vw, 1.2rem)",
                }}
              >
                Visit Project
              </a>
              <button
                onClick={closePopup}
                style={{
                  padding: isMobile ? "10px 24px" : "8px 20px",
                  backgroundColor: "#33dac6",
                  border: "none",
                  color: "#fff",
                  cursor: "pointer",
                  borderRadius: "6px",
                  boxShadow: "0 0 10px rgba(51, 218, 198, 0.5)",
                  transition: "transform 0.3s ease",
                  fontSize: isMobile ? "clamp(1.2rem, 3vw, 1.4rem)" : "clamp(1rem, 2vw, 1.2rem)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                Close
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}