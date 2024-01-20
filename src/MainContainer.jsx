/* eslint-disable react/no-unknown-property */
import { useHelper } from "@react-three/drei";
import AnimatedStars from "./AnimatedStars";
import Earth from "./scenes/earth/Earth";
import { useRef } from "react";
import * as THREE from "three";

const MainContainer = () => {
  const directionalLightRef = useRef();
  const directionalLightRefTwo = useRef();

  useHelper(directionalLightRef, THREE.DirectionalLightHelper, 1, "hotpink");
  useHelper(directionalLightRefTwo, THREE.DirectionalLightHelper, 1, "hotpink");

  return (
    <>
      <color attach="background" args={["black"]} />
      <AnimatedStars />
      <directionalLight
        castShadow
        ref={directionalLightRef}
        position={[0, 0, 40]}
        intensity={1}
        // color={0xff0000}
      />
      <directionalLight
        castShadow
        ref={directionalLightRefTwo}
        position={[0, 0, -40]}
      />
      {/* <ambientLight/> */}
      <Earth displacementScale={0.01} />
    </>
  );
};

export default MainContainer;
