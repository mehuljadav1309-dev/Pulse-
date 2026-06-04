"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere, RoundedBox } from "@react-three/drei";
import { useRef, useMemo, Suspense } from "react";
import * as THREE from "three";

function FloatingStethoscope() {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.15;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.4) * 0.1;
    }
  });
  return (
    <Float speed={1.4} rotationIntensity={0.4} floatIntensity={1.2}>
      <group ref={ref} position={[-3.2, 1.4, -1]}>
        <mesh>
          <torusGeometry args={[0.6, 0.06, 16, 80, Math.PI * 1.5]} />
          <meshStandardMaterial color="#4F8CFF" metalness={0.85} roughness={0.15} emissive="#4F8CFF" emissiveIntensity={0.3} />
        </mesh>
        <mesh position={[0, -0.6, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.3, 16]} />
          <meshStandardMaterial color="#88AFFF" metalness={0.85} roughness={0.2} />
        </mesh>
        <mesh position={[0, -0.85, 0]}>
          <sphereGeometry args={[0.12, 24, 24]} />
          <meshStandardMaterial color="#A8C4FF" metalness={0.9} roughness={0.1} emissive="#4F8CFF" emissiveIntensity={0.4} />
        </mesh>
        <mesh position={[0, -0.6, 0]} rotation={[0, 0, 0]}>
          <torusGeometry args={[0.12, 0.02, 16, 32]} />
          <meshStandardMaterial color="#FFFFFF" metalness={0.9} roughness={0.05} />
        </mesh>
      </group>
    </Float>
  );
}

function AnatomyHologram() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });
  return (
    <Float speed={1} rotationIntensity={0.3} floatIntensity={0.8}>
      <mesh ref={ref} position={[2.8, 0.2, -2]} scale={0.9}>
        <icosahedronGeometry args={[0.7, 1]} />
        <MeshDistortMaterial
          color="#00E5A8"
          emissive="#00E5A8"
          emissiveIntensity={0.4}
          metalness={0.6}
          roughness={0.2}
          wireframe
          distort={0.4}
          speed={1.4}
        />
      </mesh>
      <mesh position={[2.8, 0.2, -2]} scale={0.7}>
        <icosahedronGeometry args={[0.7, 0]} />
        <meshStandardMaterial
          color="#00E5A8"
          emissive="#00E5A8"
          emissiveIntensity={0.6}
          transparent
          opacity={0.15}
        />
      </mesh>
    </Float>
  );
}

function FloatingCard({ position, color, delay = 0 }: { position: [number, number, number]; color: string; label: string; delay?: number }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.8 + delay) * 0.12;
      ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3 + delay) * 0.08;
    }
  });
  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.6}>
      <group ref={ref} position={position}>
        <RoundedBox args={[1.4, 0.85, 0.05]} radius={0.06} smoothness={4}>
          <meshPhysicalMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.15}
            metalness={0.2}
            roughness={0.4}
            transparent
            opacity={0.92}
          />
        </RoundedBox>
        <mesh position={[0, 0.2, 0.03]}>
          <planeGeometry args={[1.2, 0.06]} />
          <meshBasicMaterial color="#FFFFFF" transparent opacity={0.4} />
        </mesh>
        <mesh position={[0, 0, 0.03]}>
          <planeGeometry args={[0.4, 0.05]} />
          <meshBasicMaterial color="#FFFFFF" transparent opacity={0.6} />
        </mesh>
        <mesh position={[0, -0.15, 0.03]}>
          <planeGeometry args={[0.9, 0.04]} />
          <meshBasicMaterial color="#FFFFFF" transparent opacity={0.3} />
        </mesh>
        <mesh position={[0, -0.3, 0.03]}>
          <planeGeometry args={[0.6, 0.04]} />
          <meshBasicMaterial color="#FFFFFF" transparent opacity={0.25} />
        </mesh>
      </group>
    </Float>
  );
}

function OrbitingDots() {
  const group = useRef<THREE.Group>(null);
  const dotCount = 32;
  const dots = useMemo(() => Array.from({ length: dotCount }, (_, i) => i), []);
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = state.clock.elapsedTime * 0.05;
      group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });
  return (
    <group ref={group}>
      {dots.map((i) => {
        const angle = (i / dotCount) * Math.PI * 2;
        const radius = 4.5 + (i % 3) * 0.4;
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * radius, Math.sin(angle * 2) * 0.5, Math.sin(angle) * radius]}
          >
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshBasicMaterial color={i % 2 === 0 ? "#4F8CFF" : "#00E5A8"} />
          </mesh>
        );
      })}
    </group>
  );
}

function CenterGlow() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) {
      const s = 1 + Math.sin(state.clock.elapsedTime * 0.6) * 0.05;
      ref.current.scale.setScalar(s);
    }
  });
  return (
      <Sphere args={[0.2, 32, 32]} position={[0, 0, -3]}>
      <meshBasicMaterial color="#4F8CFF" transparent opacity={0.5} />
    </Sphere>
  );
}

function HeroScene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} color="#ffffff" />
      <directionalLight position={[-5, -3, 3]} intensity={0.6} color="#4F8CFF" />
      <pointLight position={[0, 0, 2]} intensity={1.5} color="#4F8CFF" distance={8} />
      <pointLight position={[-3, 2, 0]} intensity={0.8} color="#00E5A8" distance={6} />

      <CenterGlow />
      <OrbitingDots />
      <FloatingStethoscope />
      <AnatomyHologram />

      <FloatingCard
        position={[-2.2, 0.4, 0.5]}
        color="#4F8CFF"
        label="NEET PG"
        delay={0}
      />
      <FloatingCard
        position={[2.4, -0.6, 0.2]}
        color="#00E5A8"
        label="AI Tutor"
        delay={1}
      />
      <FloatingCard
        position={[-1.6, -1.4, 0.8]}
        color="#F59E0B"
        label="Mock Test"
        delay={2}
      />
      <FloatingCard
        position={[1.8, 1.2, -0.3]}
        color="#A78BFA"
        label="Viva AI"
        delay={1.5}
      />
      <FloatingCard
        position={[0, 1.8, 0.6]}
        color="#EC4899"
        label="AIR 12"
        delay={0.5}
      />
    </>
  );
}

export function Hero3D() {
  return (
    <div className="absolute inset-0">
      <Canvas
        dpr={[1, 1.6]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 6], fov: 50 }}
      >
        <Suspense fallback={null}>
          <HeroScene />
        </Suspense>
      </Canvas>
    </div>
  );
}
