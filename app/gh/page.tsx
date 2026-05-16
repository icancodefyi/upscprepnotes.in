"use client";

import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
} from "@react-three/drei";

function Graph() {
  // Simulated contribution data
  const weeks = 52;
  const days = 7;

  const data = Array.from({ length: weeks * days }, () =>
    Math.floor(Math.random() * 10) + 1
  );

  return (
    <group position={[-18, 0, -5]}>
      {data.map((value, i) => {
        const x = Math.floor(i / days);
        const z = i % days;

        const height = value * 0.35;

        return (
          <mesh
            key={i}
            position={[x * 0.55, height / 2, z * 0.55]}
          >
            <boxGeometry args={[0.42, height, 0.42]} />

            <meshStandardMaterial
              color="#39ff14"
              emissive="#39ff14"
              emissiveIntensity={0.7}
              roughness={0.25}
              metalness={0.4}
            />
          </mesh>
        );
      })}
    </group>
  );
}

export default function Page() {
  return (
    <div className="w-screen h-screen bg-black">
      <Canvas
        camera={{
          position: [8, 8, 18],
          fov: 45,
        }}
      >
        {/* Background */}
        <color attach="background" args={["#000000"]} />

        {/* Fog */}
        <fog attach="fog" args={["#000000", 10, 35]} />

        {/* Lighting */}
        <ambientLight intensity={0.5} />

        <directionalLight
          position={[5, 10, 5]}
          intensity={2}
          color="#aaffaa"
        />

        <pointLight
          position={[10, 15, 10]}
          intensity={3}
          color="#39ff14"
        />

        {/* Graph */}
        <Graph />

        {/* Environment reflections */}
        <Environment preset="night" />

        {/* Controls */}
        <OrbitControls
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.4}
          minDistance={10}
          maxDistance={30}
        />
      </Canvas>

      {/* Overlay */}
      <div className="absolute bottom-10 left-10">
        <h1 className="text-green-400 text-5xl font-bold tracking-[0.3em]">
          ZAID.EXE
        </h1>

        <p className="text-green-500/70 mt-3 text-sm tracking-[0.2em]">
          GITHUB CONTRIBUTION MATRIX
        </p>
      </div>
    </div>
  );
}