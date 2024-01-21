import { Html, OrbitControls, useProgress } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

import MainContainer from "./MainContainer";
import { Suspense } from "react";

function Loader() {
  const { progress } = useProgress();
  return <Html center>{progress} % loaded</Html>;
}

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
        <Suspense fallback={<Loader />}>
          <color attach="background" args={["black"]} />
          <OrbitControls />
          <MainContainer />
        </Suspense>
      </Canvas>
    </>
  );
}

export default App;
