/* eslint-disable no-unused-vars */
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

import MainContainer from "./MainContainer";
import { Perf } from "r3f-perf";

function App() {
  // Read more: https://threejs.org/docs/#manual/en/introduction/Creating-a-scene
  // https://github.com/pmndrs/drei#stars
  // Canvas elements: Scene Camera Renderer

  return (
    <>
      <Canvas shadows camera={{ fov: 75, near: 0.1, far: 1000, position: [0, 3, 3] }}>
        {/* <Perf/> */}
        <OrbitControls />
        <MainContainer />
      </Canvas>
    </>
  );
}

export default App;
