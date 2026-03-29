import { useEffect, useRef } from 'react';

const BackgroundEffects = ({ length = 12 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });

    let blobs = [];
    let animationFrameId;

    const getColor = (varName) => {
      const temp = document.createElement('div');
      temp.style.color = `oklch(var(${varName}))`;
      document.body.appendChild(temp);
      const computed = getComputedStyle(temp).color;
      document.body.removeChild(temp);
      return computed;
    };

    const primary = getColor('--p');
    const secondary = getColor('--s');
    const accent = getColor('--a');
    const customIndigo = '#6366F1';
    const customViolet = '#8B5CF6';
    const customTeal = '#14B8A6';

    const weightedColors = [
      primary, primary, primary, primary, primary, primary, primary,
      accent, accent, accent, accent, 
      secondary, secondary, secondary, secondary,
      '#FF4D00', '#FF8A00', '#FB923C', '#E11D48', '#F59E0B', '#EA580C', '#FB923C', '#D946EF',
      customIndigo, customIndigo, customViolet, customViolet, customTeal, customTeal,
      '#06B6D4', '#3B82F6', '#2DD4BF', '#06B6D4', '#3B82F6', '#2DD4BF', '#6366F1', '#8B5CF6', '#0EA5E9'
    ];

    const cssColorToRgba = (cssColor, alpha = 1) => {
      const offscreen = document.createElement('canvas');
      offscreen.width = offscreen.height = 1;
      const offCtx = offscreen.getContext('2d', { willReadFrequently: true });
      offCtx.fillStyle = cssColor;
      offCtx.fillRect(0, 0, 1, 1);
      const data = offCtx.getImageData(0, 0, 1, 1).data;
      return `rgba(${data[0]}, ${data[1]}, ${data[2]}, ${alpha})`;
    };

    // --- DYNAMIC RESIZE FIX ---
    const resize = () => {
      // Look at the parent container's actual height, not the window
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
      }
    };

    resize();
    window.addEventListener('resize', resize);
    
    // Also watch for content changes (if sections expand)
    const resizeObserver = new ResizeObserver(resize);
    if (canvas.parentElement) resizeObserver.observe(canvas.parentElement);

    class Blob {
      constructor() {
        this.reset();
        this.time = Math.random() * 150;
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.radius = 120 + Math.random() * 150;
        this.vx = (Math.random() - 0.5) * 0.9;
        this.vy = (Math.random() - 0.5) * 0.8;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.008;
        this.wobbleSpeed = 0.006 + Math.random() * 0.01;
        this.color = weightedColors[Math.floor(Math.random() * weightedColors.length)];
        this.alpha = 0.4 + Math.random() * 0.15;
        this.numPoints = 5;
        this.offsets = Array.from({ length: this.numPoints }, () => Math.random() * Math.PI * 2);
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.rotation += this.rotationSpeed;
        this.time += this.wobbleSpeed;

        const pad = this.radius * 2;
        if (this.x < -pad) this.x = canvas.width + pad;
        if (this.x > canvas.width + pad) this.x = -pad;
        if (this.y < -pad) this.y = canvas.height + pad;
        if (this.y > canvas.height + pad) this.y = -pad;
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.filter = 'blur(60px)'; // Increased blur slightly for smoothness
        ctx.fillStyle = cssColorToRgba(this.color, this.alpha);

        const points = [];
        const angleStep = (Math.PI * 2) / this.numPoints;
        for (let i = 0; i < this.numPoints; i++) {
          const angle = i * angleStep;
          const variation = Math.sin(this.time + this.offsets[i]) * 55;
          const r = this.radius + variation;
          points.push({ x: Math.cos(angle) * r, y: Math.sin(angle) * r });
        }

        ctx.beginPath();
        ctx.moveTo((points[0].x + points[this.numPoints - 1].x) / 2, (points[0].y + points[this.numPoints - 1].y) / 2);
        for (let i = 0; i < this.numPoints; i++) {
          const p1 = points[i];
          const p2 = points[(i + 1) % this.numPoints];
          ctx.quadraticCurveTo(p1.x, p1.y, (p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
        }
        ctx.fill();
        ctx.restore();
      }
    }

    blobs = Array.from({ length }, () => new Blob());

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      blobs.forEach((blob) => {
        blob.update();
        blob.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      resizeObserver.disconnect();
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [length]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-transparent">
      <canvas
        ref={canvasRef}
        className="block w-full h-full contrast-[1.1] brightness-[1.02]"
      />
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none" />
    </div>
  );
};

export default BackgroundEffects;