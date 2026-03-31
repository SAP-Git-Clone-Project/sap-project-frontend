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

    const palettes = {
      warm: ['#ff0055', '#f59e0b', '#ea580c', '#f43f5e', '#fbbf24'],
      cold: ['#7c3aed', '#00d2ff', '#06b6d4', '#3b82f6', '#2dd4bf'],
      neon: ['#39ff14', '#b6ff00', '#ffe600', '#ff9f1c', '#ffcc00']
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
        this.homeX = Math.random() * canvas.width;
        this.homeY = Math.random() * canvas.height;
        this.x = this.homeX;
        this.y = this.homeY;

        const baseDim = 100 + 150 + (Math.random() * 50);
        this.radius = baseDim / 2;

        const paletteKeys = Object.keys(palettes);
        const selectedPalette = palettes[paletteKeys[Math.floor(Math.random() * paletteKeys.length)]];
        this.color = selectedPalette[Math.floor(Math.random() * selectedPalette.length)];

        // Physics
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        
        this.gravity = 0.012;
        this.friction = 0.96; 
        this.repelStrength = 0.18; 
        this.returnStrength = 0.0008; 

        // 20% Slower following than before
        this.followSpeed = (0.002 + Math.random() * 0.006) * 0.8;

        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.003;
        
        this.time = Math.random() * 100;
        this.wobbleSpeed = 0.003 + Math.random() * 0.005;
        
        // Random drift movement values
        this.driftAngle = Math.random() * Math.PI * 2;
        this.driftSpeed = 0.02 + Math.random() * 0.03;

        this.numPoints = 6 + Math.floor(Math.random() * 4);
        this.offsets = Array.from({ length: this.numPoints }, () => Math.random() * Math.PI * 2);
      }

      separate(allBlobs) {
        allBlobs.forEach(other => {
          if (other === this) return;
          const dx = this.x - other.x;
          const dy = this.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const minDistance = (this.radius + other.radius) * 0.75;

          if (distance < minDistance) {
            const angle = Math.atan2(dy, dx);
            const force = (minDistance - distance) * this.repelStrength;
            this.vx += Math.cos(angle) * force * 0.04;
            this.vy += Math.sin(angle) * force * 0.04;
          }
        });
      }

      update(allBlobs) {
        this.separate(allBlobs);

        if (!mouse.active) {
          // RANDOM WANDER PHYSICS
          // Slowly shift the drift angle for smooth curving movement
          this.driftAngle += (Math.random() - 0.5) * 0.1;
          this.vx += Math.cos(this.driftAngle) * this.driftSpeed;
          this.vy += Math.sin(this.driftAngle) * this.driftSpeed;

          // Gentle pull to keep them in the general area of their "home"
          this.vx += (this.homeX - this.x) * this.returnStrength;
          this.vy += (this.homeY - this.y) * this.returnStrength;
        } else {
          // MOUSE ATTRACTION (Slower)
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 1000) {
            this.x += dx * this.followSpeed;
            this.y += dy * this.followSpeed;
          }
        }

        this.vy += this.gravity;
        this.vx *= this.friction;
        this.vy *= this.friction;

        this.x += this.vx;
        this.y += this.vy;

        // Rotation speed influenced by velocity
        this.rotation += this.rotationSpeed + (this.vx * 0.01);
        this.time += this.wobbleSpeed;

        // Bounce boundaries
        if (this.y + this.radius > canvas.height) {
          this.y = canvas.height - this.radius;
          this.vy *= -0.5;
        }
        if (this.y - this.radius < 0) {
          this.y = this.radius;
          this.vy *= -0.5;
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
        b.update(blobs);
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
    <div className="relative min-h-screen w-full bg-base-100 overflow-hidden">
      <div className="fixed inset-0 pointer-events-none z-0">
        <canvas
          ref={canvasRef}
          className="block w-full h-full opacity-75 blur-[75px] contrast-[1.4]"
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