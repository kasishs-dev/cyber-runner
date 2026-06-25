interface ObstacleProps {
  position: [number, number, number];
}

export default function Obstacle({ position }: ObstacleProps) {
  return (
    <mesh position={position} castShadow>
      <boxGeometry args={[3, 1.5, 1]} />
      <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.5} />
    </mesh>
  );
}
