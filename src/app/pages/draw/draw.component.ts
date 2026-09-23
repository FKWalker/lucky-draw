import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from 'app/shared/services/supabase.service';

interface Participant {
  id: number;
  name: string;
}

@Component({
  selector: 'app-draw',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './draw.component.html',
  styleUrl: './draw.component.css'
})
export class DrawComponent implements OnInit {
  participants: Participant[] = [];

  originalParticipants: Participant[] = [];
  
  itemHeight = 50; 
  isSpinning = false;
  winner: Participant | null = null;
  pendingWinner: Participant | null = null;
  showWinner = false;
  showAdmin = false;
  newParticipantName = '';
  confetti: number[] = [];
  isBrowser = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object,
     private supabaseService: SupabaseService) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  async ngOnInit() {
    await this.loadParticipants();
  }

  // Get participant names from Supabase
  async loadParticipants() {
    this.participants = await this.supabaseService.getParticipants();
    console.log(this.participants);
  }

  spin(): void {
    if (this.isSpinning || this.participants.length === 0) return;

    if (this.pendingWinner) {
      this.participants = this.participants.filter(p => p.id !== this.pendingWinner!.id);
      this.pendingWinner = null;
      //this.saveToStorage();
    }

    if (this.participants.length === 0) return;

    this.isSpinning = true;
    this.winner = null;
    this.showWinner = false;

    const strip = document.getElementById('drumStrip');
    if (strip) {
      // Step A: Instantly snap back to top without transition to reset the roll
      strip.style.transition = 'none';
      strip.style.transform = `translateY(35px)`;
    }

    // Step B: Calculate the target winner
    const winnerIndex = Math.floor(Math.random() * this.participants.length);
    const selected = this.participants[winnerIndex];

    const targetLoop = 3;
    const totalItems = this.participants.length;
    const targetItemIndex = (targetLoop * totalItems) + winnerIndex;
    const targetOffset = 35 - (targetItemIndex * this.itemHeight);

    // Step C: Force browser reflow/tick, then re-enable transition and apply target transform
    setTimeout(() => {
      if (strip) {
        strip.style.transition = 'transform 4.5s cubic-bezier(0.15, 0.85, 0.15, 1)';
        strip.style.transform = `translateY(${targetOffset}px)`;
      }

      // Step D: Wait for the rolling animation to finish before showing the popup
      setTimeout(() => {
        this.winner = selected;
        this.pendingWinner = selected; 
        this.isSpinning = false;
        this.showWinner = true;
        this.startConfetti();
      }, 4600);

    }, 50);
  }

  closeWinner(): void {
    if (this.pendingWinner) {
      this.participants = this.participants.filter(p => p.id !== this.pendingWinner!.id);
      this.pendingWinner = null;
      //this.saveToStorage();
    }
    this.showWinner = false;
  }

  reset(): void {
    this.participants = [...this.originalParticipants];
    const strip = document.getElementById('drumStrip');
    if (strip) {
      strip.style.transition = 'none';
      strip.style.transform = `translateY(35px)`;
    }
    this.winner = null;
    this.pendingWinner = null;
    this.showWinner = false;
    this.isSpinning = false;
    //this.saveToStorage();
  }

  toggleAdmin(): void {
    this.showAdmin = !this.showAdmin;
  }

  isWinnerIndex(index: number): boolean {
    return false;
  }

  startConfetti(): void {
    this.confetti = Array.from({ length: 100 }, (_, i) => i);
    setTimeout(() => {
      this.confetti = [];
    }, 3500);
  }
}