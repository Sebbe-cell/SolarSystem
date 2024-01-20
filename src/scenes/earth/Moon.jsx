/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable react/no-unknown-property */

import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

const Moon = () => {
  const [moonTexture] = useTexture(["/assets/moon_map_8k.jpg"]);
  const xAxis = 5;
  const moonSize = 0.2;

  const moonRef = useRef();

  useFrame(({ clock }) => {
    // Orbit Rotation
    moonRef.current.position.x = Math.sin(clock.getElapsedTime() * 0.1) * xAxis;
    moonRef.current.position.z = Math.cos(clock.getElapsedTime() * 0.1) * xAxis;

    // Axis Rotation
    moonRef.current.rotation.y += 0.0003;
  });

  return (
    <mesh castShadow ref={moonRef} position={[xAxis, 0, 0]}>
      <sphereGeometry args={[moonSize, 32, 32]} />
      <meshPhongMaterial map={moonTexture} shininess={10} />
    </mesh>
  );
};

export default Moon;
