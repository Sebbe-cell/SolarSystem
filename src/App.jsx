/* eslint-disable react/no-unknown-property */

import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

import MainContainer from "./MainContainer";

function App() {
  // Read more: https://threejs.org/docs/#manual/en/introduction/Creating-a-scene
  // https://github.com/pmndrs/drei#stars
  // Canvas elements: Scene Camera Renderer

  return (
    <>
      <Canvas
        shadows
        camera={{ fov: 75, near: 0.1, far: 1000, position: [16, 8.5, 19.5] }}
      >
        <color attach="background" args={["black"]} />
        <OrbitControls />
        <MainContainer />
      </Canvas>
    </>
  );
}

export default App;
