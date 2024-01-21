/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
/* eslint-disable react/no-unknown-property */

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import Moon from "./Moon";
import Iss from "./ISS";
import * as THREE from "three";

const Earth = React.memo(({ displacementScale }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [hoveringEarth, setHoveringEarth] = useState(false);

  const [
    earthTexture,
    earthNormalMap,
    earthSpecularMap,
    earthDisplacementMap,
    earthEmissiveMap,
  ] = useTexture([
    "/assets/earth_8k.jpg",
    "/assets/earth-normal_2k.jpg",
    "/assets/earth_specular_map_2k.jpg",
    "/assets/earth_displacement_map.jpg",
    "/assets/earth_night_map_8k.jpg",
  ]);

  const earthRef = useRef();
  const clockRef = useRef(new THREE.Clock());

  const updateEarthPosition = useCallback(() => {
    // Calculate the Earth´s position based on its angle from the Sun.
    const angle = clockRef.current.getElapsedTime() * 0.1;
    const distance = 40;
    const x = Math.sin(angle) * distance;
    const z = Math.cos(angle) * distance;

    earthRef.current.position.set(x, 0, z);

    earthRef.current.rotation.y += 0.001;
  }, []);

  const toggleFollowingEarth = () => {
    setHoveringEarth((prevHoveringEarth) => !prevHoveringEarth);
  };

  useEffect(() => {
    document.body.style.cursor = isHovered ? "pointer" : "auto";
  }, [isHovered]);

  // useFrame is a Fiber hook that lets you execute code on every frame of Fiber's render loop.
  useFrame(({ camera }) => {
    updateEarthPosition();
    const earthPositionRef = earthRef.current.position;
    const cameraTargetPosition = new THREE.Vector3(
      earthPositionRef.x + 3,
      earthPositionRef.y + 2,
      earthPositionRef.z + 5
    );

    if (hoveringEarth) {
      camera.lookAt(earthPositionRef);
      camera.position.copy(cameraTargetPosition);
    }
  });

  return (
    // Read more: https://docs.pmnd.rs/react-three-fiber/getting-started/your-first-scene#adding-a-mesh-component
    // https://www.solarsystemscope.com/textures/
    // Sphere geometry -> Radius, X-axis, Y-axis
    <group position={[0, 0, 0]} ref={earthRef}>
      <mesh
        castShadow
        receiveShadow
        onClick={toggleFollowingEarth}
        onPointerOver={() => setIsHovered(true)}
        onPointerOut={() => setIsHovered(false)}
      >
        <sphereGeometry args={[1, 128, 128]} />
        <meshPhongMaterial
          map={earthTexture}
          normalMap={earthNormalMap}
          specularMap={earthSpecularMap}
          displacementMap={earthDisplacementMap}
          displacementScale={displacementScale}
          shininess={10}
          emissiveMap={earthEmissiveMap}
          emissiveIntensity={isHovered ? 10 : 1.5}
          emissive={0xffffff}
        />
      </mesh>
      <Iss />
      <Moon />
    </group>
  );
});

export default Earth;
