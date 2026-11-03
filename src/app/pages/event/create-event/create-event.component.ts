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
import { ParticipantService } from 'app/shared/services/participant.service';
import { EventService } from 'app/shared/services/event.service';
import { RadioButtonsComponent } from 'app/shared/components/form/form-elements/radio-buttons/radio-buttons.component';
import { RadioComponent } from 'app/shared/components/form/input/radio.component';
import { SelectComponent } from 'app/shared/components/form/select/select.component';

@Component({
  selector: 'app-create-event',
  imports: [ComponentCardComponent, AlertComponent, LabelComponent, InputFieldComponent, ButtonComponent, FileInputComponent, RadioComponent, SelectComponent],
  templateUrl: './create-event.component.html',
  styleUrl: './create-event.component.css'
})
export class CreateEventComponent {

  disabled: boolean = false;

  draws: { drawName: string | number; number: string | number; drew: boolean, disabled: boolean, winner: string | number}[] = [];
  drawsErrors: { drawName?: string; number?: string }[] = [];

  @ViewChild('fileUpload') fileUpload!: FileInputComponent;

  eventForm: {
    event_name: any;
    event_code: any;
    password: any;
    file_name: any;
    draw_type: any;
    link_event: any;
  } = {
    event_name: '',
    event_code: '',
    password: '',
    file_name: '',
    draw_type: 'S',
    link_event: ''
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

  eventCodeHint = 'This is an invalid event code.';

  eventOptions: any[] = [];

  constructor(private supabaseService: SupabaseService,
    private eventService: EventService,
    private participantService: ParticipantService,
  ) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  async loadEvents(): Promise<void> {
    const events = await this.eventService.getEvents();
    this.eventOptions = [];
    this.eventOptions.push({ value : '', label: ''})
    for (const event of events) {
      this.eventOptions.push({
        value: event.id,
        label: `${event.event_name} - ${event.event_code}`
      });
    }
  }

  addDraw() {
    if (this.eventForm.draw_type === 'S'){
      this.draws.push({ drawName: '', number: '1', drew: false, disabled: true, winner: '' });
    }else{
      this.draws.push({ drawName: '', number: '1', drew: false, disabled: false, winner: '' });
    }
    this.drawsErrors.push({});
  }

  removeDraw(index: number) {
    this.draws.splice(index, 1);
    this.drawsErrors.splice(index, 1);
  }

  handleDrawTypeChange(event: any){
    this.eventForm.draw_type = event;
    if (this.eventForm.draw_type === 'S') {
      for(let draw of this.draws){
        draw.number = 1;
        draw.disabled = true;
      }
    }else{
      for (let draw of this.draws) {
        draw.disabled = false;
      }
    }
  }

  handleLinkEventChange(value: string) {
    this.eventForm.link_event = value;
    console.log('Selected value:', value);
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
    if(await this.validation()){
      try{
        if (this.eventForm.link_event === ''){
          this.eventForm.link_event = 0;
        }
        const data : any = await this.eventService.addEvent(this.eventForm, this.draws);
        const newEventId = data[0]?.id;
        const participantsWithEvent = this.participantsToInsert.map((participant:any) => ({
          ...participant,
          event_id: newEventId
        }));
        await this.participantService.addBatchParticipants(participantsWithEvent);

        for (let [index, draw] of this.draws.entries()){
          if (!draw.winner || draw.winner === '') {
            continue;
          }

          const participant =
            await this.participantService.getParticipantByNameAndEventId(
              draw.winner,
              newEventId
            );

          if (participant === null) {
            // Participant not found, insert new participant
            const data : any = await this.participantService.addParticipant({
              name: draw.winner.toString(),
              member_code: 'dedicated',
              event_id: newEventId
            });
            const newParticipantId = data[0]?.id;
            await this.participantService.updateParticipantWon(newParticipantId, index + 1);
          }else{
            await this.participantService.updateParticipantWon(participant.id, index + 1);
          }

          await this.participantService.updateParticipantEligibleByName(draw.winner.toString());
        }

        this.loadEvents();
        this.eventForm = {
          event_name: '',
          event_code: '',
          password: '',
          file_name: '',
          draw_type: 'S',
          link_event: ''
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

  async validation(){
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
      this.eventCodeHint = 'This is an invalid event code.';
      this.errors.event_code = true;
      valid = false;
    }else{
      const event = await this.eventService.getEventByEventCode(this.eventForm.event_code);
      if (event) {
        // Event code already exists
        this.eventCodeHint = 'Event code is already in use.';
        this.errors.event_code = true;
        valid = false;
      }
    }

    // if (!String(this.eventForm.password).trim()) {
    //   this.errors.password = true;
    //   valid = false;
    // }

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
