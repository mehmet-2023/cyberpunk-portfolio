import React, { useRef, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Sprite, SpriteMaterial, TextureLoader } from 'three';

export default function CityScene({ pauseMotion = false }) {
  const gltf = useLoader(GLTFLoader, '/models/cyberpunk_new.glb');
  const signTexture = useLoader(TextureLoader, '/textures/neon_sign.png');
  const city = useRef();
  const cameraRef = useRef();

  useFrame(({ clock }) => {
    if (!pauseMotion && city.current) {
      const t = clock.getElapsedTime();
      city.current.rotation.y = Math.sin(t * 0.1) * 1.5;
      city.current.position.x = Math.sin(t * 0.3) * 3;
      city.current.position.z = Math.cos(t * 0.3) * 3;
      city.current.position.y = Math.sin(t * 0.5) * 0.5;
    }
    if (cameraRef.current && city.current) {
      cameraRef.current.position.set(
        city.current.position.x + 8,
        6,
        city.current.position.z + 8
      );
      cameraRef.current.lookAt(city.current.position);
    }
  });

  useEffect(() => {
    if (!city.current) return;
    city.current.traverse((obj) => {
      if (obj.isMesh && obj.name.includes('Building')) {
        const mat = new SpriteMaterial({ map: signTexture, transparent: true });
        const sprite = new Sprite(mat);
        sprite.scale.set(5, 2, 1);
        sprite.position.set(0, obj.geometry.boundingBox?.max?.y + 2 || 10, 0);
        obj.add(sprite);
      }
    });
  }, [gltf, signTexture]);

  return (
    <>
      <group ref={city}>
        <primitive object={gltf.scene} castShadow receiveShadow />
      </group>
      <group ref={cameraRef} />
    </>
  );
}
