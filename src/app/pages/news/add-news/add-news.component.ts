import { Component, ViewChild } from '@angular/core';
import { FileInputComponent } from 'app/shared/components/form/input/file-input.component';
import { NewsApiService } from 'app/shared/services/news-api.service';
import { ComponentCardComponent } from "app/shared/components/common/component-card/component-card.component";
import { AlertComponent } from "app/shared/components/ui/alert/alert.component";
import { LabelComponent } from "app/shared/components/form/label/label.component";
import { InputFieldComponent } from "app/shared/components/form/input/input-field.component";
import { ImageUploadComponent } from "app/shared/components/form/image-upload/image-upload.component";
import { ButtonComponent } from "app/shared/components/ui/button/button.component";
import { DatePickerComponent } from "app/shared/components/form/date-picker/date-picker.component";
import { SelectComponent } from "app/shared/components/form/select/select.component";

@Component({
  selector: 'app-add-news',
  imports: [ComponentCardComponent, AlertComponent, LabelComponent, InputFieldComponent, ImageUploadComponent, ButtonComponent, DatePickerComponent, SelectComponent],
  templateUrl: './add-news.component.html',
  styleUrl: './add-news.component.css'
})
export class AddNewsComponent {

  newsForm: {
    headline: string | number;
    filter: string | number;
    title: string | number;
    description: string | number;
    published_at: string | number;
    active: string | number;
  } = {
    headline: '',
    filter: '',
    title: '',
    description: '',
    published_at: '',
    active: ''
  };

  errors = {
    news_image: false,
    headline: false,
    filter: false,
    title: false,
    description: false,
    active: false
  }
  disabled: boolean = false;
  success: any;
  error: any;
  selectedFile: File | null = null;
  currentDate = new Date();

  activeOptions = [
    { value: 'true', label: 'true' },
    { value: 'false', label: 'false' }
  ];

  @ViewChild('fileUpload') fileUpload!: FileInputComponent;

  constructor(private newsApiService: NewsApiService) {}

  onSubmit() {
    this.disabled = true;
    if(this.validation()){

      const formData = new FormData();
      formData.append('headline', this.newsForm.headline.toString());
      formData.append('filter', this.newsForm.filter.toString());
      formData.append('title', this.newsForm.title.toString());
      formData.append('description', this.newsForm.description.toString());
      formData.append('published_at', this.newsForm.published_at.toString());
      formData.append('active', this.newsForm.active.toString());
      if (this.selectedFile) {
        formData.append('news_image', this.selectedFile); 
        formData.append('image_filename', this.selectedFile.name);
        formData.append('image_path', 'news');
      }
      console.log('--- FormData contents ---');
        formData.forEach((value, key) => {
        console.log(key, value);
      });
      this.newsApiService.createNews(formData).subscribe({
        next: (res) => {
          // ✅ Reset form after success
          this.newsForm = {
            headline: '',
            filter: '',
            title: '',
            description: '',
            published_at: '',
            active: '',
          };
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
      news_image: false,
      headline: false,
      filter: false,
      title: false,
      description: false,
      active: false
    };

    let valid = true;

    if (!this.selectedFile) {
      this.errors.news_image = true;
      valid = false;
    }

    if (!String(this.newsForm.headline).trim()) {
      this.errors.headline = true;
      valid = false;
    }

    if (!String(this.newsForm.filter).trim()) {
      this.errors.filter = true;
      valid = false;
    }

    if (!String(this.newsForm.title).trim()) {
      this.errors.title = true;
      valid = false;
    }

    if (!String(this.newsForm.description).trim()) {
      this.errors.description = true;
      valid = false;
    }

    if (!String(this.newsForm.active).trim()) {
      this.errors.active = true;
      valid = false;
    }

    if (!valid) {
      console.warn('Form invalid:', this.errors);
    }

    return valid;
  }

  handleDateChange(event: any) {
    this.newsForm.published_at = event.dateStr;
  }

  handleActiveSelectChange(value: string) {
    this.newsForm.active = value;
  }

}
