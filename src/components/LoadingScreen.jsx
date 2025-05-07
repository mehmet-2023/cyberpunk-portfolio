import { Html, useProgress } from "@react-three/drei";
import { motion } from "framer-motion";

export default function LoadingScreen() {
  const { progress } = useProgress();

  return (
    <Html fullscreen>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "#121212",
          width: "100vw",
          height: "100vh",
          fontFamily: "Orbitron, sans-serif",
          color: "#FFD15D",
        }}
      >
        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          style={{
            fontSize: "2.5rem",
            textShadow: "0 0 10px #FFD15D",
            marginBottom: "20px",
          }}
        >
          Loading
        </motion.h1>

        <motion.div
          style={{
            fontSize: "1.8rem",
            textShadow: "0 0 6px #FFD15D",
            marginBottom: "20px",
          }}
          animate={{ opacity: [0.8, 1, 0.8] }}
          transition={{ repeat: Infinity, duration: 1.2 }}
        >
          {progress.toFixed(0)}%
        </motion.div>

        <div
          style={{
            width: "200px",
            height: "8px",
            background: "#333",
            borderRadius: "10px",
            overflow: "hidden",
            boxShadow: "0 0 12px #FFD15D",
          }}
        >
          <motion.div
            style={{
              height: "100%",
              background: "#FFD15D",
              width: `${progress}%`,
            }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: "easeOut", duration: 0.3 }}
          />
        </div>
      </div>
    </Html>
  );
}
