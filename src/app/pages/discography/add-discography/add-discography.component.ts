import { Component, ViewChild } from '@angular/core';
import { ComponentCardComponent } from "app/shared/components/common/component-card/component-card.component";
import { AlertComponent } from "app/shared/components/ui/alert/alert.component";
import { LabelComponent } from "app/shared/components/form/label/label.component";
import { InputFieldComponent } from "app/shared/components/form/input/input-field.component";
import { ImageUploadComponent } from "app/shared/components/form/image-upload/image-upload.component";
import { ButtonComponent } from "app/shared/components/ui/button/button.component";
import { SelectComponent } from "app/shared/components/form/select/select.component";
import { FileInputComponent } from 'app/shared/components/form/input/file-input.component';
import { DiscographyApiService } from 'app/shared/services/discography-api.service';
import { ArtistApiService } from 'app/shared/services/artist-api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-discography',
  imports: [ComponentCardComponent, AlertComponent, LabelComponent, InputFieldComponent, ImageUploadComponent, ButtonComponent, SelectComponent],
  templateUrl: './add-discography.component.html',
  styleUrl: './add-discography.component.css'
})
export class AddDiscographyComponent {

  discographyForm: {
    name: string | number;
    release_year: string | number;
    filter: string | number;
    description: string | number;
    active: string | number;
    artist_id: string | number;
  } = {
    name: '',
    release_year: '',
    filter: '',
    description: '',
    active: '',
    artist_id: ''
  };

  errors = {
    profile_image: false,
    name: false,
    release_year: false,
    filter: false,
    description: false,
    active: false,
    artist_id: false
  }
  disabled: boolean = false;
  success: any;
  error: any;
  selectedFile: File | null = null;

  @ViewChild('fileUpload') fileUpload!: FileInputComponent;

  artistOptions:any = [];

  socialMedias: { platform: string | number; url: string | number}[] = [];
  socialMediasErrors: { platform?: string; url?: string }[] = [];

  activeOptions = [
    { value: 'true', label: 'Active' },
    { value: 'false', label: 'Inactive' }
  ];

  constructor(private discographyApiService: DiscographyApiService, private router: Router, private artistApiService: ArtistApiService) {}

  ngOnInit(): void {
    const artistsOptions: any = {
      limit: 100
    };
    this.getAllArtists(artistsOptions);
  }

  handleFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.selectedFile = file;
    }
  }

  handleArtistSelectChange(value: string) {
    this.discographyForm.artist_id = value;
  }

  handleActiveSelectChange(value: string) {
    this.discographyForm.active = value;
  }

  onSubmit() {
    this.disabled = true;
    if(this.validation()){

      const formData = new FormData();
      formData.append('name', this.discographyForm.name.toString());
      formData.append('release_year', this.discographyForm.release_year.toString());
      formData.append('filter', this.discographyForm.filter.toString());
      formData.append('description', this.discographyForm.description.toString());
      formData.append('social_media', JSON.stringify(this.socialMediaObject));
      formData.append('active', this.discographyForm.active.toString());
      formData.append('artist_id', this.discographyForm.artist_id.toString());

      if (this.selectedFile) {
        formData.append('profile_image', this.selectedFile); 
        formData.append('profile_filename', this.selectedFile.name);
        formData.append('profile_path', 'discography');
      }
      console.log('--- FormData contents ---');
        formData.forEach((value, key) => {
        console.log(key, value);
      });
      this.discographyApiService.createDiscography(formData).subscribe({
        next: (res) => {
          // ✅ Reset form after success
          this.discographyForm = {
            name: '',
            release_year: '',
            filter: '',
            description: '',
            active: '',
            artist_id: ''
          };
          this.socialMedias = [];
          this.fileUpload.reset();
          this.success = true;
          this.error = null;
          this.disabled = false;
        },
        error: (err) => {
          console.error('API Error:', err);
          this.error = true;
          this.success = null;
          this.disabled = false;
        }
      })
      
    }else{
      this.disabled = false;
    }
  }

  get socialMediaObject() {
    return this.socialMedias.reduce((acc, item) => {
      if (item.platform.toString().trim() && item.url.toString().trim()) {
        acc[item.platform.toString().trim()] = item.url.toString().trim();
      }
      return acc;
    }, {} as Record<string, string>);
  }
  
  getAllArtists(options: any){
    this.artistApiService.getAllArtists(options).subscribe({
      next: (res) => {
       for(let artist of res.data.artists){
          let artistOption: any = {};
          artistOption.value = artist.id;
          artistOption.label = artist.first_name + ' ' + artist.last_name;
          this.artistOptions.push(artistOption);
       }
      },
      error: (err) => {
        console.error('API Error:', err);
      }
    })
  }

  addSocialMedia() {
    this.socialMedias.push({ platform: '', url: '' });
    this.socialMediasErrors.push({});
  }

  removeSocialMedia(index: number) {
    this.socialMedias.splice(index, 1);
    this.socialMediasErrors.splice(index, 1);
  }

  validateSocialMedias(): boolean {
    let isValid = true;
    this.socialMediasErrors = this.socialMedias.map((sm) => {
      const error: { platform?: string; url?: string } = {};
      if (!sm.platform.toString().trim()) {
        error.platform = 'Platform is required';
        isValid = false;
      }
      if (!sm.url.toString().trim()) {
        error.url = 'URL is required';
        isValid = false;
      }
      return error;
    });
    return isValid;
  }

  validation(){
    // reset errors
    this.errors = {
      profile_image: false,
      name: false,
      release_year: false,
      filter: false,
      description: false,
      active: false,
      artist_id: false
    }

    let valid = true;

    if (!this.selectedFile) {
      this.errors.profile_image = true;
      valid = false;
    }

    if (!String(this.discographyForm.name).trim()) {
      this.errors.name = true;
      valid = false;
    }

    if (!String(this.discographyForm.release_year).trim()) {
      this.errors.release_year = true;
      valid = false;
    }

    if (!String(this.discographyForm.filter).trim()) {
      this.errors.filter = true;
      valid = false;
    }

    if (!String(this.discographyForm.description).trim()) {
      this.errors.description = true;
      valid = false;
    }

    if(!this.validateSocialMedias()){
      valid = false;
    }

    if (!String(this.discographyForm.active).trim()) {
      this.errors.active = true;
      valid = false;
    }

    if (!String(this.discographyForm.artist_id).trim()) {
      this.errors.artist_id = true;
      valid = false;
    }

    if (!valid) {
      console.warn('Form invalid:', this.errors);
    }

    return valid;
  }

}
