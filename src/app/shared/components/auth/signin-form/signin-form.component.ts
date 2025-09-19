import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LabelComponent } from '../../form/label/label.component';
import { CheckboxComponent } from '../../form/input/checkbox.component';
import { ButtonComponent } from '../../ui/button/button.component';
import { InputFieldComponent } from '../../form/input/input-field.component';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserApiService } from 'app/shared/services/user-api.service';
import { AuthService, LoginResponse } from 'app/shared/services/auth.service';
import { ToastService } from 'app/shared/services/toast.service';

@Component({
  selector: 'app-signin-form',
  imports: [
    CommonModule,
    LabelComponent,
    CheckboxComponent,
    ButtonComponent,
    InputFieldComponent,
    RouterModule,
    FormsModule,
  ],
  templateUrl: './signin-form.component.html',
  styles: ``
})
export class SigninFormComponent {

  constructor(
    private userApiService: UserApiService,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {}

  showPassword = false;
  isChecked = false;

  identifier = '';
  password = '';

  isLoading = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSignIn() {
    this.isLoading = true;

    // Create JSON object instead of FormData
    const loginData = {
      identifier: this.identifier,
      password: this.password
    };

    this.userApiService.login(loginData).subscribe({
      next: (res: LoginResponse) => {
        // ✅ Reset form after success
        this.identifier = '';
        this.password = '';
        this.isLoading = false;

        // Store authentication data
        this.authService.login(res);

        // Show success toast
        this.toastService.success(
          'Login Successful!',
          `Welcome back, ${res.data.user.firstName}!`
        );

        // Redirect to dashboard page if login is successful
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('API Error:', err);
        this.isLoading = false;

        // Show error toast
        const errorMessage = err.error?.message || err.message || 'Login failed. Please try again.';
        this.toastService.error(
          'Login Failed',
          errorMessage
        );
      }
    })

  }
}
