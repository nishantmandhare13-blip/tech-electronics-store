import React, { useEffect, useRef } from 'react';
import { sound } from '../audio';

interface Particle {
  x: number;
  y: number;
  color: string;
  size: number;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
}

interface Firework {
  x: number;
  y: number;
  targetY: number;
  color: string;
  size: number;
  speedY: number;
  exploded: boolean;
  sparks: {
    x: number;
    y: number;
    color: string;
    speedX: number;
    speedY: number;
    alpha: number;
    decay: number;
  }[];
}

interface ConfettiEffectProps {
  onComplete?: () => void;
}

export default function ConfettiEffect({ onComplete }: ConfettiEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize canvas to full screen
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Color lists
    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#f43f5e', '#a855f7'];

    // Spawn 150 falling confetti items
    const confettiList: Particle[] = [];
    for (let i = 0; i < 180; i++) {
      confettiList.push({
        x: Math.random() * canvas.width,
        y: Math.random() * -canvas.height - 20,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: Math.random() * 8 + 5,
        speedX: Math.random() * 4 - 2,
        speedY: Math.random() * 5 + 3,
        rotation: Math.random() * 360,
        rotationSpeed: Math.random() * 4 - 2,
        opacity: 1
      });
    }

    // Spawn 5 rising fireworks
    const fireworksList: Firework[] = [];
    for (let i = 0; i < 6; i++) {
      fireworksList.push({
        x: (Math.random() * 0.6 + 0.2) * canvas.width, // Center-ish
        y: canvas.height + Math.random() * 200,
        targetY: (Math.random() * 0.4 + 0.15) * canvas.height,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: 3,
        speedY: -(Math.random() * 6 + 7),
        exploded: false,
        sparks: []
      });
    }

    let animationId: number;
    let startTime = Date.now();

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const elapsed = Date.now() - startTime;
      if (elapsed > 6500) {
        // Complete the animation
        if (onComplete) onComplete();
        return;
      }

      // 1. Draw Confetti Particles
      confettiList.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;

        // Reset if goes off bottom
        if (p.y > canvas.height) {
          p.y = -20;
          p.x = Math.random() * canvas.width;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;

        // Draw ribbon/rectangle particle
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size / 2);
        ctx.restore();
      });

      // 2. Draw Fireworks
      fireworksList.forEach(fw => {
        if (!fw.exploded) {
          fw.y += fw.speedY;

          // Rocket tail trail
          ctx.beginPath();
          ctx.arc(fw.x, fw.y, fw.size, 0, Math.PI * 2);
          ctx.fillStyle = fw.color;
          ctx.fill();

          // Check if rocket reached height
          if (fw.y <= fw.targetY || fw.speedY >= 0) {
            fw.exploded = true;
            sound.playPop(); // Play pop synthesis on explosion!

            // Create 60 sparks
            for (let s = 0; s < 60; s++) {
              const angle = Math.random() * Math.PI * 2;
              const speed = Math.random() * 5 + 1;
              fw.sparks.push({
                x: fw.x,
                y: fw.y,
                color: fw.color,
                speedX: Math.cos(angle) * speed,
                speedY: Math.sin(angle) * speed,
                alpha: 1,
                decay: Math.random() * 0.02 + 0.01
              });
            }
          }
        } else {
          // Draw exploding sparks
          fw.sparks.forEach(sp => {
            sp.x += sp.speedX;
            sp.y += sp.speedY;
            sp.speedY += 0.05; // Gravity pull
            sp.alpha -= sp.decay;

            if (sp.alpha > 0) {
              ctx.save();
              ctx.beginPath();
              ctx.arc(sp.x, sp.y, 2, 0, Math.PI * 2);
              ctx.fillStyle = sp.color;
              ctx.globalAlpha = sp.alpha;
              ctx.fill();
              ctx.restore();
            }
          });
        }
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [onComplete]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[110] pointer-events-none w-screen h-screen"
    />
  );
}
