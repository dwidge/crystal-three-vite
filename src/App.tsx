import { useState, useEffect, useRef } from "react";
import { Canvas, Euler, useLoader } from "@react-three/fiber";
import { Box, OrbitControls, Environment, Plane } from "@react-three/drei";
import { TextureLoader, Fog, DoubleSide } from "three";
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

  // Load image texture for embedding into the cube
  const texture = useLoader(TextureLoader, "image.png"); // replace with actual image path

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
      <Canvas
        style={{ flex: 1, background: "#333" }}
        camera={{ position: [0, 1, 5] }}
        onCreated={({ scene }) => {
          scene.fog = new Fog("#333", 5, 15); // Add fog with color and distance
        }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, 10, 10]} intensity={1} />
        <pointLight position={[0, 10, -10]} intensity={1} />

        {/* Ground Plane for better reflections */}
        <Plane
          args={[1000, 1000]}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -2, 0]}
        >
          <meshStandardMaterial color="#444" />
        </Plane>

        {/* Rotating Box with Glass-like Material */}
        <Box args={[1, 1, 1]} rotation={rotation}>
          <meshPhysicalMaterial
            attach="material"
            color="white"
            transmission={1} // Makes it transparent
            thickness={0.5}
            ior={1.5} // Index of Refraction (glass typically around 1.5)
            roughness={0} // Smooth surface for glass
            metalness={0} // Glass is non-metallic
            reflectivity={0.5} // High reflectivity for glass-like appearance
            transparent
            depthWrite={false} // Ensures the cube doesn't obscure the inner image
            clearcoat={1} // Optional: Increase clearcoat for more sheen
            clearcoatRoughness={0.1} // Optional: Smooth the clearcoat
          />
          {/* Embedded Image inside the glass cube */}
          <mesh position={[0, 0, 0]} scale={[0.8, 0.8, 0.8]}>
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial
              map={texture}
              side={DoubleSide} // Makes the image double-sided
            />
          </mesh>
        </Box>

        <OrbitControls
          onStart={pauseRotation}
          onEnd={resumeRotationAfterDelay}
        />

        {/* Environment for Reflections */}
        <Environment preset="warehouse" />
      </Canvas>
    </div>
  );
}

export default App;
