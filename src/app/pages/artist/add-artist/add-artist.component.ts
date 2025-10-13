import { Component, ViewChild } from '@angular/core';
import { FileInputComponent } from 'app/shared/components/form/input/file-input.component';
import { ArtistApiService } from 'app/shared/services/artist-api.service';
import { ComponentCardComponent } from "app/shared/components/common/component-card/component-card.component";
import { AlertComponent } from "app/shared/components/ui/alert/alert.component";
import { LabelComponent } from "app/shared/components/form/label/label.component";
import { InputFieldComponent } from "app/shared/components/form/input/input-field.component";
import { TextAreaComponent } from "app/shared/components/form/input/text-area.component";
import { ImageUploadComponent } from "app/shared/components/form/image-upload/image-upload.component";
import { ButtonComponent } from "app/shared/components/ui/button/button.component";

@Component({
  selector: 'app-add-artist',
  imports: [ComponentCardComponent, AlertComponent, LabelComponent, InputFieldComponent, TextAreaComponent, ImageUploadComponent, ButtonComponent],
  templateUrl: './add-artist.component.html',
  styleUrl: './add-artist.component.css'
})
export class AddArtistComponent {

  artistForm: {
    first_name: string | number;
    last_name: string | number;
    biography: any;
  } = {
    first_name: '',
    last_name: '',
    biography: {
      en: '',
      ja: '',
      zh: ''
    }
  };

  errors = {
    first_name: false,
    last_name: false,
    profile_image: false,
    biography: {
      en: false
    }
  }
  disabled: boolean = false;
  success: any;
  error: any;
  selectedFile: File | null = null;

  @ViewChild('fileUpload') fileUpload!: FileInputComponent;

  constructor(private artistApiService: ArtistApiService) {}

  onSubmit() {
    this.disabled = true;
    if(this.validation()){

      const formData = new FormData();
      formData.append('first_name', this.artistForm.first_name.toString());
      formData.append('last_name', this.artistForm.last_name.toString());
      formData.append('biography', JSON.stringify(this.artistForm.biography));
      if (this.selectedFile) {
        formData.append('profile_image', this.selectedFile); 
        formData.append('profile_filename', this.selectedFile.name);
        formData.append('profile_path', 'artist');
      }
      console.log('--- FormData contents ---');
        formData.forEach((value, key) => {
        console.log(key, value);
      });
      this.artistApiService.createArtist(formData).subscribe({
        next: (res) => {
          // ✅ Reset form after success
          this.artistForm = {
            first_name: '',
            last_name: '',
            biography: {
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
      biography: {
        en: false
      }
    };

    let valid = true;

    if (!String(this.artistForm.first_name).trim()) {
      this.errors.first_name = true;
      valid = false;
    }

    if (!this.selectedFile) {
      this.errors.profile_image = true;
      valid = false;
    }

    if (!String(this.artistForm.biography.en).trim()) {
      this.errors.biography.en = true;
      valid = false;
    }

    if (!valid) {
      console.warn('Form invalid:', this.errors);
    }

    return valid;
  }

}
