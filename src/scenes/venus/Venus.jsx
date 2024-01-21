import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const Venus = React.memo(() => {
  const [isHovered, setIsHovered] = useState(false);
  const [hoveringVenus, sethoveringVenus] = useState(false);

  const [venusTexture, venusEmissiveMap] = useTexture([
    "/assets/venus_map_8k.jpg",
    "/assets/venus_map_8k.jpg",
  ]);

  const orbitRef = useRef();
  const venusRef = useRef();
  const clockRef = useRef(new THREE.Clock());

  const updateVenusPosition = useCallback(() => {
    // Calculate Venus position based on its angle from the Sun.
    const angle = clockRef.current.getElapsedTime() * 0.3;
    const distance = 18;
    const x = Math.sin(angle) * distance;
    const z = Math.cos(angle) * distance;

    venusRef.current.position.set(x, 0, z);

    venusRef.current.rotation.y += 0.003;

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

  const toggleFollowingVenus = () => {
    sethoveringVenus((prevhoveringVenus) => !prevhoveringVenus);
  };

  useEffect(() => {
    document.body.style.cursor = isHovered ? "pointer" : "auto";
  }, [isHovered]);

  useFrame(({ camera }) => {
    updateVenusPosition();
    const venusPositionRef = venusRef.current.position;
    const cameraTargetPosition = new THREE.Vector3(
      venusPositionRef.x + 3,
      venusPositionRef.y + 2,
      venusPositionRef.z + 5
    );

    if (hoveringVenus) {
      camera.lookAt(venusPositionRef);
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
        ref={venusRef}
        castShadow
        receiveShadow
        onClick={toggleFollowingVenus}
        onPointerOver={() => setIsHovered(true)}
        onPointerOut={() => setIsHovered(false)}
      >
        <sphereGeometry args={[1.3, 128, 128]} />
        <meshPhongMaterial
          map={venusTexture}
          shininess={10}
          emissiveMap={venusEmissiveMap}
          emissiveIntensity={isHovered ? 1.4 : 0.1}
          emissive={0xffffff}
        />
      </mesh>
    </>
  );
});

export default Venus;
