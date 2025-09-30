import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DiscographyApiService } from 'app/shared/services/discography-api.service';
import { AlertComponent } from "app/shared/components/ui/alert/alert.component";
import { CustomTableComponent } from "app/shared/components/tables/basic-tables/custom-table/custom-table.component";
import { LabelComponent } from "app/shared/components/form/label/label.component";
import { InputFieldComponent } from "app/shared/components/form/input/input-field.component";
import { ComponentCardComponent } from "app/shared/components/common/component-card/component-card.component";
import { SelectComponent } from "app/shared/components/form/select/select.component";
import { ButtonComponent } from "app/shared/components/ui/button/button.component";
import { LoadingSpinnerComponent } from "app/shared/components/ui/loading-spinner/loading-spinner.component";
import { ArtistApiService } from 'app/shared/services/artist-api.service';

@Component({
  selector: 'app-listing-discography',
  imports: [AlertComponent, CustomTableComponent, LabelComponent, InputFieldComponent, ComponentCardComponent, SelectComponent, ButtonComponent, LoadingSpinnerComponent],
  templateUrl: './listing-discography.component.html',
  styleUrl: './listing-discography.component.css'
})
export class ListingDiscographyComponent {

  discographyForm: {
    artist_id: string | number;
    active: string | number;
    release_year: string | number;
    filter: string | number;
    search: string | number;
  } = {
    artist_id: 0,
    active: '',
    release_year: '',
    filter: '',
    search: ''
  };

  // Column definitions
  columns = [
    { key: 'name', label: 'Name' },
    { key: 'release_year', label: 'Release Year' },
    { key: 'filter', label: 'Filter' },
    { key: 'description', label: 'Description' },
    { key: 'active', label: 'Status' },
  ];

  // Dummy data
  discographies = [];

  // Pagination
  currentPage: number = 1;
  totalPages: number = 1;
  itemsPerPage = 10;

  success: any;
  error: any;
  isLoading: boolean = false;

  artistOptions:any = [];

  selectedValue = '';
  disabled: boolean = false;

  activeOptions = [
    { value: 'true', label: 'Yes' },
    { value: 'false', label: 'No' }
  ];

  constructor(private discographyApiService: DiscographyApiService, private router: Router, private artistApiService: ArtistApiService) {}

  ngOnInit(): void {
    const discographiesOptions: any = {};
    this.getAllDiscographies(discographiesOptions);
     const artistsOptions: any = {
      limit: 100
     };
    this.getAllArtists(artistsOptions);
  }

  getAllDiscographies(options: any){
    this.isLoading = true;
    this.discographyApiService.getAllDiscographies(options).subscribe({
      next: (res) => {
        this.currentPage = res.data.pagination.currentPage;
        this.totalPages = res.data.pagination.totalPages;
        this.itemsPerPage = res.data.pagination.itemsPerPage;

        this.discographies = res.data.discographies.map((discography: any) => ({
          ...discography,
          name : this.getName(discography.name),
          description: this.getDescription(discography.description),
          active: this.getActiveLabel(discography.active)
        }));
        this.isLoading = false;
      },
      error: (err) => {
        console.error('API Error:', err);
        this.isLoading = false;
      }
    })
  }

  // Handle page change from table
  loadPage(page: number) {
    this.currentPage = page;
    const options: any = {
      page: this.currentPage
    };

    Object.entries(this.discographyForm).forEach(([key, value]) => {
      if (
        value !== '' &&              // not empty string
        value !== null &&            // not null
        value !== undefined &&       // not undefined
        !(typeof value === 'number' && value === 0) // skip 0 for numbers
      ) {
        options[key] = value;
      }
    });
    this.getAllDiscographies(options);
  }

  // Handle search from table
  onSearch(query: string) {
    const options: any = {
      search: query
    };
    this.getAllDiscographies(options);
  }

  action(event: { action: string; row: any }) {
    if(event.action === 'update'){
      this.router.navigate(['/discography/edit', event.row.id]);
    }
    if(event.action === 'delete'){
      this.deleteDiscography(event.row.id);
    }
  }

  deleteDiscography(id: number){
    this.discographyApiService.deleteDiscography(id).subscribe({
      next: (res) => {
        const options: any = {};
        this.getAllDiscographies(options);
        this.success = true;
        this.error = null;
      },
      error: (err) => {
        console.error('API Error:', err);
        this.error = true;
        this.success = null;
      }
    })
  }

  handleArtistSelectChange(value: string) {
    this.discographyForm.artist_id = value;
  }

  handleActiveSelectChange(value: string) {
    this.discographyForm.active = value;
  }

  onSubmit() {
    const options: any = {
      page: this.currentPage
    };

    Object.entries(this.discographyForm).forEach(([key, value]) => {
      if (
        value !== '' &&              // not empty string
        value !== null &&            // not null
        value !== undefined &&       // not undefined
        !(typeof value === 'number' && value === 0) // skip 0 for numbers
      ) {
        options[key] = value;
      }
    });
    this.getAllDiscographies(options);
  }

  getAllArtists(options: any){
    this.artistApiService.getAllArtists(options).subscribe({
      next: (res) => {
       for(let artist of res.data.artists){
          let artistOption: any = {};
          artistOption.value = artist.id;
          artistOption.label = artist.first_name + ' ' + artist.last_name;
          this.artistOptions.push(artistOption);
       }
      },
      error: (err) => {
        console.error('API Error:', err);
      }
    })
  }

  getActiveLabel(status: boolean): string {
    switch (status) {
      case true: return 'Active';
      default: return 'Inactive';
    }
  }

  getName(name: any): string {
    return name.en;
  }

  getDescription(description: any): string {
    return description.en;
  }
  
}
