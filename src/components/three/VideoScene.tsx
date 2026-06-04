"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, RoundedBox } from "@react-three/drei";
import { useRef, Suspense } from "react";
import * as THREE from "three";

function Laptop() {
  const group = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.15;
    }
  });

  return (
    <group ref={group} position={[0, -0.3, 0]}>
      {/* Base */}
      <RoundedBox args={[4, 0.18, 2.8]} radius={0.05} position={[0, -0.85, 0]}>
        <meshPhysicalMaterial color="#1a1a1f" metalness={0.85} roughness={0.25} />
      </RoundedBox>
      {/* Base highlight */}
      <mesh position={[0, -0.95, 1.4]}>
        <boxGeometry args={[0.5, 0.02, 0.05]} />
        <meshStandardMaterial color="#4F8CFF" emissive="#4F8CFF" emissiveIntensity={0.6} />
      </mesh>

      {/* Screen */}
      <group position={[0, 0, -1.35]} rotation={[-0.18, 0, 0]}>
        <RoundedBox args={[4, 2.5, 0.08]} radius={0.04}>
          <meshPhysicalMaterial color="#0a0a0a" metalness={0.7} roughness={0.3} />
        </RoundedBox>

        {/* Screen content */}
        <mesh position={[0, 0, 0.05]}>
          <planeGeometry args={[3.85, 2.35]} />
          <meshBasicMaterial color="#0a0e1a" />
        </mesh>

        {/* Video player UI on screen */}
        <ScreenContent />
      </group>
    </group>
  );
}

function ScreenContent() {
  return (
    <group position={[0, 0, 0.06]}>
      {/* Top bar */}
      <mesh position={[0, 1.05, 0]}>
        <planeGeometry args={[3.7, 0.18]} />
        <meshBasicMaterial color="#000" transparent opacity={0.5} />
      </mesh>
      {/* Red record dot */}
      <mesh position={[-1.7, 1.05, 0.01]}>
        <circleGeometry args={[0.05, 16]} />
        <meshBasicMaterial color="#EF4444" />
      </mesh>
      {/* Center text bar (title) */}
      <mesh position={[0, 0.7, 0.01]}>
        <planeGeometry args={[2.8, 0.1]} />
        <meshBasicMaterial color="#FFFFFF" transparent opacity={0.9} />
      </mesh>
      <mesh position={[0, 0.5, 0.01]}>
        <planeGeometry args={[1.8, 0.06]} />
        <meshBasicMaterial color="#FFFFFF" transparent opacity={0.4} />
      </mesh>

      {/* Surgery illustration (geometric) */}
      <mesh position={[0, -0.2, 0.01]}>
        <circleGeometry args={[0.7, 32]} />
        <meshBasicMaterial color="#1a3050" transparent opacity={0.8} />
      </mesh>
      <mesh position={[0, -0.2, 0.02]}>
        <ringGeometry args={[0.6, 0.7, 32]} />
        <meshBasicMaterial color="#4F8CFF" transparent opacity={0.5} />
      </mesh>
      <mesh position={[0, -0.2, 0.03]}>
        <ringGeometry args={[0.3, 0.35, 32]} />
        <meshBasicMaterial color="#00E5A8" transparent opacity={0.6} />
      </mesh>

      {/* Annotation tags */}
      <mesh position={[-1.2, 0.4, 0.01]}>
        <planeGeometry args={[0.8, 0.18]} />
        <meshBasicMaterial color="#4F8CFF" transparent opacity={0.85} />
      </mesh>
      <mesh position={[1.2, -0.6, 0.01]}>
        <planeGeometry args={[0.9, 0.18]} />
        <meshBasicMaterial color="#00E5A8" transparent opacity={0.85} />
      </mesh>

      {/* Play button center */}
      <mesh position={[0, -0.2, 0.04]}>
        <circleGeometry args={[0.25, 32]} />
        <meshBasicMaterial color="#FFFFFF" transparent opacity={0.95} />
      </mesh>
      <mesh position={[-0.04, -0.2, 0.05]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.1, 0.18, 3]} />
        <meshBasicMaterial color="#0a0a0a" />
      </mesh>

      {/* Progress bar */}
      <mesh position={[0, -0.95, 0.01]}>
        <planeGeometry args={[3.4, 0.04]} />
        <meshBasicMaterial color="#222" />
      </mesh>
      <mesh position={[-0.7, -0.95, 0.02]}>
        <planeGeometry args={[2.0, 0.04]} />
        <meshBasicMaterial color="#4F8CFF" />
      </mesh>
      <mesh position={[-0.7, -0.95, 0.03]}>
        <circleGeometry args={[0.05, 16]} />
        <meshBasicMaterial color="#FFFFFF" />
      </mesh>

      {/* Time text bars */}
      <mesh position={[-1.55, -0.95, 0.02]}>
        <planeGeometry args={[0.2, 0.04]} />
        <meshBasicMaterial color="#FFFFFF" transparent opacity={0.7} />
      </mesh>
      <mesh position={[1.55, -0.95, 0.02]}>
        <planeGeometry args={[0.2, 0.04]} />
        <meshBasicMaterial color="#FFFFFF" transparent opacity={0.7} />
      </mesh>

      {/* Bottom controls */}
      <mesh position={[-1.5, -1.15, 0.01]}>
        <circleGeometry args={[0.06, 16]} />
        <meshBasicMaterial color="#FFFFFF" transparent opacity={0.6} />
      </mesh>
      <mesh position={[-1.3, -1.15, 0.01]}>
        <circleGeometry args={[0.06, 16]} />
        <meshBasicMaterial color="#FFFFFF" transparent opacity={0.6} />
      </mesh>
      <mesh position={[1.5, -1.15, 0.01]}>
        <circleGeometry args={[0.06, 16]} />
        <meshBasicMaterial color="#FFFFFF" transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

function FloatingElements() {
  return (
    <>
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.6}>
        <mesh position={[-3, 1.5, -1]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color="#4F8CFF" emissive="#4F8CFF" emissiveIntensity={1} />
        </mesh>
      </Float>
      <Float speed={1.3} rotationIntensity={0.3} floatIntensity={0.5}>
        <mesh position={[3, -1, 0]}>
          <octahedronGeometry args={[0.18, 0]} />
          <meshStandardMaterial color="#00E5A8" emissive="#00E5A8" emissiveIntensity={0.7} metalness={0.8} roughness={0.2} />
        </mesh>
      </Float>
      <Float speed={1.7} rotationIntensity={0.2} floatIntensity={0.4}>
        <mesh position={[2.8, 1.2, -0.5]}>
          <torusGeometry args={[0.12, 0.04, 16, 32]} />
          <meshStandardMaterial color="#F59E0B" emissive="#F59E0B" emissiveIntensity={0.8} metalness={0.7} roughness={0.2} />
        </mesh>
      </Float>
    </>
  );
}

export function VideoScene() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0.4, 5.5], fov: 38 }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 6, 5]} intensity={1.3} color="#ffffff" />
        <directionalLight position={[-4, 3, 2]} intensity={0.7} color="#4F8CFF" />
        <pointLight position={[0, 1, 3]} intensity={1.2} color="#4F8CFF" distance={6} />
        <pointLight position={[-2, -1, 2]} intensity={0.6} color="#00E5A8" distance={5} />

        <Laptop />
        <FloatingElements />
      </Suspense>
    </Canvas>
  );
}
