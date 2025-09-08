import { Component, OnInit, ViewChild } from '@angular/core';
import { ComponentCardComponent } from "app/shared/components/common/component-card/component-card.component";
import { AlertComponent } from "app/shared/components/ui/alert/alert.component";
import { LabelComponent } from "app/shared/components/form/label/label.component";
import { InputFieldComponent } from "app/shared/components/form/input/input-field.component";
import { FileInputComponent } from "app/shared/components/form/input/file-input.component";
import { ButtonComponent } from "app/shared/components/ui/button/button.component";
import { TeamApiService } from 'app/shared/services/team-api.service';
import { Router } from '@angular/router';
import { ImageUploadComponent } from "app/shared/components/form/image-upload/image-upload.component";

@Component({
  selector: 'app-edit-team-member',
  imports: [ComponentCardComponent, AlertComponent, LabelComponent, InputFieldComponent, FileInputComponent, ButtonComponent, ImageUploadComponent],
  templateUrl: './edit-team-member.component.html',
  styleUrl: './edit-team-member.component.css'
})
export class EditTeamMemberComponent implements OnInit{
  
  teamMemberForm: {
    name: string | number;
    profile_image: string | number;
    position: string | number;
  } = {
    name: '',
    profile_image: '',
    position: ''
  };

  errors = {
    name: false,
    profile_image: false,
    position: false
  }
  disabled: boolean = false;
  success: any;
  error: any;
  id : any;

  @ViewChild('fileUpload') fileUpload!: FileInputComponent;

  constructor(private teamApiService: TeamApiService, private router: Router) {}

  ngOnInit(){
    const member = history.state.member;
    if(!member){
      this.router.navigate(['/team/listing']);
    }else{
      this.id = member.id;
      this.teamMemberForm.name = member.name;
      this.teamMemberForm.profile_image = member.profile_image;
      this.teamMemberForm.position = member.position;
    }
  }

  onSubmit() {
    this.disabled = true;
    if(this.validation()){
      let options: any = {
        name: this.teamMemberForm.name,
        profile_image: this.teamMemberForm.profile_image,
        position: this.teamMemberForm.position,
        updated_by: "donAdmin"
      }
      this.teamApiService.updateTeamMember(this.id, options).subscribe({
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
      console.log("Selected file:", file.name);
      this.teamMemberForm.profile_image = file.name;
    }
  }
  
  validation(){
    // reset errors
    this.errors = {
      name: false,
      profile_image: false,
      position: false
    };

    let valid = true;

    if (!String(this.teamMemberForm.name).trim()) {
      this.errors.name = true;
      valid = false;
    }

    if (!String(this.teamMemberForm.profile_image).trim()) {
      this.errors.profile_image = true;
      valid = false;
    }

    if (!String(this.teamMemberForm.position).trim()) {
      this.errors.position = true;
      valid = false;
    }

    if (!valid) {
      console.warn('Form invalid:', this.errors);
    }

    return valid;
  }
  
  createTeamMember(options: any){
    
  }
}
