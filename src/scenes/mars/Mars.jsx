import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const Mars = React.memo(() => {
  const [isHovered, setIsHovered] = useState(false);
  const [hoveringMars, setHoveringMars] = useState(false);

  const [marsTexture, marsEmissiveMap] = useTexture([
    "/assets/mars_map_8k.jpg",
    "/assets/mars_map_8k.jpg",
  ]);

  const marsRef = useRef();
  const orbitRef = useRef();
  const clockRef = useRef(new THREE.Clock());

  const updateMarsPosition = useCallback(() => {
    // Calculate the Mars position based on its angle from the Sun.
    const angle = clockRef.current.getElapsedTime() * 0.06;
    const distance = 45;
    const x = Math.sin(angle) * distance;
    const z = Math.cos(angle) * distance;

    marsRef.current.position.set(x, 0, z);
    marsRef.current.rotation.y += 0.001;

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

  const toggleFollowingMars = () => {
    setHoveringMars((prevHoveringMars) => !prevHoveringMars);
  };

  useEffect(() => {
    document.body.style.cursor = isHovered ? "pointer" : "auto";
  }, [isHovered]);

  // useFrame is a Fiber hook that lets you execute code on every frame of Fiber's render loop.
  useFrame(({ camera }) => {
    updateMarsPosition();
    const marsPositionRef = marsRef.current.position;
    const cameraTargetPosition = new THREE.Vector3(
      marsPositionRef.x + 1,
      marsPositionRef.y + 1,
      marsPositionRef.z + 2
    );

    if (hoveringMars) {
      camera.lookAt(marsPositionRef);
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

      {/* Mars Sphere */}
      <mesh
        ref={marsRef}
        castShadow
        receiveShadow
        onClick={toggleFollowingMars}
        onPointerOver={() => setIsHovered(true)}
        onPointerOut={() => setIsHovered(false)}
      >
        <sphereGeometry args={[1.4, 128, 128]} />
        <meshPhongMaterial
          map={marsTexture}
          shininess={10}
          emissiveMap={marsEmissiveMap}
          emissiveIntensity={isHovered ? 1 : 0.01}
          emissive={0xffffff}
        />
      </mesh>
    </>
  );
});

export default Mars;