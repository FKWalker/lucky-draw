import { truncateTextWithEllipsis } from '@amcharts/amcharts5/.internal/core/util/Utils';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SupabaseService } from 'app/shared/services/supabase.service';

@Component({
  selector: 'app-spin',
  imports: [],
  templateUrl: './spin.component.html',
  styleUrl: './spin.component.css'
})
export class SpinComponent {

  isDrawing: boolean = false;
  isDone: boolean = false;
  eventCode: any; // Bind this from your route or event state
  eventId: any;

  draws: { drawName: string | number; number: string | number; drew: boolean}[] = [];
  showWinnerModal = false;
  currentWinners: any[] = [];

  drawChannel: any;

  constructor(private supabaseService: SupabaseService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
     // 1. Grab the ID from the route parameter (:id)
    this.eventId = this.route.snapshot.paramMap.get('id');
    if(this.eventId){
      this.fetchEventDetails(this.eventId);
      this.drawChannel = this.supabaseService.joinDrawChannel(this.eventId, () => {
        // Empty callback because this admin page only sends updates, it doesn't listen to others
      });
    }
  }

  async fetchEventDetails(id: string) {
    try {
      // 2. Fetch the data from Supabase
      const data = await this.supabaseService.getEventById(id);

      if (!data) {
        console.warn('Event not found, redirecting...');
        this.router.navigate(['/event/list']); // 👈 Adjust this path to match your actual event listing route
        return;
      }
      this.draws = data.draw_setup;
      let drawCount = 0;
      if(this.draws.length > 0){
        for (let draw of this.draws) {
          if (draw.drew) {
            drawCount++;
          }
        }
        if(drawCount == this.draws.length){
          this.isDone = true;
        }
      }
      
      this.eventCode = data.event_code;
      
    } catch (error) {
      console.error('Failed to load event details:', error);
      this.router.navigate(['event/listing']); // 👈 Adjust this path to match your actual event listing route
      return;
    }
  }

  async triggerDraw() {
    this.isDrawing = true;

    try {
      // 1. Fetch eligible participants (which may contain duplicates for higher weight)
      const data = await this.supabaseService.getEligibleParticipants(this.eventId);

      if (!data || data.length === 0) {
        console.warn('No eligible participants found for the draw.');
        this.isDrawing = false;
        return;
      }

      let drawCount = 0;

      if(this.draws.length > 0){
        for (let[index, draw] of this.draws.entries()) {
          if (draw.drew) {
            drawCount++;
            continue;
          }

          const countToSelect = Number(draw.number) || 1;
          const selectedWinners = [];
          const selectedIdsThisRound = new Set(); // Tracks IDs picked in THIS round to prevent self-duplication

          // Create a working copy so we can pull items out of it
          let pool = [...data];
          // Keep picking until we reach the count or run out of unique people
          while (selectedWinners.length < countToSelect && pool.length > 0) {
            // Pick a random index from the pool
            const randomIndex = Math.floor(Math.random() * pool.length);
            const candidate = pool[randomIndex];

            // Check if this person has ALREADY been picked in this specific round
            if (!selectedIdsThisRound.has(candidate.member_code)) {
              selectedWinners.push(candidate);
              selectedIdsThisRound.add(candidate.member_code); // Mark ID as picked for this round
            }

            // Remove this specific entry from the pool so it isn't picked again immediately
            pool.splice(randomIndex, 1);
          }

          // Save to your draw object
          draw.drew = true;
          drawCount++;
          await this.supabaseService.updateEventDrawSetupById(this.eventId, this.draws);

          for(let sw of selectedWinners){
            await this.supabaseService.updateParticipantWon(sw.id, index+1);
            await this.supabaseService.updateParticipantEligible(sw.member_code);
          }

          await this.supabaseService.sendDrawBroadcast(this.drawChannel, {
            type: 'NEW_WINNERS',
            eventId: this.eventId,
            winners: selectedWinners,
            draws: this.draws
          });

          // Trigger the popup modal states
          this.currentWinners = selectedWinners;
          this.showWinnerModal = true;

          break; // Stops after processing the next available un-drawn round
        }

        if(drawCount == this.draws.length){
          this.isDone = true;
        }
      }else{
        let pool = [...data];
        const randomIndex = Math.floor(Math.random() * pool.length);
        const selectedWinner = pool[randomIndex];

        await this.supabaseService.updateParticipantWon(selectedWinner.id, 0);
        await this.supabaseService.updateParticipantEligible(selectedWinner.member_code);

        // Trigger the popup modal states
        const selectedWinners = [];
        selectedWinners.push(selectedWinner);

        await this.supabaseService.sendDrawBroadcast(this.drawChannel, {
          type: 'NEW_WINNERS',
          eventId: this.eventId,
          winners: selectedWinners,
          draws: this.draws
        });

        this.currentWinners = selectedWinners;
        this.showWinnerModal = true;

      }
      

    } catch (error) {
      console.error('Error during lucky draw execution:', error);
    } finally {
      this.isDrawing = false;
    }
  }

  // Method to close the modal and reset loading state
  closeWinnerModal() {
    this.showWinnerModal = false;
    this.isDrawing = false;
  }

}
