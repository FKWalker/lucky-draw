import { Component, ViewChild } from '@angular/core';
import { ComponentCardComponent } from "app/shared/components/common/component-card/component-card.component";
import { AlertComponent } from "app/shared/components/ui/alert/alert.component";
import { LabelComponent } from "app/shared/components/form/label/label.component";
import { InputFieldComponent } from "app/shared/components/form/input/input-field.component";
import { TextAreaComponent } from "app/shared/components/form/input/text-area.component";
import { DatePickerComponent } from "app/shared/components/form/date-picker/date-picker.component";
import { ImageUploadComponent } from "app/shared/components/form/image-upload/image-upload.component";
import { ButtonComponent } from "app/shared/components/ui/button/button.component";
import { SelectComponent } from "app/shared/components/form/select/select.component";
import { FileInputComponent } from 'app/shared/components/form/input/file-input.component';
import { NewsApiService } from 'app/shared/services/news-api.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-news',
  imports: [ComponentCardComponent, AlertComponent, LabelComponent, InputFieldComponent, TextAreaComponent, DatePickerComponent, ImageUploadComponent, ButtonComponent, SelectComponent],
  templateUrl: './edit-news.component.html',
  styleUrl: './edit-news.component.css'
})
export class EditNewsComponent {

  newsForm: {
    news_image: string | number;
    headline: any;
    filter: any;
    title: any;
    description: any;
    published_at: string | number;
    active: string | number;
  } = {
    news_image: '',
     headline: {
      en: '',
      ja: '',
      zh: ''
    },
    filter: {
      en: '',
      ja: '',
      zh: ''
    },
    title: {
      en: '',
      ja: '',
      zh: ''
    },
    description: {
      en: '',
      ja: '',
      zh: ''
    },
    published_at: '',
    active: ''
  };

  errors = {
    news_image: false,
    headline: {
      en: false,
    },
    filter: {
      en: false
    },
    title: {
      en: false
    },
    description: {
      en: false
    },
    active: false
  }
  disabled: boolean = false;
  success: any;
  error: any;
  selectedFile: File | null = null;
  currentDate: any;

  activeOptions = [
    { value: 'true', label: 'Active' },
    { value: 'false', label: 'Inactive' }
  ];

  id : any;

  @ViewChild('fileUpload') fileUpload!: FileInputComponent;

  constructor(private newsApiService: NewsApiService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');

      if (!idParam) {
        // No ID provided, navigate away
        this.router.navigate(['/news/listing']);
        return;
      }

      this.id = Number(idParam);
      if (isNaN(this.id)) {
        // Invalid ID, redirect
        this.router.navigate(['/news/listing']);
        return;
      }

      this.getNewsById(this.id);
      
    });
    
  }

  onSubmit() {
    this.disabled = true;
    if(this.validation()){

      const formData = new FormData();
      formData.append('headline', JSON.stringify(this.newsForm.headline));
      formData.append('filter', JSON.stringify(this.newsForm.filter));
      formData.append('title', JSON.stringify(this.newsForm.title));
      formData.append('description', JSON.stringify(this.newsForm.description));
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
      this.newsApiService.updateNews(this.id, formData).subscribe({
        next: (res) => {
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
      news_image: false,
      headline: {
        en: false,
      },
      filter: {
        en: false
      },
      title: {
        en: false
      },
      description: {
        en: false
    },
      active: false
    };

    let valid = true;

     if (!String(this.newsForm.headline.en).trim()) {
      this.errors.headline.en = true;
      valid = false;
    }

    if (!String(this.newsForm.filter.en).trim()) {
      this.errors.filter.en = true;
      valid = false;
    }

    if (!String(this.newsForm.title.en).trim()) {
      this.errors.title.en = true;
      valid = false;
    }

    if (!String(this.newsForm.description.en).trim()) {
      this.errors.description.en = true;
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

  getNewsById(id: any){
    this.newsApiService.getNewsById(id).subscribe({
      next: (res) => {
        this.id = res.data.id;
        this.newsForm.news_image = res.data.news_image;
        this.newsForm.headline = res.data.headline;
        this.newsForm.filter = res.data.filter;
        this.newsForm.title = res.data.title;
        this.newsForm.description = res.data.description;
        this.currentDate = res.data.published_at
        ? new Date(res.data.published_at)
        : new Date();
        this.newsForm.active = res.data.active;
      },
      error: (err) => {
        this.router.navigate(['/news/listing']);
      }
    })
  }

}
