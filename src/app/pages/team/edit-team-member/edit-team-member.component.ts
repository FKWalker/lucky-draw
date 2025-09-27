import { Component, OnInit, ViewChild } from '@angular/core';
import { ComponentCardComponent } from "app/shared/components/common/component-card/component-card.component";
import { AlertComponent } from "app/shared/components/ui/alert/alert.component";
import { LabelComponent } from "app/shared/components/form/label/label.component";
import { InputFieldComponent } from "app/shared/components/form/input/input-field.component";
import { FileInputComponent } from "app/shared/components/form/input/file-input.component";
import { ButtonComponent } from "app/shared/components/ui/button/button.component";
import { TeamApiService } from 'app/shared/services/team-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ImageUploadComponent } from "app/shared/components/form/image-upload/image-upload.component";
import { AuthService } from 'app/shared/services/auth.service';

@Component({
  selector: 'app-edit-team-member',
  imports: [ComponentCardComponent, AlertComponent, LabelComponent, InputFieldComponent, ButtonComponent, ImageUploadComponent],
  templateUrl: './edit-team-member.component.html',
  styleUrl: './edit-team-member.component.css'
})
export class EditTeamMemberComponent implements OnInit{
  
  teamMemberForm: {
    profile_image: string | number;
    first_name: string | number;
    last_name: string | number;
    position: any;
  } = {
    profile_image: '',
    first_name: '',
    last_name: '',
    position: {
      en: '',
      ja: '',
      zh: ''
    }
  };

  errors = {
    profile_image: false,
    first_name: false,
    last_name: false,
    position: {
      en: false
    }
  }
  disabled: boolean = false;
  success: any;
  error: any;
  id : any;
  selectedFile: File | null = null;

  @ViewChild('fileUpload') fileUpload!: FileInputComponent;

  constructor(
    private teamApiService: TeamApiService,
    private authService: AuthService, 
    private router: Router, 
    private route: ActivatedRoute) {}

  ngOnInit(){
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');

      if (!idParam) {
        // No ID provided, navigate away
        this.router.navigate(['/team/listing']);
        return;
      }

      this.id = Number(idParam);
      if (isNaN(this.id)) {
        // Invalid ID, redirect
        this.router.navigate(['/team/listing']);
        return;
      }

      // ✅ Call API to fetch by ID
      this.getTeamMemberById(this.id);
    });
  }

  onSubmit() {
    this.disabled = true;
    if(this.validation()){
      const formData = new FormData();
      formData.append('first_name', this.teamMemberForm.first_name.toString());
      formData.append('last_name', this.teamMemberForm.last_name ? this.teamMemberForm.last_name.toString() : '');
      formData.append('position', JSON.stringify(this.teamMemberForm.position));
      
      if (this.selectedFile) {
        formData.append('profile_image', this.selectedFile); 
        formData.append('profile_filename', this.selectedFile.name);
        formData.append('profile_path', 'homepage');
      }

      const currentUser = this.authService.getCurrentUser();
      formData.append('updated_by', currentUser ? currentUser.username.toString() : '');

      this.teamApiService.updateTeamMember(this.id, formData).subscribe({
        next: (res) => {
          // ✅ Reset form after success
          this.success = true;
          this.error = null;
          this.disabled = false;
          window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        error: (err) => {
          console.error('API Error:', err);
          this.error = true;
          this.success = null;
          this.disabled = false;
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      })
    }else{
      this.disabled = false;
    }
  }

  handleFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.selectedFile = file;
    }
  }
  
  validation(){
    // reset errors
    this.errors = {
      first_name: false,
      last_name: false,
      profile_image: false,
      position: {
      en: false
    }
    };

    let valid = true;

    if (!String(this.teamMemberForm.first_name).trim()) {
      this.errors.first_name = true;
      valid = false;
    }

    if (!String(this.teamMemberForm.position.en).trim()) {
      this.errors.position.en = true;
      valid = false;
    }

    if (!valid) {
      console.warn('Form invalid:', this.errors);
    }

    return valid;
  }

  getTeamMemberById(id: any){
    this.teamApiService.getTeamMemberById(id).subscribe({
      next: (res) => {
        this.id = res.data.id;
        this.teamMemberForm.first_name = res.data.first_name;
        this.teamMemberForm.last_name = res.data.last_name;
        this.teamMemberForm.profile_image = res.data.profile_image;
        this.teamMemberForm.position = res.data.position;
      },
      error: (err) => {
        this.router.navigate(['/team/listing']);
      }
    })
  }
}
