/* eslint-disable react/display-name */
/* eslint-disable react/no-unknown-property */

import React, { useRef } from "react";
import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

const Sun = React.memo(() => {
  const sunRef = useRef();
  const [sunTexture] = useTexture(["/assets/sun_map_8k.jpg"]);

  useFrame(() => {
    sunRef.current.rotation.y -= 0.0003;
  });

  return (
    <mesh ref={sunRef} position={[0, 0, 0]}>
      <sphereGeometry args={[4, 64, 64]} />
      <meshPhongMaterial
        map={sunTexture}
        emissiveMap={sunTexture}
        emissiveIntensity={0.6}
        emissive={0xffffff}
      />
      <pointLight castShadow intensity={3000}/>
    </mesh>
  );
});

export default Sun;
