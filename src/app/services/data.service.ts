import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';

export const TABLE_VOTINGS = 'votings';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  startVoting() {
    return this.supabase.from(TABLE_VOTINGS).insert({
      voting_question: 'My question',
      description: 'My description',
    });
  }

  async getVotings() {
    const votings =  await this.supabase.from(TABLE_VOTINGS).select('*');
    return(votings.data || []);
  }

  async getVotingDetails(id: number) {
    return this.supabase.from(TABLE_VOTINGS).select('*').eq('id', id).single();
  }

  async updateVotingDetails(voting: any, id: number) {
    // console.log("Voting details", await this.getVotingDetails(id));
    console.log(await this.supabase.from(TABLE_VOTINGS).update(voting).match({ 'id': id }))
    console.log('Now returning')
    return this.supabase
      .from(TABLE_VOTINGS)
      .update(voting)
      // .eq('id', id)
      .match({'id': id})
      // .single()
  }

  async deleteVoting(id: number) {
    return this.supabase.from(TABLE_VOTINGS).delete().eq('id', id).single();
  }
}
