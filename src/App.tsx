import { useState, useEffect, useRef } from "react";
import { Canvas, Euler } from "@react-three/fiber";
import { Box, OrbitControls } from "@react-three/drei";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  const [rotation, setRotation] = useState<Euler>([0, 0, 0]);
  const rotationSpeed = useRef<number>(1);
  const [timeoutId, setTimeoutId] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);

  const animate = () => {
    if (rotationSpeed.current > 0) {
      setRotation([0, Date.now() * 0.001 * rotationSpeed.current, 0]);
    }
    requestAnimationFrame(animate);
  };

  useEffect(() => {
    animate();
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
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <Canvas>
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
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
