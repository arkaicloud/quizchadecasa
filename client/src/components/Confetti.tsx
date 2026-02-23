import { useEffect, useState } from 'react';

const COLORS = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE'];
const SHAPES = ['circle', 'square', 'triangle'] as const;

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  shape: typeof SHAPES[number];
  rotation: number;
  velocityX: number;
  velocityY: number;
  delay: number;
}

function createParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: 10 + Math.random() * 80,
    y: -10 - Math.random() * 20,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    size: 6 + Math.random() * 8,
    shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
    rotation: Math.random() * 360,
    velocityX: -2 + Math.random() * 4,
    velocityY: 2 + Math.random() * 4,
    delay: Math.random() * 2,
  }));
}

const Confetti = () => {
  const [particles] = useState(() => createParticles(60));

  return (
    <div className="fixed inset-0 pointer-events-none z-[60] overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute confetti-particle"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.shape === 'triangle' ? 0 : p.size,
            backgroundColor: p.shape !== 'triangle' ? p.color : 'transparent',
            borderRadius: p.shape === 'circle' ? '50%' : '2px',
            borderLeft: p.shape === 'triangle' ? `${p.size / 2}px solid transparent` : undefined,
            borderRight: p.shape === 'triangle' ? `${p.size / 2}px solid transparent` : undefined,
            borderBottom: p.shape === 'triangle' ? `${p.size}px solid ${p.color}` : undefined,
            animationDelay: `${p.delay}s`,
            '--drift-x': `${p.velocityX * 40}px`,
            '--rotation': `${720 + Math.random() * 720}deg`,
          } as any}
        />
      ))}
    </div>
  );
};

export default Confetti;
