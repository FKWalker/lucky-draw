import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-image-upload',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- hidden file input -->
    <input
      #fileInput
      type="file"
      accept="image/*"
      class="hidden"
      (change)="onFileSelected($event)"
    />

    <!-- clickable image container -->
    <div
      class="w-32 h-32 border border-gray-300 rounded-lg overflow-hidden cursor-pointer flex items-center justify-center bg-gray-50 hover:border-blue-400 transition"
      (click)="fileInput.click()"
    >
      <img
        *ngIf="previewUrl || imageUrl; else placeholder"
        [src]="previewUrl || imageUrl"
        alt="Profile Image"
        class="w-full h-full object-cover"
      />
      <ng-template #placeholder>
        <span class="text-gray-400 text-sm">Click to upload</span>
      </ng-template>
    </div>

    <!-- error/success hint -->
    @if (hint) {
      <p class="mt-1.5 text-xs"
        [ngClass]="{
          'text-error-500': error,
          'text-success-500': success,
          'text-gray-500': !error && !success
        }">
        {{ hint }}
      </p>
    }
  `
})
export class ImageUploadComponent {
  @Input() imageUrl: string | number = ''; // existing profile image
  @Input() success: boolean = false;
  @Input() error: boolean = false;
  @Input() hint?: string;
  @Output() change = new EventEmitter<Event>();

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  previewUrl: string | null = null;

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.change.emit(event);

      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  reset() {
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
    this.previewUrl = null;
  }
}
