(function() {
  'use strict';

  const CONFIG = {
    particleCount: 80,
    connectionDistance: 150,
    mouseDistance: 200,
    particleSpeed: 0.5,
    colors: [
      'rgba(74, 93, 35, 0.6)',
      'rgba(122, 140, 74, 0.5)',
      'rgba(168, 184, 138, 0.4)',
      'rgba(139, 111, 71, 0.4)'
    ],
    minSize: 2,
    maxSize: 4
  };

  class Particle {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * CONFIG.particleSpeed * 2;
      this.vy = (Math.random() - 0.5) * CONFIG.particleSpeed * 2;
      this.size = Math.random() * (CONFIG.maxSize - CONFIG.minSize) + CONFIG.minSize;
      this.color = CONFIG.colors[Math.floor(Math.random() * CONFIG.colors.length)];
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > this.canvas.width) {
        this.vx *= -1;
      }
      if (this.y < 0 || this.y > this.canvas.height) {
        this.vy *= -1;
      }

      this.x = Math.max(0, Math.min(this.x, this.canvas.width));
      this.y = Math.max(0, Math.min(this.y, this.canvas.height));
    }

    draw() {
      this.ctx.beginPath();
      this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      this.ctx.fillStyle = this.color;
      this.ctx.fill();
    }
  }

  class ParticleNetwork {
    constructor(canvasId) {
      this.canvas = document.getElementById(canvasId);
      if (!this.canvas) {
        console.error('Canvas element not found:', canvasId);
        return;
      }

      this.ctx = this.canvas.getContext('2d');
      this.particles = [];
      this.mouse = { x: null, y: null };

      this.init();
      this.bindEvents();
      this.animate();
    }

    init() {
      this.resize();
      this.createParticles();
    }

    resize() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }

    createParticles() {
      this.particles = [];
      for (let i = 0; i < CONFIG.particleCount; i++) {
        this.particles.push(new Particle(this.canvas));
      }
    }

    bindEvents() {
      window.addEventListener('resize', () => {
        this.resize();
        this.createParticles();
      });

      this.canvas.addEventListener('mousemove', (e) => {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
      });

      this.canvas.addEventListener('mouseleave', () => {
        this.mouse.x = null;
        this.mouse.y = null;
      });
    }

    drawConnections() {
      for (let i = 0; i < this.particles.length; i++) {
        for (let j = i + 1; j < this.particles.length; j++) {
          const dx = this.particles[i].x - this.particles[j].x;
          const dy = this.particles[i].y - this.particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < CONFIG.connectionDistance) {
            const opacity = 1 - (distance / CONFIG.connectionDistance);
            this.ctx.beginPath();
            this.ctx.strokeStyle = `rgba(74, 93, 35, ${opacity * 0.3})`;
            this.ctx.lineWidth = 1;
            this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
            this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
            this.ctx.stroke();
          }
        }
      }

      if (this.mouse.x !== null && this.mouse.y !== null) {
        for (let i = 0; i < this.particles.length; i++) {
          const dx = this.particles[i].x - this.mouse.x;
          const dy = this.particles[i].y - this.mouse.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < CONFIG.mouseDistance) {
            const opacity = 1 - (distance / CONFIG.mouseDistance);
            this.ctx.beginPath();
            this.ctx.strokeStyle = `rgba(74, 93, 35, ${opacity * 0.5})`;
            this.ctx.lineWidth = 1;
            this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
            this.ctx.lineTo(this.mouse.x, this.mouse.y);
            this.ctx.stroke();
          }
        }
      }
    }

    animate() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      this.particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      this.drawConnections();

      requestAnimationFrame(() => this.animate());
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      new ParticleNetwork('particle-canvas');
    });
  } else {
    new ParticleNetwork('particle-canvas');
  }

})();
