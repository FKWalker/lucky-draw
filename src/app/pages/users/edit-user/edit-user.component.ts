import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserApiService } from 'app/shared/services/user-api.service';
import { ComponentCardComponent } from "app/shared/components/common/component-card/component-card.component";
import { AlertComponent } from "app/shared/components/ui/alert/alert.component";
import { LabelComponent } from "app/shared/components/form/label/label.component";
import { InputFieldComponent } from "app/shared/components/form/input/input-field.component";
import { ButtonComponent } from "app/shared/components/ui/button/button.component";
import { SelectComponent, Option } from "app/shared/components/form/select/select.component";

@Component({
  selector: 'app-edit-user',
  imports: [ComponentCardComponent, AlertComponent, LabelComponent, InputFieldComponent, ButtonComponent, SelectComponent],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.css'
})
export class EditUserComponent implements OnInit {

  userId: number | null = null;
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
    status: '0',
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
  loading: boolean = true;

  constructor(
    private userApiService: UserApiService, 
    public router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Get user ID from route parameters
    this.route.params.subscribe(params => {
      this.userId = +params['id'];
      if (this.userId) {
        this.loadUserData();
      }
    });
  }

  loadUserData(): void {
    if (!this.userId) return;
    
    this.userApiService.getUserById(this.userId).subscribe({
      next: (res) => {
        const user = res.data;
        this.userForm = {
          username: user.username || '',
          email: user.email || '',
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          password: '', // Don't pre-fill password for security
          role: user.role || '',
          status: user.status?.toString() || '0'
        };
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading user:', err);
        this.error = true;
        this.loading = false;
      }
    });
  }

  onSubmit() {
    this.disabled = true;
    if(this.validation() && this.userId){
      console.log("updating user...");
      console.log("Form data being sent:", this.userForm);
      
      // Remove password from update if it's empty
      const updateData: any = { ...this.userForm };
      if (!updateData.password.trim()) {
        delete updateData.password;
      }
      
      this.userApiService.updateUserById(this.userId, updateData).subscribe({
        next: (res) => {
          console.log("user updated successfully.");
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
  
  validation() {
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
  
    // Password is optional for updates
    if (!this.userForm.role.trim()) {
      this.errors.role = true;
      valid = false;
    }
  
    if (!valid) {
      console.warn('Form invalid:', this.errors);
    }
  
    return valid;
  }
  
  onFieldChange(field: keyof typeof this.userForm, value: string | number) {
    (this.userForm as any)[field] = String(value);
  }
}
