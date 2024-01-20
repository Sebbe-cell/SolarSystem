import { Stars } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

const AnimatedStars = () => {
  const starsRef = useRef();

  // useFrame is a Fiber hook that lets you execute code on every frame of Fiber's render loop.
  useFrame(() => {
    starsRef.current.rotation.x += 0.00001
    starsRef.current.rotation.y += 0.00001
    starsRef.current.rotation.z += 0.00001
  })

  return <Stars ref={starsRef} />;
};

export default AnimatedStars;
