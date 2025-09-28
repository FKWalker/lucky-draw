import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonComponent } from "app/shared/components/ui/button/button.component";
import { ArtistApiService } from 'app/shared/services/artist-api.service';
import {CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray, DragDropModule} from '@angular/cdk/drag-drop';
import { AuthService } from 'app/shared/services/auth.service';
import { AlertComponent } from "app/shared/components/ui/alert/alert.component";

@Component({
  selector: 'app-sorting-artist',
  imports: [ButtonComponent, DragDropModule, AlertComponent],
  templateUrl: './sorting-artist.component.html',
  styleUrl: './sorting-artist.component.css'
})
export class SortingArtistComponent {

  disabled: boolean = false;

  artists: any = [];
  success: any;
  error: any;

  constructor(private artistApiService: ArtistApiService, private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    const options: any = {
      sortBy: 'sort_number',
      sortOrder: 'asc',
      limi: 100
    };
    this.getAllArtists(options);
  }

  getAllArtists(options: any){
    this.artistApiService.getAllArtists(options).subscribe({
      next: (res) => {
        this.artists = res.data.artists;
        this.artists = res.data.artists.map((artist: any) => ({
          ...artist,
          biography : this.getBiography(artist.biography),
        }));
      },
      error: (err) => {
        console.error('API Error:', err);
      }
    })
  }

  getBiography(biography: any) {
    return biography.en;
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.artists, event.previousIndex, event.currentIndex);

    this.artists = this.artists.map((artist:any, index:any) => ({
      ...artist,
      sort_number: index + 1
    }));

  }

  async onSubmit() {
    this.disabled = true;

    const currentUser = this.authService.getCurrentUser();

    // Convert each API call to a Promise
    const requests = this.artists.map((artist:any) => {
      const formData = new FormData();
      formData.append('sort_number', artist.sort_number);
      formData.append('updated_by', currentUser ? currentUser.username.toString() : '');

      return new Promise((resolve, reject) => {
        this.artistApiService.updateArtist(artist.id, formData).subscribe({
          next: (res) => resolve(res),
          error: (err) => reject(err)
        });
      });
    });

    // Wait for all requests to complete
    const results = await Promise.allSettled(requests);

    // Handle results
    const hasError = results.some(r => r.status === 'rejected');

    if (hasError) {
      console.error('Some updates failed:', results);
      this.error = true;
      this.success = null;
    } else {
      console.log('All updates successful');
      this.success = true;
      this.error = null;
    }

    // Re-enable drag and form
    this.disabled = false;
  }


}


