import { Component, OnInit } from '@angular/core';
import { AlertComponent } from 'app/shared/components/ui/alert/alert.component';
import { ComponentCardComponent } from 'app/shared/components/common/component-card/component-card.component';
import { LabelComponent } from 'app/shared/components/form/label/label.component';
import { SelectComponent } from 'app/shared/components/form/select/select.component';
import { InputFieldComponent } from 'app/shared/components/form/input/input-field.component';
import { ButtonComponent } from 'app/shared/components/ui/button/button.component';
import { LoadingSpinnerComponent } from 'app/shared/components/ui/loading-spinner/loading-spinner.component';
import { CustomTableComponent } from 'app/shared/components/tables/basic-tables/custom-table/custom-table.component';
import { SupabaseService } from 'app/shared/services/supabase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listing-event',
  imports: [AlertComponent, ComponentCardComponent, LabelComponent, SelectComponent, InputFieldComponent, ButtonComponent, LoadingSpinnerComponent, CustomTableComponent],
  templateUrl: './listing-event.component.html',
  styleUrl: './listing-event.component.css'
})
export class ListingEventComponent implements OnInit {

  eventForm: {
    event_name: any;
    event_code: any;
    password: any;
  } = {
    event_name: '',
    event_code: '',
    password: ''
  }

  events: any[] = [];

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
    { key: 'event_name', label: 'Event Name' },
    { key: 'event_code', label: 'Event Code' }
  ];

  constructor(private supabaseService: SupabaseService,
    private router: Router
  ) {}

  ngOnInit() {
    this.fetchEvents();
  }

  // Fetch paginated and filtered events from Supabase
  async fetchEvents() {
    this.isLoading = true;
    try {
      const from = (this.currentPage - 1) * this.itemsPerPage;
      const to = from + this.itemsPerPage - 1;

      // Build your criteria options object dynamically
      const options: any = {
        page: this.currentPage,
        ...(this.eventForm.event_name && { event_name: this.eventForm.event_name }),
        ...(this.eventForm.event_code && { event_code: this.eventForm.event_code }),
        ...(this.searchQuery && { search: this.searchQuery })
      };

      // Call your service method (make sure to implement `getEventsWithFilters` in your service)
      const { data, count, error } = await this.supabaseService.getEventsFiltered(from, to, options);

      if (error) throw error;

      this.events = data || [];
      this.totalItems = count || 0;
      this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage) || 1;

    } catch (err: any) {
      console.error('Error fetching events:', err);
      this.error = err.message;
    } finally {
      this.isLoading = false;
    }
  }

  loadPage(page: number) {
    this.currentPage = page;
    this.fetchEvents();
  }

  onSearch(query: string) {
    this.searchQuery = query;
    this.currentPage = 1; // Reset to page 1 on search
    this.fetchEvents();
  }

  onSubmit() {
    this.currentPage = 1; // Reset to page 1 on filter submit
    this.fetchEvents();
  }

  action($event: { action: string; row: any; }) {
    if ($event.action === 'edit') {
      // Assuming your row object has an 'id' or 'event_code' property
      const eventId = $event.row.id; // or $event.row.event_code depending on your DB schema
      
      // Navigate to your edit route
      this.router.navigate(['/event/edit', eventId]);
    } 
    
    if ($event.action === 'view') {
      // Assuming your row object has an 'id' or 'event_code' property
      const eventId = $event.row.id; // or $event.row.event_code depending on your DB schema
      
      // Navigate to your edit route
      this.router.navigate(['/event/view', eventId]);
    }
  }
}