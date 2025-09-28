import { Component } from '@angular/core';
import { ButtonComponent } from "app/shared/components/ui/button/button.component";
import { AlertComponent } from "app/shared/components/ui/alert/alert.component";
import { TeamApiService } from 'app/shared/services/team-api.service';
import { Router } from '@angular/router';
import { AuthService } from 'app/shared/services/auth.service';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-sorting-team-member',
  imports: [ButtonComponent, AlertComponent, DragDropModule],
  templateUrl: './sorting-team-member.component.html',
  styleUrl: './sorting-team-member.component.css'
})
export class SortingTeamMemberComponent {

  disabled: boolean = false;

  teamMembers: any = [];
  success: any;
  error: any;

  constructor(private teamApiService: TeamApiService, private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    const options: any = {
      sortBy: 'sort_number',
      sortOrder: 'asc',
      limit: 100
    };
    this.getAllArtists(options);
  }
  
  getAllArtists(options: any) {
    this.teamApiService.getAllTeamMembers(options).subscribe({
      next: (res) => {
        this.teamMembers = res.data.teamMembers.map((teamMember: any) => ({
          ...teamMember,
          position: this.getBiography(teamMember.position),
        }));
      },
      error: (err) => {
        console.error('API Error:', err);
      }
    });
  }

  getBiography(biography: any) {
    return biography.en;
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.teamMembers, event.previousIndex, event.currentIndex);

    this.teamMembers = this.teamMembers.map((artist:any, index:any) => ({
      ...artist,
      sort_number: index + 1
    }));

  }

  async onSubmit() {
    this.disabled = true;

    const currentUser = this.authService.getCurrentUser();

    // Convert each API call to a Promise
    const requests = this.teamMembers.map((teamMember:any) => {
      const formData = new FormData();
      formData.append('sort_number', teamMember.sort_number);
      formData.append('updated_by', currentUser ? currentUser.username.toString() : '');

      return new Promise((resolve, reject) => {
        this.teamApiService.updateTeamMember(teamMember.id, formData).subscribe({
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
