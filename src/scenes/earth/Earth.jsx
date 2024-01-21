import React, { useCallback, useEffect, useRef, useState } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
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
  ] = useLoader(TextureLoader, [
    "/assets/earth_8k.jpg",
    "/assets/earth-normal_2k.jpg",
    "/assets/earth_specular_map_2k.jpg",
    "/assets/earth_displacement_map.jpg",
    "/assets/earth_night_map_8k.jpg",
  ]);

  const earthRef = useRef();
  const orbitRef = useRef();
  const clockRef = useRef(new THREE.Clock());

  const updateEarthPosition = useCallback(() => {
    // Calculate the Earth´s position based on its angle from the Sun.
    const angle = clockRef.current.getElapsedTime() * 0.1;
    const distance = 30;
    const x = Math.sin(angle) * distance;
    const z = Math.cos(angle) * distance;

    earthRef.current.position.set(x, 0, z);

    earthRef.current.rotation.y += 0.001;

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
      {/* Read more:
      https://docs.pmnd.rs/react-three-fiber/getting-started/your-first-scene#adding-a-mesh-component
      https://www.solarsystemscope.com/textures/ // Sphere geometry ->
      Radius, X-axis, Y-axis */}
      <group position={[0, 0, 0]} ref={earthRef}>
        <mesh
          castShadow
          receiveShadow
          onClick={toggleFollowingEarth}
          onPointerOver={() => setIsHovered(true)}
          onPointerOut={() => setIsHovered(false)}
        >
          <sphereGeometry args={[1.8, 128, 128]} />
          <meshPhongMaterial
            map={earthTexture}
            normalMap={earthNormalMap}
            // ------------- Not used, performance takes a bit hit ------------- \\
            // specularMap={earthSpecularMap}
            // displacementMap={earthDisplacementMap}
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
    </>
  );
});

export default Earth;
