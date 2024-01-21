/* eslint-disable react/no-unknown-property */
import { useRef } from "react";
import { useHelper } from "@react-three/drei";
import * as THREE from "three";

import AnimatedStars from "./AnimatedStars";
import Earth from "./scenes/earth/Earth";
import Sun from "./scenes/sun/Sun";
import { Perf } from "r3f-perf";
import Venus from "./scenes/venus/venus";
import Mercury from "./scenes/mercury/Mercury";
import Mars from "./scenes/mars/Mars";
// import CameraPositionLogging from "./helpers/cameraPositionLogging";

const MainContainer = () => {
  const directionalLightRef = useRef();
  const directionalLightRefTwo = useRef();

  useHelper(directionalLightRef, THREE.DirectionalLightHelper, 1, "hotpink");
  useHelper(directionalLightRefTwo, THREE.DirectionalLightHelper, 1, "hotpink");

  return (
    <>
      <Perf />
      {/* <CameraPositionLogging event="mousedown"/> */}
      <AnimatedStars />
      <ambientLight intensity={0.1}/>
      <Sun />
      <Mercury/>
      <Venus/>
      <Earth displacementScale={0.01} />
      <Mars/>
    </>
  );
};

export default MainContainer;
