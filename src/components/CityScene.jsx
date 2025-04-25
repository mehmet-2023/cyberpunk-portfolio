import React, { useRef, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Sprite, SpriteMaterial, TextureLoader } from 'three';

export default function CityScene() {
  const gltf = useLoader(GLTFLoader, '/models/cyberpunk_new.glb');
  const signTexture = useLoader(TextureLoader, '/textures/neon_sign.png');

  const city = useRef();
  const cameraRef = useRef();

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    if (city.current) {
      city.current.rotation.y = Math.sin(time * 0.1) * 1.5;
      city.current.position.x = Math.sin(time * 0.3) * 3;
      city.current.position.z = Math.cos(time * 0.3) * 3;
      city.current.position.y = Math.sin(time * 0.5) * 0.5;
    }

    if (cameraRef.current) {
      cameraRef.current.position.x = city.current.position.x + 8;
      cameraRef.current.position.z = city.current.position.z + 8;
      cameraRef.current.position.y = 6;
      cameraRef.current.lookAt(city.current.position);
    }
  });

  useEffect(() => {
    if (!city.current) return;
    city.current.traverse((obj) => {
      if (obj.isMesh && obj.name.includes('Building')) {
        const spriteMaterial = new SpriteMaterial({ map: signTexture, transparent: true });
        const sprite = new Sprite(spriteMaterial);
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
