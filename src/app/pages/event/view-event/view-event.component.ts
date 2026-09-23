import { Component } from '@angular/core';
import { ComponentCardComponent } from 'app/shared/components/common/component-card/component-card.component';
import { LabelComponent } from 'app/shared/components/form/label/label.component';
import { InputFieldComponent } from 'app/shared/components/form/input/input-field.component';
import { ButtonComponent } from 'app/shared/components/ui/button/button.component';
import { SupabaseService } from 'app/shared/services/supabase.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingSpinnerComponent } from 'app/shared/components/ui/loading-spinner/loading-spinner.component';
import { CustomTableComponent } from 'app/shared/components/tables/basic-tables/custom-table/custom-table.component';

@Component({
  selector: 'app-view-event',
  imports: [ComponentCardComponent, LabelComponent, InputFieldComponent, ButtonComponent, LoadingSpinnerComponent, CustomTableComponent],
  templateUrl: './view-event.component.html',
  styleUrl: './view-event.component.css'
})
export class ViewEventComponent {

  participantForm: {
    name: any;
    member_code: any;
  } = {
    name: '',
    member_code: '',
  }

  participants: any[] = [];

  // Pagination & Filters State
  currentPage: number = 1;
  totalPages: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  
  searchQuery: string = '';

  success: any;
  error: any;
  isLoading: boolean = false;
  disabled: boolean = false;

  columns = [
    { key: 'name', label: 'Participant Name' },
    { key: 'member_code', label: 'Member Code' }
  ];

  winners: any[] = [];

  draws: { drawName: string | number; number: string | number; drew: boolean}[] = [];

  eventId: any;

  constructor(private supabaseService: SupabaseService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
     // 1. Grab the ID from the route parameter (:id)
    this.eventId = this.route.snapshot.paramMap.get('id');

    if (this.eventId) {
      this.fetchParticipants(this.eventId); 
      this.fetchWinnersDetails(this.eventId);
    }
  }

  // Fetch paginated and filtered events from Supabase
  async fetchParticipants(id: string) {
    this.isLoading = true;
    try {
      const from = (this.currentPage - 1) * this.itemsPerPage;
      const to = from + this.itemsPerPage - 1;

      // Build your criteria options object dynamically
      const options: any = {
        page: this.currentPage,
        ...(this.participantForm.name && { name: this.participantForm.name }),
        ...(this.participantForm.member_code && { member_code: this.participantForm.member_code }),
        ...(this.searchQuery && { search: this.searchQuery })
      };

      // Call your service method (make sure to implement `getEventsWithFilters` in your service)
      const { data, count, error } = await this.supabaseService.getParticipantsFiltered(from, to, options, id);

      if (error) throw error;

      this.participants = data || [];
      this.totalItems = count || 0;
      this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage) || 1;

    } catch (err: any) {
      console.error('Error fetching events:', err);
      this.error = err.message;
    } finally {
      this.isLoading = false;
    }
  }

  async fetchWinnersDetails(id: string) {
    try {
      // 2. Fetch the data from Supabase
      const data = await this.supabaseService.getEventById(id);

      if (!data) {
        console.warn('Event not found, redirecting...');
        this.router.navigate(['/event/list']); // 👈 Adjust this path to match your actual event listing route
        return;
      }

      this.draws = data.draw_setup;

      if(this.draws.length != 0){
        for (let [index, d] of this.draws.entries()) {
          let drawObj: any = {};
          drawObj.name = d.drawName;

          // Pass the index (or d.number) into your service call
          const data = await this.supabaseService.getParticipantByEventIdAndWon(id, index+1);

          drawObj.winnersList = data;

          this.winners.push(drawObj);
        }
      }else{
        let drawObj: any = {};
        drawObj.name = '';

        const data = await this.supabaseService.getParticipantByEventIdAndWon(id, 0);

        drawObj.winnersList = data;

        this.winners.push(drawObj);
        
      }

      console.log(this.winners);

    } catch (error) {
      console.error('Failed to load event details:', error);
      this.router.navigate(['event/listing']); // 👈 Adjust this path to match your actual event listing route
      return;
    }
  }

  loadPage(page: number) {
    this.currentPage = page;
    this.fetchParticipants(this.eventId);
  }

  onSearch(query: string) {
    this.searchQuery = query;
    this.currentPage = 1; // Reset to page 1 on search
    this.fetchParticipants(this.eventId);
  }

  onSubmit() {
    this.currentPage = 1; // Reset to page 1 on filter submit
    this.fetchParticipants(this.eventId);
  }

  goSpin() {
    this.router.navigate(['/spin/', this.eventId]); 
  }

}
