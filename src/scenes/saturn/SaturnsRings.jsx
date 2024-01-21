import React, { useRef } from "react";

import { useTexture } from "@react-three/drei";
import * as THREE from "three";

const SaturnsRings = React.memo(() => {
  const [ringTexture] = useTexture(["/assets/saturn_ring_8k.png"]);
  ringTexture.rotation = Math.PI / 2;
  const xAxis = 4.3;
  const ringSize = 1.2;
  const ringRef = useRef();

  // Set the inclination angle of Saturn's rings
  const ringInclination = THREE.MathUtils.degToRad(27);

  return (
    <mesh
      ref={ringRef}
      position={[0, 0, 0]}
      rotation={[Math.PI / 2, ringInclination, 0]}
    >
      <torusGeometry args={[xAxis, ringSize, 2.4, 1000]} />
      <meshPhongMaterial
        map={ringTexture}
        opacity={9}
        color={new THREE.Color(2.2, 1.4, 0.01)}
      />
    </mesh>
  );
});

export default SaturnsRings;
