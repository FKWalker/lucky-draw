import { Component, OnInit } from '@angular/core';
import { ComponentCardComponent } from "../../../shared/components/common/component-card/component-card.component";
import { CustomTableComponent } from "../../../shared/components/tables/basic-tables/custom-table/custom-table.component";
import { TeamApiService } from 'app/shared/services/team-api.service';
import { Router } from '@angular/router';
import { AlertComponent } from "app/shared/components/ui/alert/alert.component";

@Component({
  selector: 'app-listing-team-member',
  imports: [CustomTableComponent, AlertComponent],
  templateUrl: './listing-team-member.component.html',
  styleUrl: './listing-team-member.component.css'
})
export class ListingTeamMemberComponent implements OnInit{
  
  // Column definitions
  columns = [
    { key: 'first_name', label: 'First Name' },
    { key: 'last_name', label: 'Last Name' },
    { key: 'position', label: 'Position' },
  ];

  // Dummy data
  teamMembers = [];

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
        this.teamMembers = res.data.teamMembers.map((teamMember: any) => ({
          ...teamMember,
          position : this.getPosition(teamMember.position),
        }));
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
      this.router.navigate(['/team/edit', event.row.id]);
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

  getPosition(position: any): string {
    return position.en;
  }

}
