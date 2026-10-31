
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface DrawParticle {
  x: number;
  y: number;
  tx: number;
  ty: number;
}

@Component({
  selector: 'app-draw',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './draw.component.html',
  styleUrl: './draw.component.css'
})
export class DrawComponent implements OnInit, OnDestroy {

  // Dummy student names
  students: string[] = [
    'TONY',
    'TARMIZI',
    'ELAINE',
    'THILAGA',
    'MALAR',
    'JASON',
    'MICHELLE',
    'DANIEL',
    'SARAH',
    'ANDREW',
    'JESSICA',
    'BRIAN'
  ];

  // Carousel configuration
  readonly radius = 135;

  carouselRotation = 'rotateX(0deg)';
  currentRotation = 0;

  // Draw state
  isDrawing = false;
  selectedIndex = -1;

  winner = '';
  showWinner = false;
  showSpotlight = false;

  particles: DrawParticle[] = [];

  private animationId?: number;
  private winnerTimeout?: ReturnType<typeof setTimeout>;

  ngOnInit(): void {
    this.initRandomPosition();
  }

  // Calculate angle between cards
  get angleStep(): number {
    return this.students.length > 0
      ? 360 / this.students.length
      : 0;
  }

  // Position cards vertically around the 3D wheel
  getCardTransform(index: number): string {

    const angle = index * this.angleStep;
    const radian = angle * Math.PI / 180;

    const y = Math.sin(radian) * this.radius;
    const z = Math.cos(radian) * this.radius;

    return `
      translateY(${y}px)
      translateZ(${z}px)
      rotateX(${-angle}deg)
    `;
  }

  // Initialize carousel
  initRandomPosition(): void {

    this.currentRotation = 0;

    this.carouselRotation = 'rotateX(0deg)';
  }

  // Start lucky draw
  spin(): void {

    if (this.isDrawing || !this.students.length) {
      return;
    }

    this.isDrawing = true;

    this.showWinner = false;
    this.showSpotlight = false;

    this.particles = [];
    this.selectedIndex = -1;

    if (this.winnerTimeout) {
      clearTimeout(this.winnerTimeout);
    }

    // Randomly select winner
    const targetIndex = Math.floor(
      Math.random() * this.students.length
    );

    // Calculate target angle
    const targetRotation =
      targetIndex * this.angleStep;

    const startRotation = this.currentRotation;

    // Normalize current and target angles
    const currentNormalized =
      ((startRotation % 360) + 360) % 360;

    const targetNormalized =
      ((targetRotation % 360) + 360) % 360;

    // Calculate rotation needed to reach target
    const delta =
      (targetNormalized - currentNormalized + 360) % 360;

    // Random 4–5 complete rotations
    const extraSpins =
      4 + Math.floor(Math.random() * 2);

    const endRotation =
      startRotation + extraSpins * 360 + delta;

    // Animation configuration
    const duration = 4500;
    const startTime = performance.now();

    const animate = (now: number): void => {

      const elapsed = now - startTime;

      const progress = Math.min(
        elapsed / duration,
        1
      );

      // Smooth deceleration
      const easeOut =
        1 - Math.pow(1 - progress, 4);

      const currentAngle =
        startRotation +
        (endRotation - startRotation) * easeOut;

      this.carouselRotation =
        `rotateX(${currentAngle}deg)`;

      if (progress < 1) {

        this.animationId =
          requestAnimationFrame(animate);

      } else {

        // Save final rotation
        this.currentRotation = endRotation;

        this.carouselRotation =
          `rotateX(${endRotation}deg)`;

        // Show winner
        this.finishDraw(targetIndex);
      }
    };

    this.animationId =
      requestAnimationFrame(animate);
  }

  // Finish draw and display winner
  finishDraw(index: number): void {

    this.selectedIndex = index;

    this.winner = this.students[index];

    this.showSpotlight = true;
    this.showWinner = true;

    this.isDrawing = false;

    this.createParticles();

    // Hide celebration after 3 seconds
    this.winnerTimeout = setTimeout(() => {

      this.showWinner = false;
      this.showSpotlight = false;

      this.particles = [];

    }, 3000);
  }

  // Generate celebration particles
  createParticles(): void {

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    this.particles = Array.from(
      { length: 40 },
      () => {

        const angle =
          Math.random() * Math.PI * 2;

        const distance =
          150 + Math.random() * 250;

        return {
          x: centerX,
          y: centerY,
          tx: Math.cos(angle) * distance,
          ty: Math.sin(angle) * distance
        };
      }
    );
  }

  // Clean up animations and timers
  ngOnDestroy(): void {

    if (this.animationId !== undefined) {
      cancelAnimationFrame(this.animationId);
    }

    if (this.winnerTimeout) {
      clearTimeout(this.winnerTimeout);
    }
  }
}
