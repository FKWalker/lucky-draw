import { Component, Inject, PLATFORM_ID, ViewChild } from '@angular/core';
import { ComponentCardComponent } from 'app/shared/components/common/component-card/component-card.component';
import { AlertComponent } from 'app/shared/components/ui/alert/alert.component';
import { LabelComponent } from 'app/shared/components/form/label/label.component';
import { InputFieldComponent } from 'app/shared/components/form/input/input-field.component';
import { ButtonComponent } from 'app/shared/components/ui/button/button.component';
import { FileInputComponent } from 'app/shared/components/form/input/file-input.component';
import * as XLSX from 'xlsx';
import { SupabaseService } from 'app/shared/services/supabase.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-create-event',
  imports: [ComponentCardComponent, AlertComponent, LabelComponent, InputFieldComponent, ButtonComponent, FileInputComponent],
  templateUrl: './create-event.component.html',
  styleUrl: './create-event.component.css'
})
export class CreateEventComponent {

  disabled: boolean = false;

  draws: { drawName: string | number; number: string | number; drew: boolean}[] = [];
  drawsErrors: { drawName?: string; number?: string }[] = [];

  @ViewChild('fileUpload') fileUpload!: FileInputComponent;

  eventForm: {
    event_name: any;
    event_code: any;
    password: any;
    file_name: any;
  } = {
    event_name: '',
    event_code: '',
    password: '',
    file_name: ''
  }

  participantsToInsert: any;

  errors = {
    event_name: false,
    event_code: false,
    password: false,
    file: false
  }

  success: any;
  error: any;

  constructor(private supabaseService: SupabaseService) {
  }

  addDraw() {
    this.draws.push({ drawName: '', number: '1', drew: false });
    this.drawsErrors.push({});
  }

  removeDraw(index: number) {
    this.draws.splice(index, 1);
    this.drawsErrors.splice(index, 1);
  }

  // Change parameter type from 'File' to 'any'
  async handleFileChange(event: any) {
    // Safely extract the file whether it comes from a native event target or direct emission
    const file: File = event?.target?.files?.[0] || event;
    
    if (!file || !(file instanceof File)) return;

    const reader: FileReader = new FileReader();
    
    reader.onload = async (e: any) => {
      const bstr: string = e.target.result;
      const workbook: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      const sheetName: string = workbook.SheetNames[0];
      const worksheet: XLSX.WorkSheet = workbook.Sheets[sheetName];
      const rawData: any[] = XLSX.utils.sheet_to_json(worksheet);

      this.participantsToInsert = rawData.map(row => ({
        // Look for name variations
        name: row['name'] || row['Name'] || row['Participant Name'] || Object.values(row)[0],
        
        // Look for member code variations (adjust keys to match your exact Excel column headers)
        member_code: row['memberCode'] || row['Member Code'] || row['code'] || row['Code'] || Object.values(row)[1]
      })).filter(p => p.name); // Keeps rows that have at least a name
    };
    this.eventForm.file_name = file.name;
    reader.readAsBinaryString(file);
  }

  async onSubmit() {
    this.disabled = true;
    if(this.validation()){
      console.log(this.eventForm);
      console.log(this.draws);
      try{
        const data : any = await this.supabaseService.addEvent(this.eventForm, this.draws);
        const newEventId = data[0]?.id;
        const participantsWithEvent = this.participantsToInsert.map((participant:any) => ({
          ...participant,
          event_id: newEventId
        }));
        console.log(participantsWithEvent);
        await this.supabaseService.addBatchParticipants(participantsWithEvent);
        this.eventForm = {
          event_name: '',
          event_code: '',
          password: '',
          file_name: ''
        }
        this.draws = [];
        this.participantsToInsert = [];
        this.fileUpload.reset();
        this.success = true;
        this.error = null;
        this.disabled = false;
        window.scrollTo({ top: 0, behavior: 'smooth' });

      }catch (error) {
        this.error = true;
        this.success = null;
        this.disabled = false;
        console.error('Failed to save to Supabase:', error);
      }
      
    }else{
      this.disabled = false;
    }
  }

  validation(){
    // reset errors
    this.errors = {
      event_name: false,
      event_code: false,
      password: false,
      file: false
    }

    let valid = true

    if (!String(this.eventForm.event_name).trim()) {
      this.errors.event_name = true;
      valid = false;
    }

    if (!String(this.eventForm.event_code).trim()) {
      this.errors.event_code = true;
      valid = false;
    }

    if (!String(this.eventForm.password).trim()) {
      this.errors.password = true;
      valid = false;
    }

    if(!this.validateDrawSetup()){
      valid = false;
    }

    if (!valid) {
      console.warn('Form invalid:', this.errors);
    }

    if (!this.participantsToInsert || this.participantsToInsert.length === 0) {
      this.errors.file = true;
      valid = false;
    }

    return valid;
  }

  validateDrawSetup(): boolean {
    let isValid = true;
    this.drawsErrors = this.draws.map((d) => {
      const error: { drawName?: string; number?: string } = {};
      if (!d.drawName.toString().trim()) {
        error.drawName = 'Draw name is required';
        isValid = false;
      }
      if (!d.number.toString().trim()) {
        error.number = 'Number of winner is required';
        isValid = false;
      }
      if (d.number.toString().trim().startsWith('0') || d.number.toString().trim().startsWith('-')) {
        error.number = 'Number of winner invalid';
        isValid = false;
      }
      return error;
    });
    return isValid;
  }

}
