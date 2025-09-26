import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserApiService } from 'app/shared/services/user-api.service';
import { AlertComponent } from "app/shared/components/ui/alert/alert.component";
import { CustomTableComponent } from "app/shared/components/tables/basic-tables/custom-table/custom-table.component";
import { AuthService } from 'app/shared/services/auth.service';

@Component({
  selector: 'app-listing-user',
  imports: [AlertComponent, CustomTableComponent],
  templateUrl: './listing-user.component.html',
  styleUrl: './listing-user.component.css'
})
export class ListingUserComponent {
  
  // Column definitions
  columns = [
    { key: 'username', label: 'Username' },
    { key: 'email', label: 'Email' },
    { key: 'firstName', label: 'First Name' },
    { key: 'lastName', label: 'Last Name' },
    { key: 'role', label: 'Role' },
    { key: 'status', label: 'Status' },
  ];

  // User data
  users = [];

  // Pagination
  currentPage: number = 1;
  totalPages: number = 1;
  itemsPerPage = 10;

  success: any;
  error: any;
  isAdmin: boolean = false;

  constructor(
    private userApiService: UserApiService, 
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    const options: any = {};
    this.getAllUsers(options);
  }

  getAllUsers(options: any){
    this.userApiService.getAllUsers(options).subscribe({
      next: (res) => {
        this.currentPage = res.data.pagination.currentPage;
        this.totalPages = res.data.pagination.totalPages;
        this.itemsPerPage = res.data.pagination.itemsPerPage;
        // Transform the data to display readable labels
        this.users = res.data.users.map((user: any) => ({
          ...user,
          status: this.getStatusLabel(user.status),
          role: this.getRoleLabel(user.role)
        }));
        
      },
      error: (err) => {
        console.error('API Error:', err);
        this.error = true;
        this.success = null;
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
    this.getAllUsers(options);
  }

  // Handle search from table
  onSearch(query: string) {
    const options: any = {
      search: query
    };
    this.getAllUsers(options);
  }

  action(event: { action: string; row: any }) {
    if(event.action === 'update'){
      this.router.navigate(['/users/edit', event.row.id]);
    }
    if(event.action === 'delete'){
      this.deleteUser(event.row.id);
    }
  }

  deleteUser(id: number){
    this.userApiService.deleteUserById(id).subscribe({
      next: (res) => {
        const options: any = {};
        this.getAllUsers(options);
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

  getStatusLabel(status: number): string {
    switch (status) {
      case 0: return 'Inactive';
      case 1: return 'Active';
      case 2: return 'Locked';
      default: return 'Unknown';
    }
  }

  getRoleLabel(role: string): string {
    switch (role) {
      case 'user': return 'User';
      case 'admin': return 'Admin';
      case 'moderator': return 'Moderator';
      default: return role;
    }
  }
}
