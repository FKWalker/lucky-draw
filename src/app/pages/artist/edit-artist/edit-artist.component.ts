import { Component, ViewChild } from '@angular/core';
import { ComponentCardComponent } from "app/shared/components/common/component-card/component-card.component";
import { AlertComponent } from "app/shared/components/ui/alert/alert.component";
import { LabelComponent } from "app/shared/components/form/label/label.component";
import { InputFieldComponent } from "app/shared/components/form/input/input-field.component";
import { ImageUploadComponent } from "app/shared/components/form/image-upload/image-upload.component";
import { ButtonComponent } from "app/shared/components/ui/button/button.component";
import { FileInputComponent } from 'app/shared/components/form/input/file-input.component';
import { ArtistApiService } from 'app/shared/services/artist-api.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-artist',
  imports: [ComponentCardComponent, AlertComponent, LabelComponent, InputFieldComponent, ImageUploadComponent, ButtonComponent],
  templateUrl: './edit-artist.component.html',
  styleUrl: './edit-artist.component.css'
})
export class EditArtistComponent {

  artistForm: {
    profile_image: string | number;
    first_name: string | number;
    last_name: string | number;
    biography: string | number;
  } = {
    profile_image: '',
    first_name: '',
    last_name: '',
    biography: ''
  };

  errors = {
    profile_image: false,
    first_name: false,
    last_name: false,
    biography: false
  }
  disabled: boolean = false;
  success: any;
  error: any;
  id : any;
  selectedFile: File | null = null;

  @ViewChild('fileUpload') fileUpload!: FileInputComponent;

  constructor(private artistApiService: ArtistApiService, private router: Router, private route: ActivatedRoute) {}

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
      formData.append('first_name', this.artistForm.first_name.toString());
      formData.append('last_name', this.artistForm.first_name.toString());
      formData.append('position', this.artistForm.biography.toString());
      if (this.selectedFile) {
        formData.append('profile_image', this.selectedFile); 
        formData.append('profile_filename', this.selectedFile.name);
        formData.append('profile_path', 'artist');
      }
      this.artistApiService.updateArtist(this.id, formData).subscribe({
        next: (res) => {
          // ✅ Reset form after success
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
      biography: false
    };

    let valid = true;

    if (!String(this.artistForm.first_name).trim()) {
      this.errors.first_name = true;
      valid = false;
    }

    if (!String(this.artistForm.last_name).trim()) {
      this.errors.last_name = true;
      valid = false;
    }

    if (!String(this.artistForm.biography).trim()) {
      this.errors.biography = true;
      valid = false;
    }

    if (!valid) {
      console.warn('Form invalid:', this.errors);
    }

    return valid;
  }

  getTeamMemberById(id: any){
    this.artistApiService.getArtistById(id).subscribe({
      next: (res) => {
        this.id = res.data.id;
        this.artistForm.first_name = res.data.first_name;
        this.artistForm.last_name = res.data.last_name;
        this.artistForm.profile_image = res.data.profile_image;
        this.artistForm.biography = res.data.biography;
      },
      error: (err) => {
        this.router.navigate(['/artist/listing']);
      }
    })
  }

}
