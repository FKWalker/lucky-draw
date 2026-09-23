import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
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
    console.log(options);
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

 joinDrawChannel(eventId: string, onReceive: (payload: any) => void) {
    const channelName = `room:lucky-draw-${eventId}`;

    const channel = this.supabase.channel(channelName, {
      config: {
        broadcast: { self: false },
      },
    });

    channel
      .on('broadcast', { event: 'draw-state-update' }, (event) => {
        // Automatically pass the inner data using bracket notation right here
        onReceive(event['payload']); 
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`Connected to broadcast channel: ${channelName}`);
        }
      });

    return channel;
  }

  async sendDrawBroadcast(channel: any, eventData: any) {
    if (!channel) return;
    
    await channel.send({
      type: 'broadcast',
      event: 'draw-state-update',
      payload: eventData,
    });
  }

  /**
   * Leave/close the broadcast channel when component destroys.
   */
  leaveChannel(channel: any) {
    if (channel) {
      this.supabase.removeChannel(channel);
    }
  }

}
