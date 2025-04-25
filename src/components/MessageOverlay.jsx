import React, { useEffect, useState } from 'react';

export default function MessageOverlay({ text, duration = 4 }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);

    const hideTimeout = setTimeout(() => {
      setVisible(false);
    }, (duration - 1) * 1000); // 1 saniye önce görünmez olur

    return () => clearTimeout(hideTimeout);
  }, [text, duration]);

  return (
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      color: '#FFD15D',
      fontSize: '2.2rem',
      fontWeight: '600',
      fontFamily: 'Orbitron, sans-serif',
      textShadow: '0 0 10px #FFD15D',
      pointerEvents: 'none',
      zIndex: 999,
      opacity: visible ? 1 : 0,
      transition: 'opacity 0.8s ease-in-out'
    }}>
      {text}
    </div>
  );
}
