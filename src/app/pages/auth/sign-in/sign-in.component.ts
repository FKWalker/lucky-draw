import { Component } from '@angular/core';
import { AuthPageLayoutComponent } from '../../../shared/layout/auth-page-layout/auth-page-layout.component';
import { SigninFormComponent } from '../../../shared/components/auth/signin-form/signin-form.component';
import { AuthService } from 'app/shared/services/auth.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LabelComponent } from 'app/shared/components/form/label/label.component';
import { CheckboxComponent } from 'app/shared/components/form/input/checkbox.component';
import { ButtonComponent } from 'app/shared/components/ui/button/button.component';
import { InputFieldComponent } from 'app/shared/components/form/input/input-field.component';
import { FormsModule } from '@angular/forms';
import { ToastService } from 'app/shared/services/toast.service';

@Component({
  selector: 'app-sign-in',
  imports: [
    AuthPageLayoutComponent,
    CommonModule,
    LabelComponent,
    CheckboxComponent,
    ButtonComponent,
    InputFieldComponent,
    RouterModule,
    FormsModule,
  ],
  templateUrl: './sign-in.component.html',
  styles: ``
})
export class SignInComponent {
  
  identifier = '';
  password = '';

  showPassword = false;
  isChecked = false;
  isLoading = false;

  errorMessage = '';

  constructor(
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute 
  ) {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  async onSignIn() {

    if (!this.identifier || !this.password) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {

      const result = await this.authService.signIn(
        this.identifier,
        this.password
      );

      console.log(result);

      this.toastService.success(
        'Login Successful!',
        `Welcome Back!`,
        3000
      );

       const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');

      console.log('returnUrl:', returnUrl);

      await this.router.navigateByUrl(returnUrl || '');

    } catch (error: any) {

      console.error('Login failed:', error);

      this.errorMessage =
        error?.message || 'Invalid email or password.';

      this.toastService.error('Login Failed', this.errorMessage, 3000);

    } finally {
      this.isLoading = false;
    }
  }
}
