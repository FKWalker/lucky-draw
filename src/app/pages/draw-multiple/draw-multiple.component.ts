import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SupabaseService } from 'app/shared/services/supabase.service';

@Component({
  selector: 'app-draw-multiple',
  imports: [],
  templateUrl: './draw-multiple.component.html',
  styleUrl: './draw-multiple.component.css'
})
export class DrawMultipleComponent {

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

  closeWinnerModal(){
    this.showWinnerModal = false;
  }

  openSettings(){
    
  }

}
