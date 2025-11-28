import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  facets: number;
  rotation: number;
  rotationSpeed: number;
}

const gemstoneColors = [
  { r: 201, g: 169, b: 97, name: 'gold' },
  { r: 80, g: 200, b: 120, name: 'emerald' },
  { r: 15, g: 82, b: 186, name: 'sapphire' },
  { r: 224, g: 17, b: 95, name: 'ruby' },
  { r: 185, g: 242, b: 255, name: 'diamond' },
  { r: 153, g: 102, b: 204, name: 'amethyst' },
];

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Particle[] = [];
    const particleCount = 40;

    for (let i = 0; i < particleCount; i++) {
      const color = gemstoneColors[Math.floor(Math.random() * gemstoneColors.length)];
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 3 + 2,
        opacity: Math.random() * 0.4 + 0.3,
        color: `rgba(${color.r}, ${color.g}, ${color.b}`,
        facets: Math.floor(Math.random() * 3) + 6,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
      });
    }

    let mouseX = -1000;
    let mouseY = -1000;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const drawCrystal = (particle: Particle) => {
      ctx.save();
      ctx.translate(particle.x, particle.y);
      ctx.rotate(particle.rotation);

      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, particle.size * 4);
      gradient.addColorStop(0, `${particle.color}, ${particle.opacity})`);
      gradient.addColorStop(0.5, `${particle.color}, ${particle.opacity * 0.6})`);
      gradient.addColorStop(1, `${particle.color}, 0)`);

      ctx.fillStyle = gradient;
      ctx.beginPath();
      for (let i = 0; i < particle.facets; i++) {
        const angle = (Math.PI * 2 * i) / particle.facets;
        const x = Math.cos(angle) * particle.size * 2;
        const y = Math.sin(angle) * particle.size * 2;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = `${particle.color}, ${particle.opacity * 0.8})`;
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        const dx = mouseX - particle.x;
        const dy = mouseY - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 200 && mouseX > 0) {
          const angle = Math.atan2(dy, dx);
          const force = (200 - distance) / 200;
          particle.vx += Math.cos(angle) * force * 0.1;
          particle.vy += Math.sin(angle) * force * 0.1;
        }

        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.rotation += particle.rotationSpeed;

        particle.vx *= 0.99;
        particle.vy *= 0.99;

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        particle.x = Math.max(0, Math.min(canvas.width, particle.x));
        particle.y = Math.max(0, Math.min(canvas.height, particle.y));

        drawCrystal(particle);
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.5 }}
    />
  );
}
