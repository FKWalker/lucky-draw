import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from 'app/shared/services/supabase.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-draw',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './draw.component.html',
  styleUrl: './draw.component.css'
})
export class DrawComponent implements OnInit, OnDestroy {
  drawChannel: any;
  eventId: string | null = null;
  
  // State variables for animation and modals
  currentWinners: any[] = [];
  draws: any[] = [];
  isSpinning: boolean = false;
  showWinnerModal: boolean = false;

  constructor(
    private supabaseService: SupabaseService, 
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.eventId = this.route.snapshot.paramMap.get('id');

    if (this.eventId) {
      // 🎧 Listen for broadcasts coming from the admin page
      this.drawChannel = this.supabaseService.joinDrawChannel(this.eventId, (payload) => {
        console.log('Broadcast received on display page:', payload);
        this.showWinnerModal = false;
        // Safe extraction using bracket notation
        const data = payload?.['payload'] || payload;

        if (data && data.type === 'NEW_WINNERS') {
          // 1. Trigger the spinning wheel animation
          this.isSpinning = true;

          // 2. Wait 2.5 seconds for the spin effect, then stop wheel & show modal
          setTimeout(() => {
            this.isSpinning = false;
            this.currentWinners = data.winners || [];
            this.draws = data.draws || [];
            this.showWinnerModal = true;
          }, 2500); 
        }
      });
    }
  }
  
  // Clean up channel subscription when leaving the page
  ngOnDestroy() {
    if (this.drawChannel) {
      this.supabaseService.leaveChannel(this.drawChannel);
    }
  }
}