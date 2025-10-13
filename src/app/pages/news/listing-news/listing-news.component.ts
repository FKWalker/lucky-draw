import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertComponent } from "app/shared/components/ui/alert/alert.component";
import { ComponentCardComponent } from "app/shared/components/common/component-card/component-card.component";
import { LabelComponent } from "app/shared/components/form/label/label.component";
import { SelectComponent } from "app/shared/components/form/select/select.component";
import { InputFieldComponent } from "app/shared/components/form/input/input-field.component";
import { ButtonComponent } from "app/shared/components/ui/button/button.component";
import { CustomTableComponent } from "app/shared/components/tables/basic-tables/custom-table/custom-table.component";
import { LoadingSpinnerComponent } from "app/shared/components/ui/loading-spinner/loading-spinner.component";
import { NewsApiService } from 'app/shared/services/news-api.service';

@Component({
  selector: 'app-listing-news',
  imports: [AlertComponent, ComponentCardComponent, LabelComponent, SelectComponent, InputFieldComponent, ButtonComponent, CustomTableComponent, LoadingSpinnerComponent],
  templateUrl: './listing-news.component.html',
  styleUrl: './listing-news.component.css'
})
export class ListingNewsComponent {

  newsForm: {
    active: string | number;
    filter: string | number;
    search: string | number;
  } = {
    active: '',
    filter: '',
    search: ''
  };

  // Column definitions
  columns = [
    { key: 'headline', label: 'headline' },
    { key: 'filter', label: 'Filter' },
    { key: 'title', label: 'Title' },
    { key: 'description', label: 'Description' },
    { key: 'published_at', label: 'Published At' },
    { key: 'active', label: 'Status' },
  ];

  // Dummy data
  news = [];

  // Pagination
  currentPage: number = 1;
  totalPages: number = 1;
  itemsPerPage = 10;

  success: any;
  error: any;
  isLoading: boolean = false;

  artistOptions:any = [];

  selectedValue = '';
  disabled: boolean = false;

  activeOptions = [
    { value: 'true', label: 'Yes' },
    { value: 'false', label: 'No' }
  ];

  constructor(private newsApiService: NewsApiService, private router: Router) {}

  ngOnInit(): void {
    const newsOptions: any = {};
    this.getAllNews(newsOptions);
  }

  getAllNews(options: any){
    this.isLoading = true;
    this.newsApiService.getAllNews(options).subscribe({
      next: (res) => {
        this.currentPage = res.data.pagination.currentPage;
        this.totalPages = res.data.pagination.totalPages;
        this.itemsPerPage = res.data.pagination.itemsPerPage;

        this.news = res.data.news.map((news: any) => ({
          ...news,
          headline: this.getHeadline(news.headline),
          filter: this.getFilter(news.filter),
          title: this.getTitle(news.title),
          description: this.getDescription(news.description),
          active: this.getActiveLabel(news.active)
        }));
        this.isLoading = false;
      },
      error: (err) => {
        console.error('API Error:', err);
        this.isLoading = false;
      }
    })
  }

  // Handle page change from table
  loadPage(page: number) {
    this.currentPage = page;
    const options: any = {
      page: this.currentPage
    };

    Object.entries(this.newsForm).forEach(([key, value]) => {
      if (
        value !== '' &&              // not empty string
        value !== null &&            // not null
        value !== undefined &&       // not undefined
        !(typeof value === 'number' && value === 0) // skip 0 for numbers
      ) {
        options[key] = value;
      }
    });
    this.getAllNews(options);
  }

  // Handle search from table
  onSearch(query: string) {
    const options: any = {
      search: query
    };
    this.getAllNews(options);
  }

  action(event: { action: string; row: any }) {
    if(event.action === 'update'){
      this.router.navigate(['/news/edit', event.row.id]);
    }
    if(event.action === 'delete'){
      this.deleteDiscography(event.row.id);
    }
  }

  deleteDiscography(id: number){
    this.newsApiService.deleteNews(id).subscribe({
      next: (res) => {
        const options: any = {};
        this.getAllNews(options);
        this.success = true;
        this.error = null;
      },
      error: (err) => {
        console.error('API Error:', err);
        this.error = true;
        this.success = null;
      }
    })
  }

  handleActiveSelectChange(value: string) {
    this.newsForm.active = value;
  }

  onSubmit() {
    const options: any = {
      page: this.currentPage
    };

    Object.entries(this.newsForm).forEach(([key, value]) => {
      if (
        value !== '' &&              // not empty string
        value !== null &&            // not null
        value !== undefined &&       // not undefined
        !(typeof value === 'number' && value === 0) // skip 0 for numbers
      ) {
        options[key] = value;
      }
    });
    this.getAllNews(options);
  }

  getActiveLabel(status: boolean): string {
    switch (status) {
      case true: return 'Active';
      default: return 'Inactive';
    }
  }
  
  getHeadline(headline: any) {
    return headline.en;
  }

  getFilter(filter: any) {
    return filter.en;
  }

  getTitle(title: any) {
    return title.en;
  }

  getDescription(description: any) {
    return description.en;
  }
}
