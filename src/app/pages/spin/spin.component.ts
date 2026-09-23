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
  eventCode: any; // Bind this from your route or event state
  eventId: any;

  draws: { drawName: string | number; number: string | number; drew: boolean}[] = [];

  constructor(private supabaseService: SupabaseService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
     // 1. Grab the ID from the route parameter (:id)
    this.eventId = this.route.snapshot.paramMap.get('id');
    if(this.eventId){
      this.fetchEventDetails(this.eventId);
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
      this.eventCode = data.event_code;
      
    } catch (error) {
      console.error('Failed to load event details:', error);
      this.router.navigate(['event/listing']); // 👈 Adjust this path to match your actual event listing route
      return;
    }
  }

  async triggerDraw() {
    this.isDrawing = true;
    
    const data = await this.supabaseService.getEligibleParticipants();
    for(let draw of this.draws){
      if(draw.drew){
        continue;
      }

      const shuffled = [...data].sort(() => 0.5 - Math.random());
      const selectedWinners = shuffled.slice(0, Number(draw.number));
      console.log(`Winners for round "${draw.drawName}":`, selectedWinners);
      draw.drew = true;
      await this.supabaseService.updateEventDrawSetupById(this.eventId, this.draws);
      
      break;
    }
    
    // Simulate your draw logic / Supabase selection call here
    setTimeout(() => {
      console.log('Winner selected!');
      this.isDrawing = false;
    }, 3000);
  }

}
