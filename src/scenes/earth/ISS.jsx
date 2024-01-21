import React, { useCallback, useMemo, useRef } from "react";

import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const Iss = React.memo(() => {
  const issRef = useRef();
  const clockRef = useRef(new THREE.Clock());
  const memoizedISS = useMemo(() => {
    return useGLTF("/assets/ISS_Model/ISS_stationary.gltf");
  }, []);

  const xAxis = 1.3;

  const updateMoonPosition = useCallback(() => {

    // Orbit Rotation
    issRef.current.position.x = Math.sin(clockRef.current.getElapsedTime() * 0.2) * xAxis;
    issRef.current.position.z = Math.cos(clockRef.current.getElapsedTime() * 0.2) * xAxis;
  }, []);

  useFrame(() => {
    updateMoonPosition();
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
});

export default Iss;
