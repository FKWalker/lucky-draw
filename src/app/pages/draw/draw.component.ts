
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from 'app/shared/services/supabase.service';
import { ParticipantService } from 'app/shared/services/participant.service';
import { EventService } from 'app/shared/services/event.service';
import { ActivatedRoute, Router } from '@angular/router';

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

  participants: any[] = [];

  visibleParticipants: any[] = [];

  // Carousel configuration
  readonly radius = 135;

  carouselRotation = 'rotateX(0deg)';
  currentRotation = 0;

  // Draw state
  isDrawing = false;
  isDone = false;
  isPending = false;
  selectedIndex = -1;

  winner = '';
  showWinner = false;
  showSpotlight = false;

  particles: DrawParticle[] = [];

  private animationId?: number;
  private winnerTimeout?: ReturnType<typeof setTimeout>;

  eventId: any;
  eventCode: any;
  drawChannel: any;

  draws: { drawName: string | number; number: string | number; drew: boolean, winner: string | number }[] = [];
  drawCount: number = 0;
  linkEvent: number = 0;

  constructor(private supabaseService: SupabaseService,
    private participantService: ParticipantService,
    private eventService: EventService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // 1. Grab the ID from the route parameter (:id)
    this.eventId = this.route.snapshot.paramMap.get('id');
    if (this.eventId) {
      this.fetchEventDetails(this.eventId);
      this.loadParticipants();
      this.drawChannel = this.supabaseService.joinDrawChannel(this.eventId, () => {
        // Empty callback because this admin page only sends updates, it doesn't listen to others
      });
    }
  }

  async loadParticipants(): Promise<void> {
    try {
      this.participants =
        await this.participantService.getEligibleParticipants(this.eventId);

      console.log('Eligible participants:', this.participants);
      console.log('Total participants:', this.participants.length);

      await this.updateVisibleParticipants();

    } catch (error) {

      console.error('Failed to load participants:', error);

      this.participants = [];
      this.visibleParticipants = [];

    }
    
  }

  async fetchEventDetails(id: string) {
    try {
      // 2. Fetch the data from Supabase
      const data = await this.eventService.getEventById(id);
      if (data.link_event != 0){
        const previousData = await this.eventService.getEventById(data.link_event);
        let draws = previousData.draw_setup;
        let drawCount = 0;
        this.isPending = true;
        if (draws.length > 0) {
          for (let draw of draws) {
            if (draw.drew) {
              drawCount++;
            }
          }
          if (drawCount == draws.length) {
            this.isPending = false;
          }
        }
      }

      if (!data) {
        console.warn('Event not found, redirecting...');
        this.router.navigate(['/event/list']); // 👈 Adjust this path to match your actual event listing route
        return;
      }
      this.draws = data.draw_setup;
      let drawCount = 0;
      if (this.draws.length > 0) {
        for (let draw of this.draws) {
          if (draw.drew) {
            drawCount++;
          }
        }
        if (drawCount == this.draws.length) {
          this.isDone = true;
        }
      }

      this.drawCount = drawCount;

      this.eventCode = data.event_code;

    } catch (error) {
      console.error('Failed to load event details:', error);
      this.router.navigate(['event/listing']); // 👈 Adjust this path to match your actual event listing route
      return;
    }
  }

  async updateVisibleParticipants() {
    if (this.participants.length === 0) {
      this.visibleParticipants = [];
      return;
    }

    // Shuffle participants using Fisher-Yates algorithm
    const shuffled = [...this.participants];

    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // Pick up to 12 participants with unique names
    const uniqueNames = new Set<string>();

    this.visibleParticipants = shuffled.filter(participant => {
      const name = participant.name?.trim().toLowerCase();

      if (!name || uniqueNames.has(name)) {
        return false;
      }

      uniqueNames.add(name);
      return true;
    }).slice(0, 12);

    this.initRandomPosition();
  }

  // Angle between each student card
  get angleStep(): number {
    return this.visibleParticipants.length > 0
      ? 360 / this.visibleParticipants.length
      : 0;
  }

  // Position cards vertically around the 3D circle
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

  // Set initial carousel position
  initRandomPosition(): void {
    if (!this.visibleParticipants.length) return;

    const randomIndex = Math.floor(
      Math.random() * this.visibleParticipants.length
    );

    this.currentRotation = randomIndex * this.angleStep;
    this.carouselRotation = `rotateX(${this.currentRotation}deg)`;
  }

  // Start drawing
  async spin() {
    await this.fetchEventDetails(this.eventId);

    if (this.drawCount == 0 && this.linkEvent != 0){
      const previousData = await this.eventService.getEventById(this.linkEvent);
      let draws = previousData.draw_setup;

      if (draws.length != 0) {
        for (let [index, d] of draws.entries()) {
          let drawObj: any = {};
          drawObj.name = d.drawName;

          // Pass the index (or d.number) into your service call
          const data = await this.participantService.getParticipantByEventIdAndWon(this.linkEvent, index + 1);
          for(let w of data){
            await this.participantService.updateParticipantEligibleByName(w.name);
          }
        }
      }
    }

    await this.loadParticipants();
    if (this.drawCount == this.draws.length) {
      this.isDone = true;
      return;
    }

    if (this.isDrawing || !this.visibleParticipants.length) {
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

    // Randomly select winner from the 12 visible participants
    let targetIndex = Math.floor(
      Math.random() * this.visibleParticipants.length
    );

    console.log(this.visibleParticipants);
    if (this.draws[this.drawCount].winner != ''){
      const participant =
        await this.participantService.getParticipantByNameAndEventId(
          this.draws[this.drawCount].winner,
          this.eventId
        );

      this.visibleParticipants[targetIndex] = participant;
    }
    console.log(this.visibleParticipants);

    this.draws[this.drawCount].drew = true;
    await this.eventService.updateEventDrawSetupById(this.eventId, this.draws);
    await this.eventService.setEventDrewById(this.eventId, true);
    await this.participantService.updateParticipantWon(this.visibleParticipants[targetIndex].id, this.drawCount+1);
    await this.participantService.updateParticipantEligibleByName(this.visibleParticipants[targetIndex].name);

    const targetRotation = targetIndex * this.angleStep;
    const startRotation = this.currentRotation;

    const currentNormalized =
      ((startRotation % 360) + 360) % 360;

    const targetNormalized =
      ((targetRotation % 360) + 360) % 360;

    const delta =
      (targetNormalized - currentNormalized + 360) % 360;

    const extraSpins = 5 + Math.floor(Math.random() * 3);

    const endRotation =
      startRotation + extraSpins * 360 + delta;

    const duration = 5000;
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

        // Save exact final rotation
        this.currentRotation = endRotation;

        this.carouselRotation =
          `rotateX(${endRotation}deg)`;

        this.finishDraw(targetIndex);
      }
    };

    this.animationId =
      requestAnimationFrame(animate);
  }

  // Display winner
  finishDraw(index: number): void {

    this.selectedIndex = index;

    this.winner = this.visibleParticipants[index].name;

    this.showSpotlight = true;
    this.showWinner = true;

    this.isDrawing = false;

    this.createParticles();

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

  ngOnDestroy(): void {

    if (this.animationId !== undefined) {
      cancelAnimationFrame(this.animationId);
    }

    if (this.winnerTimeout) {
      clearTimeout(this.winnerTimeout);
    }
  }
}
