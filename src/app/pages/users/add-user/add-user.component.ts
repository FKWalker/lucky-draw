import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserApiService } from 'app/shared/services/user-api.service';
import { ComponentCardComponent } from "app/shared/components/common/component-card/component-card.component";
import { AlertComponent } from "app/shared/components/ui/alert/alert.component";
import { LabelComponent } from "app/shared/components/form/label/label.component";
import { InputFieldComponent } from "app/shared/components/form/input/input-field.component";
import { ButtonComponent } from "app/shared/components/ui/button/button.component";
import { SelectComponent, Option } from "app/shared/components/form/select/select.component";
import { AuthService } from 'app/shared/services/auth.service';

@Component({
  selector: 'app-add-user',
  imports: [ComponentCardComponent, AlertComponent, LabelComponent, InputFieldComponent, ButtonComponent, SelectComponent],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.css'
})
export class AddUserComponent {

  userForm: {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    role: string;
    status: string;
  } = {
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    role: '',
    status: '1'
  };

  roleOptions: Option[] = [
    { value: 'user', label: 'User' },
    { value: 'admin', label: 'Admin' },
    { value: 'moderator', label: 'Moderator' }
  ];

  statusOptions: Option[] = [
    { value: '0', label: 'Inactive' },
    { value: '1', label: 'Active' },
    { value: '2', label: 'Locked' }
  ];

  errors = {
    username: false,
    email: false,
    firstName: false,
    lastName: false,
    password: false,
    role: false
  }

  disabled: boolean = false;
  success: any;
  error: any;
  String: any;

  constructor(
    private userApiService: UserApiService, 
    private router: Router
  ) {}

  onSubmit() {
    this.disabled = true;
    if(this.validation()){
      this.userApiService.createUser(this.userForm).subscribe({
        next: (res) => {
          // Reset form after success
          this.userForm = {
            username: '',
            email: '',
            firstName: '',
            lastName: '',
            password: '',
            role: '',
            status: '1'
          };
          this.success = true;
          this.error = null;
          this.disabled = false;
          
          // Redirect to listing page after 2 seconds
          setTimeout(() => {
            this.router.navigate(['/users/listing']);
          }, 2000);
        },
        error: (err) => {
          console.error('API Error:', err);
          this.error = true;
          this.success = null;
          this.disabled = false;
        }
      })
    } else {
      this.disabled = false;
    }
  }
  
  validation(){
    // Reset errors
    this.errors = {
      username: false,
      email: false,
      firstName: false,
      lastName: false,
      password: false,
      role: false
    };

    let valid = true;

    if (!this.userForm.username.trim()) {
      this.errors.username = true;
      valid = false;
    }

    if (!this.userForm.email.trim()) {
      this.errors.email = true;
      valid = false;
    }

    if (!this.userForm.firstName.trim()) {
      this.errors.firstName = true;
      valid = false;
    }

    if (!this.userForm.lastName.trim()) {
      this.errors.lastName = true;
      valid = false;
    }

    if (!this.userForm.password.trim()) {
      this.errors.password = true;
      valid = false;
    }

    if (!this.userForm.role.trim()) {
      this.errors.role = true;
      valid = false;
    }

    if (!valid) {
      console.warn('Form invalid:', this.errors);
    }

    return valid;
  }
}
