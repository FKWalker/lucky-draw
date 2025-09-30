import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center justify-center" [ngClass]="containerClass">
      <div class="animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" 
           [ngClass]="spinnerClass"></div>
      <span *ngIf="showText" class="ml-2 text-gray-600 dark:text-gray-400" [ngClass]="textClass">
        {{ text }}
      </span>
    </div>
  `,
  styles: []
})
export class LoadingSpinnerComponent {
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() showText: boolean = false;
  @Input() text: string = 'Loading...';
  @Input() containerClass: string = '';
  @Input() textClass: string = '';

  get spinnerClass(): string {
    const sizeClasses = {
      sm: 'h-4 w-4',
      md: 'h-8 w-8',
      lg: 'h-12 w-12'
    };
    return sizeClasses[this.size];
  }
}
