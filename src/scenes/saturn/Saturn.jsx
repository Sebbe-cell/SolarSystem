import React, { useCallback, useEffect, useRef, useState } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import * as THREE from "three";
import SaturnsRings from "./SaturnsRings";

const Saturn = React.memo(() => {
  const [isHovered, setIsHovered] = useState(false);
  const [hoveringSaturn, sethoveringSaturn] = useState(false);

  const [
    saturnTexture,
  ] = useLoader(TextureLoader, [
    "/assets/saturn_map_8k.jpg",
  ]);

  const saturnRef = useRef();
  const orbitRef = useRef();
  const clockRef = useRef(new THREE.Clock());

  const updateSaturnPosition = useCallback(() => {
    // Calculate Saturn´s position based on its angle from the Sun.
    const angle = clockRef.current.getElapsedTime() * 0.01;
    const distance = 66;
    const x = Math.sin(angle) * distance;
    const z = Math.cos(angle) * distance;

    saturnRef.current.position.set(x, 0, z);

    saturnRef.current.rotation.y += 0.001;

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

    const orbitGeometry = new THREE.BufferGeometry().setFromPoints(points);
    orbitRef.current.geometry = orbitGeometry;
  }, []);

  const toggleFollowingSaturn = () => {
    sethoveringSaturn((prevhoveringSaturn) => !prevhoveringSaturn);
  };

  useEffect(() => {
    document.body.style.cursor = isHovered ? "pointer" : "auto";
  }, [isHovered]);

  // useFrame is a Fiber hook that lets you execute code on every frame of Fiber's render loop.
  useFrame(({ camera }) => {
    updateSaturnPosition();
    const saturnPositionRef = saturnRef.current.position;
    const cameraTargetPosition = new THREE.Vector3(
      saturnPositionRef.x + 3,
      saturnPositionRef.y + 2,
      saturnPositionRef.z + 5
    );

    if (hoveringSaturn) {
      camera.lookAt(saturnPositionRef);
      camera.position.copy(cameraTargetPosition);
    }
  });

  return (
    <>
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
      <group position={[0, 0, 0]} ref={saturnRef}>
        <mesh
          castShadow
          receiveShadow
          onClick={toggleFollowingSaturn}
          onPointerOver={() => setIsHovered(true)}
          onPointerOut={() => setIsHovered(false)}
        >
          <sphereGeometry args={[2.6, 128, 128]} />
          <meshPhongMaterial
            map={saturnTexture}
            shininess={10}
            emissiveIntensity={isHovered ? 0.02 : 0.01}
            emissive={0xffffff}
          />
        </mesh>
        <SaturnsRings/>
      </group>
    </>
  );
});

export default Saturn;