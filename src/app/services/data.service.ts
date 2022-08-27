import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';

export const TABLE_VOTINGS = 'votings';
export const TABLE_VOTING_OPTIONS = 'voting_options';

export interface VotingOption {
  id?: number;
  voting_id: number;
  title: string;
  creator_id?: string;
  votes: number;
}

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
    const votings = await this.supabase.from(TABLE_VOTINGS).select('*');
    return votings.data || [];
  }

  async getVotingDetails(id: number) {
    return this.supabase.from(TABLE_VOTINGS).select('*').eq('id', id).single();
  }

  async updateVotingDetails(voting: any, id: number) {
    // console.log("Voting details", await this.getVotingDetails(id));
    console.log(
      await this.supabase.from(TABLE_VOTINGS).update(voting).match({ id: id })
    );
    console.log('Now returning');
    return (
      this.supabase
        .from(TABLE_VOTINGS)
        .update(voting)
        // .eq('id', id)
        .match({ id: id })
    );
    // .single()
  }

  async deleteVoting(id: number) {
    return this.supabase.from(TABLE_VOTINGS).delete().eq('id', id).single();
  }

  async getVotingOptions(votingId: number) {
    return this.supabase
      .from(TABLE_VOTING_OPTIONS)
      .select('*')
      .eq('voting_id', votingId);
  }

  async addVotingOption(option: VotingOption) {
    // setting the creator_id to current user_id
    option.creator_id = this.supabase.auth.user()?.id;
    option.votes = 0;

    delete option.id;
    return this.supabase.from(TABLE_VOTING_OPTIONS).insert(option);
  }

  async updateVotingOption(option: VotingOption) {
    return this.supabase
      .from(TABLE_VOTING_OPTIONS)
      .update({ title: option.title })
      .eq('id', option.id);
  }

  async deleteVotingOption(id: number) {
    return this.supabase.from(TABLE_VOTING_OPTIONS).delete().eq('id', id).single();
  }

}
