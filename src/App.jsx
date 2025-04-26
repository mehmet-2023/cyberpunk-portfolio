import React, { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stats } from '@react-three/drei';
import CityScene from './components/CityScene';
import MessageOverlay from './components/MessageOverlay';
import './App.css';

const messages = [
  { text: "FRC Software Developer", time: 1, duration: 4 },
  { text: "RVC/AI Enjoyer", time: 6, duration: 4 },
  { text: "Founder Of Faster", time: 11, duration: 4 },
  { text: "UI/UX Specialist", time: 16, duration: 4 },
  { text: "Welcome to my portfolio.", time: 21, duration: 5 }
];

const projects = [
  {
    title: "Faster",
    imageUrl: "/images/faster.png",
    description: "Faster: How fast are you? is an original game idea that has no other examples. The simple goal of the game is to click on a color other than the specified color. Since the game is fun and challenging to play, it has left a positive impact on users and the project continues.",
    link: "https://fasterapp.glitch.me",
    color: "#FFD15D"
  },
  {
    title: "TheNest",
    imageUrl: "/images/thenest.png",
    description: "The Nest is a multipurpose website aimed at all STEAM-related communities and individuals. It aims to increase communication and connections between STEAM enthusiasts while also creating a platform that offers resources and education.",
    link: "https://the-nest.com.tr",
    color: "#2323FF"
  },
  {
    title: "NatrueGO",
    imageUrl: "/images/naturego.png",
    description: "NatureGO is a mobile application designed to bring users closer to nature while fostering online community engagement. Using the phone's camera, users can scan flowers, which are then converted into credits for various features in the app. The app integrates AI to facilitate safe content interaction, ensuring an enjoyable experience for everyone.",
    link: "https://github.com/mehmet-2023/NatureGO",
    color: "#2cff05"
  },
  {
    title: "CTF(Coding The Future)",
    imageUrl: "/images/ctf.jpg",
    description: "This project is a project where people we call thinkers give program ideas and a group of software developers who are willing to learn turn these ideas into reality. The project was successfully adapted but the project was not continued.",
    link: "#",
    color: "#C57175"
  },
  {
    title: "MakineAvcıları",
    imageUrl: "/images/makine_avcilari.jpg",
    description: "Machine Hunters is the mobile app version of our board game project that gamifies the subject of simple machines. The project made it to the semi-finals at Teknofest 2023 but was unfortunately eliminated from the finals.",
    link: "",
    color: "#808080"
  },
  {
    title: "ROMANIA 14TH ROBOCHALLENGE",
    imageUrl: "/images/robochallange.jpeg",
    description: "We participated in the 14th RoboChallange competition held in Romania with three robots in the Mini sumo category and came 9th in the world.",
    link: "https://www.bilokullari.com.tr/bahcelievler-bil-koleji/basari/uluslararasi-robochallenge-yarismasi-549",
    color: "#8a00c4"
  },
  {
    title: "2024 ROBOT - CRESCENDO SEASON",
    imageUrl: "/images/2024.png",
    description: "I participated in the Cezeri Başakşehir Off-Season competition with the 76111 2024 Robot and we received the team spirit award and the Dean's List award in this competition.",
    link: "https://www.thebluealliance.com/team/7611/2024",
    color: "#8a00c4"
  },
  {
    title: "ICEBERG - REEFSCAPE SEASON",
    imageUrl: "/images/iceberg.jpg",
    description: "We participated in Istanbul Bosphorus and South Florida Regional events with the 2025 Robot, whose software I undertook a large part in. Although we reached the semi-finals in the Bosphorus region and came in 3rd, we could not play in the Play-Off in the South Florida Region, but we made 17.3 EPA.",
    link: "https://www.thebluealliance.com/team/7611/2025",
    color: "#33dac6"
  },

];

