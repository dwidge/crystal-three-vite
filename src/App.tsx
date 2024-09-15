import { useState, useEffect, useRef } from "react";
import { Canvas, Euler } from "@react-three/fiber";
import { Box, OrbitControls } from "@react-three/drei";
import "./App.css";

function App() {
  const [rotation, setRotation] = useState<Euler>([0, 0, 0]);
  const rotationSpeed = useRef<number>(1);
  const [timeoutId, setTimeoutId] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);
  const lastTime = useRef<number | null>(null);

  const animate = (time: number) => {
    if (lastTime.current !== null) {
      const delta = time - lastTime.current;
      if (rotationSpeed.current > 0) {
        setRotation((prev) => [
          (prev as number[])[0],
          (prev as number[])[1] + delta * 0.001 * rotationSpeed.current,
          (prev as number[])[2],
        ]);
      }
    }
    lastTime.current = time;
    requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestAnimationFrame(animate);
  }, []);

  const pauseRotation = () => {
    rotationSpeed.current = 0;
  };

  const resumeRotationAfterDelay = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    const id = setTimeout(() => {
      rotationSpeed.current = 1;
      setTimeoutId(null);
    }, 3000);
    setTimeoutId(id);
  };

  return (
    <div
      style={{
        display: "flex",
        flex: 1,
        flexDirection: "column",
        width: "100%",
        height: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          flex: 2,
          alignItems: "center",
          justifyContent: "center",
          background: "grey",
        }}
      >
        Hi
      </div>
      <Canvas style={{ flex: 1 }}>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Box args={[1, 1, 1]} rotation={rotation}>
          <meshStandardMaterial attach="material" color="orange" />
        </Box>
        <OrbitControls
          onStart={pauseRotation}
          onEnd={resumeRotationAfterDelay}
        />
      </Canvas>
    </div>
  );
}

export default App;
