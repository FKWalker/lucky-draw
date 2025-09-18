import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import flatpickr from 'flatpickr';
import { LabelComponent } from '../label/label.component';
import "flatpickr/dist/flatpickr.css";

@Component({
  selector: 'app-date-picker',
  imports: [CommonModule,LabelComponent],
  templateUrl: './date-picker.component.html',
  styles: ``
})
export class DatePickerComponent {

  @Input() id!: string;
  @Input() mode: 'single' | 'multiple' | 'range' | 'time' = 'single';
  @Input() 
  set defaultDate(value: string | Date | string[] | Date[] | undefined) {
    this._defaultDate = value;

    // ✅ If flatpickr already initialized, update it
    if (this.flatpickrInstance && value) {
      this.flatpickrInstance.setDate(value);
    }
  }
  get defaultDate() {
    return this._defaultDate;
  }
  private _defaultDate?: string | Date | string[] | Date[];
  @Input() label?: string;
  @Input() placeholder?: string;
  @Input() enableTime: boolean = false;   
  @Input() time24hr: boolean = true;     
  @Input() enableSeconds: boolean = false;
  @Output() dateChange = new EventEmitter<any>();

  @ViewChild('dateInput', { static: false }) dateInput!: ElementRef<HTMLInputElement>;

  private flatpickrInstance: flatpickr.Instance | undefined;

  ngAfterViewInit() {
    this.flatpickrInstance = flatpickr(this.dateInput.nativeElement, {
      mode: this.mode,
      static: true,
      monthSelectorType: 'static',
      enableTime: this.enableTime,  // <-- ENABLE TIME
      enableSeconds: this.enableSeconds,
      time_24hr: this.time24hr,     // <-- 24-hour format
      dateFormat: this.enableTime
        ? this.enableSeconds
          ? 'Y-m-d H:i:S' // ⬅️ include seconds if enabled
          : 'Y-m-d H:i'
        : 'Y-m-d',
      defaultDate: this.defaultDate,
      onChange: (selectedDates, dateStr, instance) => {
        this.dateChange.emit({ selectedDates, dateStr, instance });
      }
    });
  }

  ngOnDestroy() {
    if (this.flatpickrInstance) {
      this.flatpickrInstance.destroy();
    }
  }
}
