import React, { useCallback, useRef } from "react";

import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const Moon = React.memo(() => {
  const [moonTexture] = useTexture(["/assets/moon_map_8k.jpg"]);

  const xAxis = 3.6;
  const moonSize = 0.2;
  const moonRef = useRef();
  const clockRef = useRef(new THREE.Clock());

  const updateMoonPosition = useCallback(() => {
    // Orbit Rotation
    moonRef.current.position.x =
      Math.sin(clockRef.current.getElapsedTime() * 0.4) * xAxis;
    moonRef.current.position.z =
      Math.cos(clockRef.current.getElapsedTime() * 0.4) * xAxis;

    // Axis Rotation
    moonRef.current.rotation.y += 0.0003;
  }, []);

  useFrame(() => {
    updateMoonPosition();
  });

  return (
    <mesh castShadow receiveShadow ref={moonRef} position={[xAxis, 0, 0]}>
      <sphereGeometry args={[moonSize, 32, 32]} />
      <meshPhongMaterial
        map={moonTexture}
        emissiveMap={moonTexture}
        emissive={0xffffff}
        emissiveIntensity={0.1}
        shininess={10}
      />
    </mesh>
  );
});

export default Moon;
