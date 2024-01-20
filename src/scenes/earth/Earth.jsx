/* eslint-disable react/prop-types */
/* eslint-disable react/no-unknown-property */

import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import Moon from "./Moon";
import Iss from "./ISS";

const Earth = ({ displacementScale }) => {
  const [earthTexture, earthNormalMap, earthSpecularMap, earthDisplacementMap] =
    useTexture([
      "/assets/earth_8k.jpg",
      "/assets/earth-normal_2k.jpg",
      "/assets/earth_specular_map_2k.jpg",
      "/assets/earth_displacement_map.jpg",
    ]);

  const earthRef = useRef();

  // useFrame is a Fiber hook that lets you execute code on every frame of Fiber's render loop.
  useFrame(() => {
    earthRef.current.rotation.y += 0.0003;
  });

  return (
    // Read more: https://docs.pmnd.rs/react-three-fiber/getting-started/your-first-scene#adding-a-mesh-component
    // https://www.solarsystemscope.com/textures/
    // Sphere geometry -> Radius, X-axis, Y-axis
    <group>
      <mesh receiveShadow ref={earthRef}>
        <sphereGeometry args={[1, 128, 128]} />
        {/* <meshStandardMaterial
        map={earthTexture}
        normalMap={earthNormalMap}
        specularMap={earthSpecularMap}
      /> */}
        <meshPhongMaterial
          map={earthTexture}
          normalMap={earthNormalMap}
          specularMap={earthSpecularMap}
          displacementMap={earthDisplacementMap}
          displacementScale={displacementScale}
          shininess={10}
        />
      </mesh>
      <Iss/>
      <Moon />
    </group>
  );
};

export default Earth;
