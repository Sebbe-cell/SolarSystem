/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
/* eslint-disable react/no-unknown-property */

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const Mercury = React.memo(() => {
  const [isHovered, setIsHovered] = useState(false);
  const [hoveringMercury, sethoveringMercury] = useState(false);

  const [mercuryTexture, mercuryEmissiveMap] = useTexture([
    "/assets/mercury_map_8k.jpg",
    "/assets/mercury_map_8k.jpg",
  ]);

  const mercuryRef = useRef();
  const clockRef = useRef(new THREE.Clock());

  const updateMercuryPosition = useCallback(() => {
    // Calculate the Mercury's position based on its angle from the Sun.
    const angle = clockRef.current.getElapsedTime() * 0.2;
    const distance = 8;
    const x = Math.sin(angle) * distance;
    const z = Math.cos(angle) * distance;

    mercuryRef.current.position.set(x, 0, z);

    mercuryRef.current.rotation.y += 0.004;
  }, []);

  const toggleFollowingMercury = () => {
    sethoveringMercury((prevhoveringMercury) => !prevhoveringMercury);
  };

  useEffect(() => {
    document.body.style.cursor = isHovered ? "pointer" : "auto";
  }, [isHovered]);

  // useFrame is a Fiber hook that lets you execute code on every frame of Fiber's render loop.
  useFrame(({ camera }) => {
    updateMercuryPosition();
    const mercuryPositionRef = mercuryRef.current.position;
    const cameraTargetPosition = new THREE.Vector3(
      mercuryPositionRef.x + 2,
      mercuryPositionRef.y + 1,
      mercuryPositionRef.z + 0,
    );

    if (hoveringMercury) {
      camera.lookAt(mercuryPositionRef);
      camera.position.copy(cameraTargetPosition);
    }
  });

  return (
    // Read more: https://docs.pmnd.rs/react-three-fiber/getting-started/your-first-scene#adding-a-mesh-component
    // https://www.solarsystemscope.com/textures/
    // Sphere geometry -> Radius, X-axis, Y-axis
      <mesh
        ref={mercuryRef}
        castShadow
        receiveShadow
        onClick={toggleFollowingMercury}
        onPointerOver={() => setIsHovered(true)}
        onPointerOut={() => setIsHovered(false)}
      >
        <sphereGeometry args={[0.3, 128, 128]} />
        <meshPhongMaterial
          map={mercuryTexture}
          shininess={10}
          emissiveMap={mercuryEmissiveMap}
          emissiveIntensity={isHovered ? 1 : 0.1}
          emissive={0xffffff}
        />
      </mesh>
  );
});

export default Mercury;
