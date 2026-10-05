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

  get client(): SupabaseClient {
    return this.supabase;
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
