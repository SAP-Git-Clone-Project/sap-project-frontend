import React, { useEffect, useRef } from 'react';

const FluidBackground = ({ blobCount = 12, children }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });

    let blobs = [];
    let animationFrameId;
    let mouse = { x: -1500, y: -1500, active: false };

    // --- COLOR PALETTES ---
    const palettes = {
      warm: ['#ff0055', '#f59e0b', '#ea580c', '#f43f5e', '#fbbf24'],
      cold: ['#7c3aed', '#00d2ff', '#06b6d4', '#3b82f6', '#2dd4bf'],
      neon: ['#d946ef', '#8b5cf6', '#0ea5e9']
    };

    const resize = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
      }
    };

    class Blob {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;

        //RANDOM SIZE: Using your formula 100 + 150 + (50 * random)
        // Every blob now calculates this individually
        const baseDim = 100 + 150 + (Math.random() * 50);
        this.radius = baseDim / 2;

        // RANDOM COLORING: Pick a palette style first, then a color from it
        const paletteKeys = Object.keys(palettes);
        const selectedPalette = palettes[paletteKeys[Math.floor(Math.random() * paletteKeys.length)]];
        this.color = selectedPalette[Math.floor(Math.random() * selectedPalette.length)];

        // Physics: Heavy, slow honey-like movement
        this.vx = (Math.random() - 0.5) * 0.15;
        this.vy = (Math.random() - 0.5) * 0.15;
        this.gravity = 0.012; 
        this.friction = 0.985;

        // Unique slow follow speed
        this.followSpeed = 0.002 + Math.random() * 0.006;

        // RANDOM SPIN: Random direction and rotation speed
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.003;

        // RANDOM SHAPE CHANGE: Unique wobble per blob
        this.time = Math.random() * 100;
        this.wobbleSpeed = 0.003 + Math.random() * 0.005;

        // Random complexity (6-9 points)
        this.numPoints = 6 + Math.floor(Math.random() * 4); 
        this.offsets = Array.from({ length: this.numPoints }, () => Math.random() * Math.PI * 2);
      }

      update() {
        this.vy += this.gravity;
        this.vx *= this.friction;
        this.vy *= this.friction;

        this.x += this.vx;
        this.y += this.vy;

        this.rotation += this.rotationSpeed;
        this.time += this.wobbleSpeed;

        if (mouse.active) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 1200) {
            this.x += dx * this.followSpeed;
            this.y += dy * this.followSpeed;
          }
        }

        // Screen Wrap/Bounce
        if (this.y + this.radius > canvas.height) {
          this.y = canvas.height - this.radius;
          this.vy *= -0.4;
        }
        if (this.x < -this.radius) this.x = canvas.width + this.radius;
        if (this.x > canvas.width + this.radius) this.x = -this.radius;
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        const points = [];
        const angleStep = (Math.PI * 2) / this.numPoints;

        for (let i = 0; i < this.numPoints; i++) {
          const angle = i * angleStep;
          
          // Deeper variation for more "random" non-circular shapes
          const variation = Math.sin(this.time + this.offsets[i]) * (this.radius * 0.38);
          const r = this.radius + variation;
          points.push({ x: Math.cos(angle) * r, y: Math.sin(angle) * r });
        }

        ctx.beginPath();
        const fMidX = (points[0].x + points[this.numPoints - 1].x) / 2;
        const fMidY = (points[0].y + points[this.numPoints - 1].y) / 2;
        ctx.moveTo(fMidX, fMidY);

        for (let i = 0; i < this.numPoints; i++) {
          const p1 = points[i];
          const p2 = points[(i + 1) % this.numPoints];
          ctx.quadraticCurveTo(p1.x, p1.y, (p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
        }

        const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, this.radius * 1.6);
        grad.addColorStop(0, this.color);
        grad.addColorStop(1, 'transparent');

        ctx.fillStyle = grad;
        ctx.fill();
        ctx.restore();
      }
    }

    const init = () => {
      resize();
      blobs = Array.from({ length: blobCount }, () => new Blob());
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      blobs.forEach(b => {
        b.update();
        b.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    const mm = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };
    const ml = () => { mouse.active = false; };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', mm);
    window.addEventListener('mouseleave', ml);

    init();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', mm);
      window.removeEventListener('mouseleave', ml);
      cancelAnimationFrame(animationFrameId);
    };
  }, [blobCount]);

  return (
    <div className="relative min-h-screen w-full bg-base-100 text-base-content overflow-hidden transition-colors duration-500">
      <div className="fixed inset-0 pointer-events-none z-0">
        <canvas
          ref={canvasRef}
          className="block w-full h-full opacity-75 blur-[75px] contrast-[1.4] brightness-[0.9]"
        />
      </div>

      <div className="relative z-10 w-full min-h-screen">
        <main className="p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default FluidBackground;