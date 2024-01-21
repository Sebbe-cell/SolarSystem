import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const Jupiter = React.memo(() => {
  const [isHovered, setIsHovered] = useState(false);
  const [hoveringJupiter, sethoveringJupiter] = useState(false);

  const [jupiterTexture, jupiterEmissiveMap] = useTexture([
    "/assets/jupiter_map_8k.jpg",
    "/assets/jupiter_map_8k.jpg",
  ]);

  const jupiterRef = useRef();
  const orbitRef = useRef();
  const clockRef = useRef(new THREE.Clock());

  const updateJupiterPosition = useCallback(() => {
    // Calculate Jupiter´s position based on its angle from the Sun.
    const angle = clockRef.current.getElapsedTime() * 0.02;
    const distance = 56;
    const x = Math.sin(angle) * distance;
    const z = Math.cos(angle) * distance;

    jupiterRef.current.position.set(x, 0, z);
    jupiterRef.current.rotation.y += 0.0003;

    // Update the orbit line
    const points = [];
    const segments = 128;
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      const orbitRadius = distance;
      const orbitX = Math.sin(theta) * orbitRadius;
      const orbitZ = Math.cos(theta) * orbitRadius;
      points.push(new THREE.Vector3(orbitX, 0, orbitZ));
    }

    orbitRef.current.geometry.setFromPoints(points);
  }, []);

  const toggleFollowingJupiter = () => {
    sethoveringJupiter((prevhoveringJupiter) => !prevhoveringJupiter);
  };

  useEffect(() => {
    document.body.style.cursor = isHovered ? "pointer" : "auto";
  }, [isHovered]);

  // useFrame is a Fiber hook that lets you execute code on every frame of Fiber's render loop.
  useFrame(({ camera }) => {
    updateJupiterPosition();
    const jupiterPositionRef = jupiterRef.current.position;
    const cameraTargetPosition = new THREE.Vector3(
      jupiterPositionRef.x + 3,
      jupiterPositionRef.y + 3,
      jupiterPositionRef.z + 6
    );

    if (hoveringJupiter) {
      camera.lookAt(jupiterPositionRef);
      camera.position.copy(cameraTargetPosition);
    }
  });

  return (
    <>
      {/* Orbit Line */}
      <lineSegments ref={orbitRef}>
        <bufferGeometry attach="geometry" />
        <lineBasicMaterial
          attach="material"
          color={0xffffff}
          dashSize={1}
          gapSize={0.5}
          linewidth={1}
          transparent
          opacity={0.3}
        />
      </lineSegments>

      {/* Jupiter Sphere */}
      <mesh
        ref={jupiterRef}
        castShadow
        receiveShadow
        onClick={toggleFollowingJupiter}
        onPointerOver={() => setIsHovered(true)}
        onPointerOut={() => setIsHovered(false)}
      >
        <sphereGeometry args={[3, 128, 128]} />
        <meshPhongMaterial
          map={jupiterTexture}
          shininess={10}
          emissiveMap={jupiterEmissiveMap}
          emissiveIntensity={isHovered ? 1 : 0.01}
          emissive={0xffffff}
        />
      </mesh>
    </>
  );
});

export default Jupiter;