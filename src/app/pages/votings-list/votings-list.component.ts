import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-votings-list',
  templateUrl: './votings-list.component.html',
  styleUrls: ['./votings-list.component.scss']
})
export class VotingsListComponent implements OnInit {

  votings: any[] = [];

  constructor(private dataService: DataService, private router: Router) { }

  ngOnInit(): void {
    this.loadVotings(); 
  }

  async loadVotings() {
    this.votings = await this.dataService.getVotings();
  }

  async startVoting() {
    const result = await this.dataService.startVoting();
    console.log(result);

    if (!result.error && result.data.length) {
      this.router.navigate([`/app/${result.data[0].id}`])
    }
  }

}
