import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ModalService } from '../../../services/modal.service';
import { UserApiService } from '../../../services/user-api.service';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { InputFieldComponent } from '../../form/input/input-field.component';
import { ButtonComponent } from '../../ui/button/button.component';
import { LabelComponent } from '../../form/label/label.component';
import { ModalComponent } from '../../ui/modal/modal.component';
import { SelectComponent, Option } from '../../form/select/select.component';
import { ToastService } from 'app/shared/services/toast.service';

@Component({
  selector: 'app-user-info-card',
  imports: [
    CommonModule,
    InputFieldComponent,
    ButtonComponent,
    LabelComponent,
    ModalComponent,
    SelectComponent,
  ],
  templateUrl: './user-info-card.component.html',
  styles: ``
})
export class UserInfoCardComponent implements OnInit {

  constructor(
    public modal: ModalService,
    private userApiService: UserApiService,
    private authService: AuthService,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef
  ) {}

  isOpen = false;
  
  openModal() { 
    this.isOpen = true; 
  }
  
  closeModal() { 
    this.isOpen = false; 
  }

  user: any = {
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    role: '',
    status: ''
  };

  statusOptions: Option[] = [
    { value: '0', label: 'Inactive' },
    { value: '1', label: 'Active' },
    { value: '2', label: 'Locked' }
  ];

  roleOptions: Option[] = [
    { value: 'user', label: 'User' },
    { value: 'admin', label: 'Admin' },
    { value: 'moderator', label: 'Moderator' }
  ];

  isAdmin: boolean = false;

  ngOnInit(): void {
    this.loadUserData();
    this.checkAdminRole();
  }

  private checkAdminRole(): void {
    this.isAdmin = this.authService.isAdmin();
  }

  private loadUserData(): void {
    const currentUser = this.authService.getCurrentUser();

    if (currentUser && currentUser.id) {
      // Convert status to string for select component compatibility
      this.user = {
        ...currentUser,
        status: currentUser.status ? currentUser.status.toString() : ''
      };
    }
  }

  handleSave() {
    const currentUser = this.authService.getCurrentUser();

    if (currentUser && currentUser.id) {
      this.userApiService.updateUserById(currentUser.id, this.user).subscribe({
        next: (updatedUser) => {
          console.log('API Response:', updatedUser);
          console.log('Current user data before merge:', this.user);
          
          // Merge the API response with our current user data to preserve all fields
          this.user = { ...this.user, ...updatedUser };
          
          console.log('Merged user data:', this.user);
          
          // Update the auth service with the merged data
          this.authService.updateCurrentUser(this.user);

          this.toastService.success('Success!', "Account updated successfully!");
          
          // Small delay to show toast, then close modal
          setTimeout(() => {
            this.closeModal();
          }, 100);
        },
        error: (error) => {
          console.error('Error updating user:', error);
          this.toastService.error('Error', "Failed to update account information");
        }
      });
    } else {
      console.error('No current user found or user ID missing');
      this.modal.closeModal();
    }
  }
}
