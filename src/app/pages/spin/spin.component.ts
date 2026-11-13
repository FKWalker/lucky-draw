import { truncateTextWithEllipsis } from '@amcharts/amcharts5/.internal/core/util/Utils';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SupabaseService } from 'app/shared/services/supabase.service';
import { ButtonComponent } from 'app/shared/components/ui/button/button.component';
import { LabelComponent } from 'app/shared/components/form/label/label.component';
import { InputFieldComponent } from 'app/shared/components/form/input/input-field.component';
import { FormsModule } from '@angular/forms';
import { ParticipantService } from 'app/shared/services/participant.service';
import { EventService } from 'app/shared/services/event.service';

@Component({
  selector: 'app-spin',
  imports: [FormsModule],
  templateUrl: './spin.component.html',
  styleUrl: './spin.component.css'
})
export class SpinComponent {

  isDrawing: boolean = false;
  isDone: boolean = false;
  isPending: boolean = false;
  eventCode: any; // Bind this from your route or event state
  eventId: any;

  draws: { drawName: string | number; number: string | number; drew: boolean, winner: string | number }[] = [];
  currentWinners: any[] = [];

  drawChannel: any;

  showHiddenModal = false;
  disabled: boolean = false;
  memberCode: any = '';
  invalidMemberCode: boolean = false;

  drawCount: number = 0;
  linkEvent: number = 0;
  participants: any[] = [];
  visibleParticipants: any[] = [];

  constructor(private supabaseService: SupabaseService,
    private participantService: ParticipantService,
    private eventService: EventService, 
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
     // 1. Grab the ID from the route parameter (:id)
    this.eventId = this.route.snapshot.paramMap.get('id');
    if(this.eventId){
      this.fetchEventDetails(this.eventId);
      this.drawChannel = this.supabaseService.joinDrawChannel(this.eventId, (payload) => {
        // Safe extraction using bracket notation
        const data = payload?.['payload'] || payload;

        if (data && data.type === 'NEW_WINNERS') {
          this.isDrawing = false;
        }

        if (data && data.type === 'IS_DRAWING') {
          this.isDrawing = true;
        }

        if (data && data.type === 'IS_DONE') {
          this.isDone = true;
        }
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
      if (data.link_event != 0) {
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

  }

  async spin() {
    await this.supabaseService.sendDrawBroadcast(this.drawChannel, {
      type: 'IS_DRAWING',
      eventId: this.eventId
    });

    await this.fetchEventDetails(this.eventId);

    if (this.drawCount == 0 && this.linkEvent != 0) {
      const previousData = await this.eventService.getEventById(this.linkEvent);
      let draws = previousData.draw_setup;

      if (draws.length != 0) {
        for (let [index, d] of draws.entries()) {
          let drawObj: any = {};
          drawObj.name = d.drawName;

          // Pass the index (or d.number) into your service call
          const data = await this.participantService.getParticipantByEventIdAndWon(this.linkEvent, index + 1);
          for (let w of data) {
            await this.participantService.updateParticipantEligibleByName(w.name);
          }
        }
      }
    }

    await this.loadParticipants();
    if (this.drawCount == this.draws.length) {
      this.isDone = true;
      await this.supabaseService.sendDrawBroadcast(this.drawChannel, {
        type: 'IS_DONE',
        eventId: this.eventId
      });
      return;
    }

    if (this.isDrawing || !this.visibleParticipants.length) {
      return;
    }

    this.isDrawing = true;

    // Randomly select winner from the 12 visible participants
    let targetIndex = Math.floor(
      Math.random() * this.visibleParticipants.length
    );

    if (this.draws[this.drawCount].winner != '') {
      const participant =
        await this.participantService.getParticipantByNameAndEventId(
          this.draws[this.drawCount].winner,
          this.eventId
        );

      this.visibleParticipants[targetIndex] = participant;
    } else {
      await this.participantService.updateParticipantWon(this.visibleParticipants[targetIndex].id, this.drawCount + 1);
      await this.participantService.updateParticipantEligibleByName(this.visibleParticipants[targetIndex].name);
    }

    this.draws[this.drawCount].drew = true;
    await this.eventService.updateEventDrawSetupById(this.eventId, this.draws);
    await this.eventService.setEventDrewById(this.eventId, true);

    await this.supabaseService.sendDrawBroadcast(this.drawChannel, {
      type: 'NEW_WINNERS',
      eventId: this.eventId,
      visibleParticipants: this.visibleParticipants,
      winnerIndex: targetIndex
    });

    setTimeout(() => {
      this.isDrawing = false;
    }, 5000);

  }
}
