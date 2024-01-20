/* eslint-disable react/no-unknown-property */
/* eslint-disable react-hooks/rules-of-hooks */
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";

const Iss = () => {
  const issRef = useRef();
  const memoizedISS = useMemo(() => {
    return useGLTF("/assets/ISS_Model/ISS_stationary.gltf");
  }, []);
  const xAxis = 1.3;

  useFrame(({ clock }) => {
    // Orbit Rotation
    issRef.current.position.x = Math.sin(clock.getElapsedTime() * 0.2) * xAxis;
    issRef.current.position.z = Math.cos(clock.getElapsedTime() * 0.2) * xAxis;
  });

  // https://science.nasa.gov/resource/international-space-station-3d-model/
  // https://gltf.report/ - Optimize 3d models
  return (
    <mesh>
      <primitive
        ref={issRef}
        object={memoizedISS.scene}
        position={[xAxis, 0, 0]}
        scale={0.002}
      />
    </mesh>
  );
};

export default Iss;
