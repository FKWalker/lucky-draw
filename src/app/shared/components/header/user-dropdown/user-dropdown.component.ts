import { Component } from '@angular/core';
import { DropdownComponent } from '../../ui/dropdown/dropdown.component';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { DropdownItemTwoComponent } from '../../ui/dropdown/dropdown-item/dropdown-item.component-two';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-user-dropdown',
  templateUrl: './user-dropdown.component.html',
  imports:[CommonModule,RouterModule,DropdownComponent,DropdownItemTwoComponent]
})
export class UserDropdownComponent {
  isOpen = false;
  currentUserName = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.loadCurrentUser();
  }

  async loadCurrentUser() {
    const user = await this.authService.getCurrentUser();

    this.currentUserName = user?.user_metadata?.['display_name'] || 'User';
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  closeDropdown() {
    this.isOpen = false;
  }

  logout() {
    this.authService.signOut();
    this.router.navigate(['/sign-in']);
    this.closeDropdown();
  }
}