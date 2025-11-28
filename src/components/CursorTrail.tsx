import { useEffect, useState } from 'react';

interface TrailDot {
  x: number;
  y: number;
  id: number;
  color: string;
}

const gemstoneColors = ['#C9A961', '#50C878', '#0F52BA', '#E0115F', '#B9F2FF', '#9966CC'];

export default function CursorTrail() {
  const [dots, setDots] = useState<TrailDot[]>([]);

  useEffect(() => {
    let lastTime = Date.now();
    let dotId = 0;
    let colorIndex = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastTime < 30) return;
      lastTime = now;

      const newDot: TrailDot = {
        x: e.clientX,
        y: e.clientY,
        id: dotId++,
        color: gemstoneColors[colorIndex],
      };

      colorIndex = (colorIndex + 1) % gemstoneColors.length;

      setDots((prev) => [...prev.slice(-12), newDot]);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {dots.map((dot, index) => (
        <div
          key={dot.id}
          className="absolute rounded-full"
          style={{
            left: dot.x,
            top: dot.y,
            width: `${6 + index * 0.5}px`,
            height: `${6 + index * 0.5}px`,
            transform: 'translate(-50%, -50%)',
            backgroundColor: dot.color,
            opacity: (index / dots.length) * 0.6,
            transition: 'opacity 0.3s ease-out',
            boxShadow: `0 0 ${8 + index}px ${dot.color}`,
          }}
        />
      ))}
    </div>
  );
}
