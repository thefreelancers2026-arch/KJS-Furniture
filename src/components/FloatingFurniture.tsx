'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Environment } from '@react-three/drei';
import * as THREE from 'three';

function Sofa({ mouse }: { mouse: React.MutableRefObject<[number, number]> }) {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.getElapsedTime();
    // Smooth floating
    group.current.position.y = Math.sin(t * 0.5) * 0.15;
    // Mouse tracking with smooth lerp
    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      mouse.current[0] * 0.3,
      0.05
    );
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      mouse.current[1] * 0.15 - 0.1,
      0.05
    );
  });

  const goldMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#D4AF37',
    metalness: 0.8,
    roughness: 0.2,
  }), []);

  const velvetMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#2a2a3a',
    metalness: 0.1,
    roughness: 0.8,
  }), []);

  const cushionMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#363649',
    metalness: 0.05,
    roughness: 0.9,
  }), []);

  return (
    <group ref={group} scale={1.2}>
      {/* Sofa base */}
      <mesh position={[0, -0.15, 0]} material={velvetMaterial} castShadow>
        <boxGeometry args={[2.4, 0.4, 1]} />
      </mesh>

      {/* Backrest */}
      <mesh position={[0, 0.35, -0.35]} material={velvetMaterial} castShadow>
        <boxGeometry args={[2.4, 0.7, 0.3]} />
      </mesh>

      {/* Left armrest */}
      <mesh position={[-1.05, 0.1, 0]} material={velvetMaterial} castShadow>
        <boxGeometry args={[0.3, 0.5, 1]} />
      </mesh>

      {/* Right armrest */}
      <mesh position={[1.05, 0.1, 0]} material={velvetMaterial} castShadow>
        <boxGeometry args={[0.3, 0.5, 1]} />
      </mesh>

      {/* Seat cushions */}
      <mesh position={[-0.45, 0.1, 0.05]} material={cushionMaterial} castShadow>
        <boxGeometry args={[0.85, 0.15, 0.8]} />
      </mesh>
      <mesh position={[0.45, 0.1, 0.05]} material={cushionMaterial} castShadow>
        <boxGeometry args={[0.85, 0.15, 0.8]} />
      </mesh>

      {/* Back cushions */}
      <mesh position={[-0.45, 0.4, -0.2]} material={cushionMaterial} castShadow>
        <boxGeometry args={[0.8, 0.45, 0.2]} />
      </mesh>
      <mesh position={[0.45, 0.4, -0.2]} material={cushionMaterial} castShadow>
        <boxGeometry args={[0.8, 0.45, 0.2]} />
      </mesh>

      {/* Gold legs */}
      {[[-1, -0.45, 0.35], [1, -0.45, 0.35], [-1, -0.45, -0.35], [1, -0.45, -0.35]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} material={goldMaterial} castShadow>
          <cylinderGeometry args={[0.03, 0.04, 0.15, 8]} />
        </mesh>
      ))}

      {/* Gold accent strip on base */}
      <mesh position={[0, -0.33, 0.51]} material={goldMaterial}>
        <boxGeometry args={[2.2, 0.03, 0.02]} />
      </mesh>
    </group>
  );
}

function GlowOrbs() {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.rotation.y = t * 0.1;
  });

  return (
    <group ref={ref}>
      {[
        [2.5, 1.2, -1],
        [-2.2, -0.8, 1.5],
        [1.8, -1, 2],
        [-1.5, 1.5, -2],
      ].map((pos, i) => (
        <Float key={i} speed={1.5 + i * 0.5} rotationIntensity={0} floatIntensity={0.5}>
          <mesh position={pos as [number, number, number]}>
            <sphereGeometry args={[0.08 + i * 0.02, 16, 16]} />
            <MeshDistortMaterial
              color="#D4AF37"
              emissive="#D4AF37"
              emissiveIntensity={0.5}
              transparent
              opacity={0.4 + i * 0.1}
              distort={0.3}
              speed={2}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

function Scene() {
  const mouse = useRef<[number, number]>([0, 0]);
  const { size } = useThree();

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current = [
        (e.clientX / size.width) * 2 - 1,
        -(e.clientY / size.height) * 2 + 1,
      ];
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [size]);

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 3]} intensity={1.2} color="#fff8e7" castShadow />
      <pointLight position={[-3, 2, 4]} intensity={0.8} color="#D4AF37" />
      <pointLight position={[3, -1, -2]} intensity={0.3} color="#8888ff" />
      <Sofa mouse={mouse} />
      <GlowOrbs />
      <Environment preset="apartment" />
    </>
  );
}

export default function FloatingFurniture() {
  return (
    <div className="w-full h-full" style={{ minHeight: '400px' }}>
      <Canvas
        camera={{ position: [0, 0.5, 4], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
        dpr={[1, 2]}
      >
        <React.Suspense fallback={null}>
          <Scene />
        </React.Suspense>
      </Canvas>
    </div>
  );
}
