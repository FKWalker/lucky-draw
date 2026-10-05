import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private supabase;

  constructor(
    private supabaseService: SupabaseService
  ) {
    this.supabase = this.supabaseService.client;
  }

  async signUp(email: string, password: string) {

    const { data, error } = await this.supabase.auth.signUp({
      email,
      password
    });

    if (error) {
      throw error;
    }

    return data;
  }

  async signIn(email: string, password: string) {

    const { data, error } =
      await this.supabase.auth.signInWithPassword({
        email,
        password
      });

    if (error) {
      throw error;
    }

    return data;
  }

  async signOut() {

    const { error } =
      await this.supabase.auth.signOut();

    if (error) {
      throw error;
    }
  }

  async getCurrentUser() {

    const { data, error } =
      await this.supabase.auth.getUser();

    if (error) {
      return null;
    }

    return data.user;
  }

  async getSession() {

    const { data, error } =
      await this.supabase.auth.getSession();

    if (error) {
      return null;
    }

    return data.session;
  }

  onAuthStateChange(callback: (event: string, session: any) => void) {

    return this.supabase.auth.onAuthStateChange(
      (event, session) => {
        callback(event, session);
      }
    );
  }
}
