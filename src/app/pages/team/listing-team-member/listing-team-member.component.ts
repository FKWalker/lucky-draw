import { Component, OnInit } from '@angular/core';
import { ComponentCardComponent } from "../../../shared/components/common/component-card/component-card.component";
import { BasicTableThreeComponent } from "../../../shared/components/tables/basic-tables/basic-table-three/basic-table-three.component";
import { TeamApiService } from 'app/shared/services/team-api.service';
import { Router } from '@angular/router';
import { AlertComponent } from "app/shared/components/ui/alert/alert.component";

@Component({
  selector: 'app-listing-team-member',
  imports: [ComponentCardComponent, BasicTableThreeComponent, AlertComponent],
  templateUrl: './listing-team-member.component.html',
  styleUrl: './listing-team-member.component.css'
})
export class ListingTeamMemberComponent implements OnInit{
  
  // Column definitions
  transactionColumns = [
    { key: 'name', label: 'Name' },
    { key: 'position', label: 'Position' },
  ];

  // Dummy data
  teamMembers = [
    {
      "id": 1,
      "name": "Angela",
      "profile_image": "https://flashbang-s3id-bucket.s3.ap-southeast-1.amazonaws.com/homepage/homepage_team_1.png",
      "position": "Business Director",
      "created_at": "2025-09-02T17:31:08.000Z",
      "updated_at": "2025-09-02T17:31:08.000Z",
      "updated_by": "admin"
    },
    {
      "id": 6,
      "name": "Jocelyn Huang",
      "profile_image": "https://flashbang-s3-bucket.s3.ap-southeast-1.amazonaws.com/homepage/homepage_team_6.png",
      "position": "Executive",
      "created_at": "2025-09-02T17:31:08.000Z",
      "updated_at": "2025-09-02T17:31:08.000Z",
      "updated_by": "admin"
    },
    {
      "id": 2,
      "name": "Jochen",
      "profile_image": "https://flashbang-s3-bucket.s3.ap-southeast-1.amazonaws.com/homepage/homepage_team_2.png",
      "position": "Project Manager & Recording Coordinator",
      "created_at": "2025-09-02T17:31:08.000Z",
      "updated_at": "2025-09-02T17:31:08.000Z",
      "updated_by": "admin"
    },
    {
      "id": 4,
      "name": "Lily",
      "profile_image": "https://flashbang-s3-bucket.s3.ap-southeast-1.amazonaws.com/homepage/homepage_team_4.png",
      "position": "Project Manager & Multilingual Translator",
      "created_at": "2025-09-02T17:31:08.000Z",
      "updated_at": "2025-09-02T17:31:08.000Z",
      "updated_by": "admin"
    },
    {
      "id": 8,
      "name": "new name",
      "profile_image": "new profile image",
      "position": "new position",
      "created_at": "2025-09-02T17:53:28.000Z",
      "updated_at": "2025-09-02T17:54:10.000Z",
      "updated_by": "user02"
    },
    {
      "id": 5,
      "name": "Sijie Zhang",
      "profile_image": "https://flashbang-s3-bucket.s3.ap-southeast-1.amazonaws.com/homepage/homepage_team_5.png",
      "position": "Executive",
      "created_at": "2025-09-02T17:31:08.000Z",
      "updated_at": "2025-09-02T17:31:08.000Z",
      "updated_by": "admin"
    },
    {
      "id": 3,
      "name": "Sisi",
      "profile_image": "https://flashbang-s3-bucket.s3.ap-southeast-1.amazonaws.com/homepage/homepage_team_3.png",
      "position": "Project Manager",
      "created_at": "2025-09-02T17:31:08.000Z",
      "updated_at": "2025-09-02T17:31:08.000Z",
      "updated_by": "admin"
    }
  ];

  // Pagination
  currentPage: number = 1;
  totalPages: number = 1;
  itemsPerPage = 10;

  success: any;
  error: any;

  constructor(private teamApiService: TeamApiService, private router: Router) {}

  ngOnInit(): void {
    const options: any = {};
    this.getAllTeamMembers(options);
  }

  getAllTeamMembers(options: any){
    this.teamApiService.getAllTeamMembers(options).subscribe({
      next: (res) => {
        this.currentPage = res.data.pagination.currentPage;
        this.totalPages = res.data.pagination.totalPages;
        this.itemsPerPage = res.data.pagination.itemsPerPage;
        this.teamMembers = res.data.teamMembers;
      },
      error: (err) => {
        console.error('API Error:', err);
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
    this.getAllTeamMembers(options);
  }

  // Handle search from table
  onSearch(query: string) {
    const options: any = {
      search: query
    };
    this.getAllTeamMembers(options);
  }

  action(event: { action: string; row: any }) {
    if(event.action === 'update'){
      this.router.navigate(['/team/edit', event.row.id], { state: { member: event.row } });
    }
    if(event.action === 'delete'){
      this.deleteTeamMember(event.row.id);
    }
  }

  deleteTeamMember(id: number){
    this.teamApiService.deleteTeamMember(id).subscribe({
      next: (res) => {
        const options: any = {};
        this.getAllTeamMembers(options);
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

}