export default function App() {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [ready, setReady] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showFinalBox, setShowFinalBox] = useState(false);
  const [showPopup, setShowPopup] = useState(null); 
  const audioRef = useRef(null);
  const finalbox_shown = useRef(false);
  useEffect(() => {
    if (!ready) return;
    const interval = setInterval(() => {
      setElapsed(prev => prev + 0.1);
    }, 100);
    return () => clearInterval(interval);
  }, [ready]);

  useEffect(() => {
    const activeIndex = messages.findIndex(
      m => elapsed >= m.time && elapsed <= m.time + m.duration
    );
    setCurrentMessageIndex(activeIndex);

    const lastMessage = messages[messages.length - 1];
    if (elapsed > lastMessage.time + lastMessage.duration + 1 && !showFinalBox && !finalbox_shown.current) {
      setShowFinalBox(true);
      finalbox_shown.current = true;
    }
  }, [elapsed]); 

  const handleInteraction = () => {
    if (audioRef.current && !hasInteracted) {
      audioRef.current.volume = 0.2;
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Autoplay failed:', err);
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
    const isMobile = window.innerWidth <= 768;
    const projectCount = projects.length;

    if (isMobile) return 'repeat(2, 1fr)';
    if (projectCount <= 2) return 'repeat(2, 1fr)';
    if (projectCount <= 6) return 'repeat(3, 1fr)';
    return 'repeat(4, 1fr)';
  };


  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', backgroundColor: '#000', position: 'relative' }}>
      <audio ref={audioRef} src="/no_diggity.mp3" preload="auto" loop />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
      {!ready && (
        <div
          onClick={handleInteraction}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundColor: '#000',
            color: '#FFD15D',
            fontSize: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 1000
          }}
        >
          Tap anywhere to start 🚀
        </div>
      )}

      {ready && (
        <>
          <Canvas shadows camera={{ position: [9, 4, 3], fov: 20 }}>
            <ambientLight intensity={0.4} />
            <directionalLight castShadow position={[2, 1, 3]} intensity={1.2} />
            <CityScene />
          </Canvas>

          {currentMessageIndex !== -1 && messages[currentMessageIndex] && (
            <MessageOverlay
              key={currentMessageIndex}
              text={messages[currentMessageIndex].text}
              duration={messages[currentMessageIndex].duration}
            />
          )}

          {/* Final Box */}
          {showFinalBox && (
            <div
              className="finalbox"
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: 'rgba(18, 18, 18, 0.8)',
                border: '2px solid #C57175',
                borderRadius: '16px',
                padding: '2rem',
                maxWidth: '500px',
                textAlign: 'center',
                color: '#fff',
                fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
                zIndex: 10,
                backdropFilter: 'blur(8px)',
                boxShadow: '0 0 30px #C57175aa',
                overflowWrap: 'break-word',
                wordWrap: 'break-word',
                maxHeight: "110vh",
              }}
            >

              <p style={{ fontSize: '2rem', margin: '0 0 1rem' }}>Mehmet Efe Öçal</p>
              <p className='sub'>Let’s build the future together!</p>
              <div style={{
                border: '1px solid #C57175',
                backdropFilter: 'blur(4px)',
                boxShadow: '0 0 20px #C57175aa'
              }}></div>
              <br></br>

              {/* Proje Galerisi */}
              <div className="grid" style={{
                display: 'grid',
                gridTemplateColumns: getGridColumns(),
                gap: '20px',
                marginTop: '20px',
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '0 1rem',
                width: "90%",
                height: "45%"
              }}>
                {projects.map((project, index) => (
                  <div
                    key={index}
                    onClick={() => handleProjectClick(project)}
                    style={{
                      cursor: 'pointer',
                      borderRadius: '10px',
                      overflow: 'hidden',
                      border: `2px solid ${project.color}`,
                      position: 'relative',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      boxShadow: `0 0 15px ${project.color}`,
                      backgroundColor: '#000',
                      aspectRatio: '1/1',
                      height: 'auto',
                      width: "%30",
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    className="project-item"
                  >
                    <img src={project.imageUrl} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        color: '#FFF',
                        fontSize: '1.5rem',
                        textAlign: 'center',
                        display: 'none', // Hover'da gösterilecek
                        opacity: 0,
                        transition: 'opacity 0.3s ease',
                      }}
                    >
                      {project.title}
                    </div>
                    <div
                      onMouseEnter={(e) => {
                        e.target.previousSibling.style.display = 'block';
                        e.target.previousSibling.style.opacity = 1;
                      }}
                      onMouseLeave={(e) => {
                        e.target.previousSibling.style.display = 'none';
                        e.target.previousSibling.style.opacity = 0;
                      }}
                    />
                  </div>
                ))}
              </div><br></br>
              <div style={{
                border: '1px solid #C57175',
                backdropFilter: 'blur(4px)',
                boxShadow: '0 0 20px #C57175aa'
              }}></div>
              <br></br>
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '20px',
                marginTop: '20px'
              }}>
                <a href="https://github.com/mehmet-2023" target="_blank" rel="noopener noreferrer" style={{
                  border: '2px solid #fff',
                  borderRadius: '50%',
                  padding: '12px',
                  backgroundColor: 'black',
                  boxShadow: '0 0 15px #fff',
                  color: '#fff',
                  transition: 'all 0.3s ease'
                }}>
                  <i className="fab fa-github" style={{ fontSize: '1.5rem' }}></i>
                </a>
                <a href="https://www.linkedin.com/in/mehmet-efe-%C3%B6%C3%A7al-7b8925337/" target="_blank" rel="noopener noreferrer" style={{
                  border: '2px solid #0077b5',
                  borderRadius: '50%',
                  padding: '12px',
                  backgroundColor: 'black',
                  boxShadow: '0 0 15px #0077b5',
                  color: '#0077b5',
                  transition: 'all 0.3s ease'
                }}>
                  <i className="fab fa-linkedin-in" style={{ fontSize: '1.5rem' }}></i>
                </a>
                <a href="https://www.instagram.com/mhmtt1520/" target="_blank" rel="noopener noreferrer" style={{
                  border: '2px solid #C13584',
                  borderRadius: '50%',
                  padding: '12px',
                  backgroundColor: 'black',
                  boxShadow: '0 0 15px #C13584',
                  color: '#C13584',
                  transition: 'all 0.3s ease'
                }}>
                  <i className="fab fa-instagram" style={{ fontSize: '1.5rem' }}></i>
                </a>
              </div>

            </div>
          )}

          {/* Popup */}
          {showPopup && (
            <div style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: 'rgba(18, 18, 18, 0.8)',
              padding: '2rem',
              borderRadius: '16px',
              width: '80%',
              maxWidth: '50%',
              zIndex: 15,
              textAlign: 'center',
              color: '#fff',
              boxShadow: `0 0 20px ${showPopup.color}`,
              border: `2px solid ${showPopup.color}`,
              display: "block"
            }}>
              <h2>{showPopup.title}</h2>
              <div style={{
                border: `1px solid ${showPopup.color}`,
                backdropFilter: 'blur(4px)',
                boxShadow: `0 0 20px ${showPopup.color}`
              }}></div>
              <br></br>
              <p>{showPopup.description}</p>
              <a href={showPopup.link} target="_blank" style={{ color: showPopup.color, textDecoration: 'none', display: 'block', margin: '20px 0' }}>Visit Project</a>
              <button onClick={closePopup} style={{ padding: '10px 20px', backgroundColor: '#C57175', border: 'none', color: '#fff', cursor: 'pointer', borderRadius: '8px' }}>Close</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
