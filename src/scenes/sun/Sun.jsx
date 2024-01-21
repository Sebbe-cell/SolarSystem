import React, { useRef } from "react";
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import { useFrame } from "@react-three/fiber";

const Sun = React.memo(() => {
  const sunRef = useRef();
  const [sunTexture] = useLoader(TextureLoader, ["/assets/sun_map_8k.jpg"]);

  useFrame(() => {
    sunRef.current.rotation.y -= 0.0003;
  });

  return (
    <mesh ref={sunRef} position={[0, 0, 0]}>
      <sphereGeometry args={[6, 64, 64]} />
      <meshPhongMaterial
        map={sunTexture}
        emissiveMap={sunTexture}
        emissiveIntensity={0.6}
        emissive={0xffffff}
      />
      <pointLight castShadow intensity={3000} position={[0, 0, 0]} />
    </mesh>
  );
});

export default Sun;