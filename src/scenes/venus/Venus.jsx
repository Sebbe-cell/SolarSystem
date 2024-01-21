/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
/* eslint-disable react/no-unknown-property */

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

  const venusRef = useRef();
  const clockRef = useRef(new THREE.Clock());

  const updateVenusPosition = useCallback(() => {
    // Calculate the Venus position based on its angle from the Sun.
    const angle = clockRef.current.getElapsedTime() * 0.3;
    const distance = 20;
    const x = Math.sin(angle) * distance;
    const z = Math.cos(angle) * distance;

    venusRef.current.position.set(x, 0, z);

    venusRef.current.rotation.y += 0.003;
  }, []);

  const toggleFollowingVenus = () => {
    sethoveringVenus((prevhoveringVenus) => !prevhoveringVenus);
  };

  useEffect(() => {
    document.body.style.cursor = isHovered ? "pointer" : "auto";
  }, [isHovered]);

  // useFrame is a Fiber hook that lets you execute code on every frame of Fiber's render loop.
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
    // Read more: https://docs.pmnd.rs/react-three-fiber/getting-started/your-first-scene#adding-a-mesh-component
    // https://www.solarsystemscope.com/textures/
    // Sphere geometry -> Radius, X-axis, Y-axis
      <mesh
        ref={venusRef}
        castShadow
        receiveShadow
        onClick={toggleFollowingVenus}
        onPointerOver={() => setIsHovered(true)}
        onPointerOut={() => setIsHovered(false)}
      >
        <sphereGeometry args={[0.5, 128, 128]} />
        <meshPhongMaterial
          map={venusTexture}
          shininess={10}
          emissiveMap={venusEmissiveMap}
          emissiveIntensity={isHovered ? 1.4 : 0.1}
          emissive={0xffffff}
        />
      </mesh>
  );
});

export default Venus;
