import { Component, ViewChild } from '@angular/core';
import { ComponentCardComponent } from "app/shared/components/common/component-card/component-card.component";
import { InputFieldComponent } from "app/shared/components/form/input/input-field.component";
import { LabelComponent } from "app/shared/components/form/label/label.component";
import { FileInputComponent } from "app/shared/components/form/input/file-input.component";
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from "app/shared/components/ui/button/button.component";
import { TeamApiService } from 'app/shared/services/team-api.service';
import { AlertComponent } from "app/shared/components/ui/alert/alert.component";
import { ImageUploadComponent } from "app/shared/components/form/image-upload/image-upload.component";

@Component({
  selector: 'app-add-team-member',
  imports: [ComponentCardComponent, InputFieldComponent, LabelComponent, ReactiveFormsModule, ButtonComponent, AlertComponent, ImageUploadComponent],
  templateUrl: './add-team-member.component.html',
  styleUrl: './add-team-member.component.css'
})
export class AddTeamMemberComponent {
  
  teamMemberForm: {
    first_name: string | number;
    last_name: string | number;
    position: any;
  } = {
    first_name: '',
    last_name: '',
    position: {
      en: '',
      ja: '',
      zh: ''
    }
  };

  errors = {
    first_name: false,
    last_name: false,
    profile_image: false,
    position: {
      en: false
    }
  }
  disabled: boolean = false;
  success: any;
  error: any;
  selectedFile: File | null = null;

  @ViewChild('fileUpload') fileUpload!: FileInputComponent;

  constructor(private teamApiService: TeamApiService) {}

  onSubmit() {
    this.disabled = true;
    if(this.validation()){

      const formData = new FormData();
      formData.append('first_name', this.teamMemberForm.first_name.toString());
      formData.append('last_name', this.teamMemberForm.last_name.toString());
      formData.append('position', JSON.stringify(this.teamMemberForm.position));
      if (this.selectedFile) {
        formData.append('profile_image', this.selectedFile); 
        formData.append('profile_filename', this.selectedFile.name);
        formData.append('profile_path', 'homepage');
      }
      console.log('--- FormData contents ---');
        formData.forEach((value, key) => {
        console.log(key, value);
      });
      this.teamApiService.createTeamMember(formData).subscribe({
        next: (res) => {
          // ✅ Reset form after success
          this.teamMemberForm = {
            first_name: '',
            last_name: '',
            position: {
              en: '',
              ja: '',
              zh: ''
            }
          };
          this.fileUpload.reset();
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

    if (!this.selectedFile) {
      this.errors.profile_image = true;
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
}
