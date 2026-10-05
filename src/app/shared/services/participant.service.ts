import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class ParticipantService {

  private supabase;

  constructor(
    private supabaseService: SupabaseService
  ) {
    this.supabase = this.supabaseService.client;
  }

    // Fetch all participants
  async getParticipants() {
    const { data, error } = await this.supabase
      .from('participants') // Replace with your actual Supabase table name
      .select('*');

    console.log(data);
    
    if (error) {
      console.error('Error fetching participants:', error);
      return [];
    }
    return data;
  }

  // Upload/Add a new participant name
  async addParticipant(name: string) {
    const { data, error } = await this.supabase
      .from('participants')
      .insert([{ name }]);

    if (error) {
      console.error('Error adding participant:', error);
      throw error;
    }
    return data;
  }

  // Add this inside your SupabaseService class
  async addBatchParticipants(participants: { name: string; member_code: string }[]) {
    const { data, error } = await this.supabase
      .from('participants')
      .insert(participants); // Supabase accepts an array of objects for bulk insert

    if (error) {
      console.error('Error batch inserting participants:', error);
      throw error;
    }
    
    return data;
  }

  async deleteParticipantsByEvent(eventId: string | number) {
    const { data, error } = await this.supabase
      .from('participants')
      .delete()
      .eq('event_id', eventId);

    if (error) {
      console.error('Error deleting participants for event:', error);
      throw error;
    }
    
    return data;
  }

  async getParticipantsFiltered(from: number, to: number, options: any, eventId: any) {
    let query = this.supabase
      .from('participants')
      .select('*', { count: 'exact' })
      .eq('event_id', eventId)
      .range(from, to)
      .order('created_at', { ascending: false });

    // Apply filters if they exist in options
    if (options.name) {
      query = query.ilike('name', `%${options.name}%`);
    }
    if (options.member_code) {
      query = query.ilike('member_code', `%${options.member_code}%`);
    }
    if (options.search) {
      query = query.or(`name.ilike.%${options.search}%,member_code.ilike.%${options.search}%`);
    }

    return await query;
  }

  async getParticipantByEventIdAndWon(eventId: string | number, won: string | number) {
    const { data, error } = await this.supabase
      .from('participants') // Replace with your actual Supabase table name
      .select('*')
      .eq('event_id', eventId)
      .eq('won', won);
    
    if (error) {
      console.error('Error fetching participants:', error);
      return [];
    }
    return data;
  }

  async getEligibleParticipants(eventId: string | number) {
    const { data, error } = await this.supabase
      .from('participants') // Replace with your actual Supabase table name
      .select('*')
      .eq('event_id', eventId)
      .eq('eligible', true);
    
    if (error) {
      console.error('Error fetching participants:', error);
      return [];
    }
    return data;
  }

  async updateParticipantWon(id: number, won: number) {
    const { data, error } = await this.supabase
      .from('participants') // Replace with your actual Supabase table name
      .update({
        won: won
      })
      .eq('id', id);
    
    if (error) {
      console.error('Error fetching participants:', error);
      return [];
    }
    return data;
  }

  async updateParticipantEligible(memberCode: string) {
    const { data, error } = await this.supabase
      .from('participants') // Replace with your actual Supabase table name
      .update({
        eligible: false
      })
      .eq('member_code', memberCode)
    
    if (error) {
      console.error('Error fetching participants:', error);
      return [];
    }
    return data;
  }

  async getParticipantByMemberCodeAndEventIdAndEligible(memberCode: string | number, eventId: string | number) {
    const { data, error } = await this.supabase
      .from('participants')
      .select('*')
      .eq('member_code', memberCode)
      .eq('event_id', eventId)
      .eq('eligible', true);

    if (error) {
      console.error('Error fetching event by id:', error);
      throw error;
    }
    
    return data;
  }

}