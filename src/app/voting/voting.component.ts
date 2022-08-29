import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-voting',
  templateUrl: './voting.component.html',
  styleUrls: ['./voting.component.scss'],
})
export class VotingComponent implements OnInit {
  voting: any = null;
  options: any[] | null = [];
  id: string | null = null;
  constructor(
    private dataService: DataService,
    private route: ActivatedRoute
  ) {}

  async ngOnInit() {
   this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.voting = await (await this.dataService.getVotingDetails(+this.id)).data;
      this.options = await (await this.dataService.getVotingOptions(+this.id)).data;
      console.log('VOTINGS', this.voting);
      console.log('options', this.options);
    }
  }

  vote(option: any) {
    console.log('VOTING', option);
    
  }
}
