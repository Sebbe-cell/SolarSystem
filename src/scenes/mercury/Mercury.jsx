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

  const orbitRef = useRef();
  const mercuryRef = useRef();
  const clockRef = useRef(new THREE.Clock());

  const updateMercuryPosition = useCallback(() => {
    // Calculate the Mercury's position based on its angle from the Sun.
    const angle = clockRef.current.getElapsedTime() * 0.2;
    const distance = 10;
    const x = Math.sin(angle) * distance;
    const z = Math.cos(angle) * distance;

    mercuryRef.current.position.set(x, 0, z);

    mercuryRef.current.rotation.y += 0.004;

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

  const toggleFollowingMercury = () => {
    sethoveringMercury((prevhoveringMercury) => !prevhoveringMercury);
  };

  useEffect(() => {
    document.body.style.cursor = isHovered ? "pointer" : "auto";
  }, [isHovered]);

  useFrame(({ camera }) => {
    updateMercuryPosition();
    const mercuryPositionRef = mercuryRef.current.position;
    const cameraTargetPosition = new THREE.Vector3(
      mercuryPositionRef.x + 2,
      mercuryPositionRef.y + 1,
      mercuryPositionRef.z + 0
    );

    if (hoveringMercury) {
      camera.lookAt(mercuryPositionRef);
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

      <mesh
        ref={mercuryRef}
        castShadow
        receiveShadow
        onClick={toggleFollowingMercury}
        onPointerOver={() => setIsHovered(true)}
        onPointerOut={() => setIsHovered(false)}
      >
        <sphereGeometry args={[1, 128, 128]} />
        <meshPhongMaterial
          map={mercuryTexture}
          shininess={10}
          emissiveMap={mercuryEmissiveMap}
          emissiveIntensity={isHovered ? 1 : 0.1}
          emissive={0xffffff}
        />
      </mesh>
    </>
  );
});

export default Mercury;
