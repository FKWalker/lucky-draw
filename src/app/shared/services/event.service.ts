import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private supabase;

  constructor(
    private supabaseService: SupabaseService
  ) {
    this.supabase = this.supabaseService.client;
  }

  async addEvent(eventData: { event_name: string; event_code: string; password: string, file_name: string }, draws: any) {
    const { data, error } = await this.supabase
      .from('events')
      .insert([
        {
          event_name: eventData.event_name,
          event_code: eventData.event_code,
          password: eventData.password,
          draw_setup: draws,
          file_name: eventData.file_name
        }
      ]).select();

    if (error) {
      console.error('Error adding event with draws:', error);
      throw error;
    }
    return data;
  }

  async updateEvent(id: string | number, eventData: { event_name: string; event_code: string; password: string, file_name: string }, draws: any) {
    const { data, error } = await this.supabase
      .from('events')
      .update({
        event_name: eventData.event_name,
        event_code: eventData.event_code,
        password: eventData.password,
        draw_setup: draws,
        file_name: eventData.file_name
      })
      .eq('id', id); // 👈 Targets the exact row using its unique ID

    if (error) {
      console.error('Error updating event with draws:', error);
      throw error;
    }
    return data;
  }

  async getEventsFiltered(from: number, to: number, options: any) {
    let query = this.supabase
      .from('events')
      .select('*', { count: 'exact' })
      .range(from, to)
      .order('created_at', { ascending: false });

    // Apply filters if they exist in options
    if (options.event_name) {
      query = query.ilike('event_name', `%${options.event_name}%`);
    }
    if (options.event_code) {
      query = query.ilike('event_code', `%${options.event_code}%`);
    }
    if (options.search) {
      query = query.or(`event_name.ilike.%${options.search}%,event_code.ilike.%${options.search}%`);
    }

    return await query;
  }

  async getEventById(id: string | number) {
    const { data, error } = await this.supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single(); // .single() ensures it returns an object instead of an array

    if (error) {
      console.error('Error fetching event by id:', error);
      throw error;
    }
    
    return data;
  }

  async updateEventDrawSetupById(id: string | number, draws: any) {
    const { data, error } = await this.supabase
      .from('events')
      .update({
        draw_setup: draws,
      })
      .eq('id', id); // 👈 Targets the exact row using its unique ID

    if (error) {
      console.error('Error updating event with draws:', error);
      throw error;
    }
    return data;
  }

  async getEventByEventCode(eventCode: string | number) {
    const { data, error } = await this.supabase
      .from('events')
      .select('*')
      .eq('event_code', eventCode)
      .maybeSingle(); 

    if (error) {
      console.error('Error fetching event by event code:', error);
      throw error;
    }
    
    return data;
  }

  async setEventDrewById(id: string | number, drew: boolean) {
    const { data, error } = await this.supabase
      .from('events')
      .update({
        drew: drew,
      })
      .eq('id', id); // 👈 Targets the exact row using its unique ID

    if (error) {
      console.error('Error updating event with draws:', error);
      throw error;
    }
    return data;
  }
  
}
