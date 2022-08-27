import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-votings-details',
  templateUrl: './votings-details.component.html',
  styleUrls: ['./votings-details.component.scss'],
})
export class VotingsDetailsComponent implements OnInit {
  voting: any = null;
  form: FormGroup;
  formOptions: FormGroup;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private dataService: DataService,
    private router: Router
  ) {
    this.form = this.fb.group({
      voting_question: ['', Validators.required],
      title: ['', Validators.required],
      description: [''],
      public: [false],
    });

    this.formOptions = this.fb.group({
      options: this.fb.array([]),
    });
  }

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.voting = await (await this.dataService.getVotingDetails(+id)).data;
      console.log(this.voting);

      this.form.patchValue(this.voting);
    }
    // console.log("Form option", this.formOptions);
  }

  async updateVoting() {
    console.log(this.form.value, this.voting.id);

    const res = await this.dataService.updateVotingDetails(
      this.form.value,
      this.voting.id
    );
    console.log(res);

    if (res.data) {
      alert('Voting updated!');
    }
  }

  async deleteVoting() {
    await this.dataService.deleteVoting(this.voting.id);
    alert('Voting deleted!');
    this.router.navigate(['/app']);
  }

  get options(): FormArray {
    // console.log(this.formOptions.controls['options'] as FormArray);

    return this.formOptions.controls['options'] as FormArray;
  }

  addOption() {
    const option = this.fb.group({
      title: ['', Validators.required],
      id: null,
    });
    this.options.push(option);
  }

  deleteOption(index: number) {
    this.options.removeAt(index);
  }

  saveOptions() {
    console.log('SAVE', this.formOptions.value);
  }
}
