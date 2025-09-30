import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TeamApiService } from 'app/shared/services/team-api.service';
import { AlertComponent } from "app/shared/components/ui/alert/alert.component";
import { CustomTableComponent } from "app/shared/components/tables/basic-tables/custom-table/custom-table.component";
import { LoadingSpinnerComponent } from "app/shared/components/ui/loading-spinner/loading-spinner.component";
import { ArtistApiService } from 'app/shared/services/artist-api.service';

@Component({
  selector: 'app-listing-artist',
  imports: [AlertComponent, CustomTableComponent, LoadingSpinnerComponent],
  templateUrl: './listing-artist.component.html',
  styleUrl: './listing-artist.component.css'
})
export class ListingArtistComponent {
  
  // Column definitions
  columns = [
    { key: 'first_name', label: 'First Name' },
    { key: 'last_name', label: 'Last Name' },
    { key: 'biography', label: 'Biography' },
  ];

  artists = [];

  // Pagination
  currentPage: number = 1;
  totalPages: number = 1;
  itemsPerPage = 10;

  success: any;
  error: any;
  isLoading: boolean = false;

  constructor(private artistApiService: ArtistApiService, private router: Router) {}

  ngOnInit(): void {
    const options: any = {
      sortBy: 'sort_number',
      sortOrder: 'asc'
    };
    this.getAllArtists(options);
  }

  getAllArtists(options: any){
    this.isLoading = true;
    this.artistApiService.getAllArtists(options).subscribe({
      next: (res) => {
        this.currentPage = res.data.pagination.currentPage;
        this.totalPages = res.data.pagination.totalPages;
        this.itemsPerPage = res.data.pagination.itemsPerPage;
        this.artists = res.data.artists;
        this.artists = res.data.artists.map((artist: any) => ({
          ...artist,
          biography : this.getBiography(artist.biography),
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
    console.log('Load page:', page);
    this.currentPage = page;
    const options: any = {
      page: this.currentPage
    };
    this.getAllArtists(options);
  }

  // Handle search from table
  onSearch(query: string) {
    const options: any = {
      search: query
    };
    this.getAllArtists(options);
  }

  action(event: { action: string; row: any }) {
    if(event.action === 'update'){
      this.router.navigate(['/artist/edit', event.row.id]);
    }
    if(event.action === 'delete'){
      this.deleteArtist(event.row.id);
    }
  }

  deleteArtist(id: number){
    this.artistApiService.deleteArtist(id).subscribe({
      next: (res) => {
        const options: any = {};
        this.getAllArtists(options);
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

  getBiography(biography: any) {
    return biography.en;
  }
}
