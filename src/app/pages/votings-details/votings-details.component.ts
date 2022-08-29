import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { zip } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { ToastrService } from 'ngx-toastr';

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
    private router: Router,
    private toastr: ToastrService
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

      const options = await (await this.dataService.getVotingOptions(+id)).data;
      console.log("options", options);
      
      options?.map((item) => {
        const option = this.fb.group({
          title: [item.title, Validators.required],
          id: item.id,
        });
        this.options.push(option);
        console.log("options new", options);
        
      });

      this.form.patchValue(this.voting);
    }
  }

  async updateVoting() {
    console.log(this.form.value, this.voting.id);

    const res = await this.dataService.updateVotingDetails(
      this.form.value,
      this.voting.id
    );
    console.log(res);

    if (res.data) {
      this.toastr.success('Voting updated!');
      // alert('Voting updated!');
    }
  }

  async deleteVoting() {
    await this.dataService.deleteVoting(this.voting.id);
    this.toastr.success('Voting deleted!');
    // alert('Voting deleted!');
    this.router.navigate(['/app']);
  }

  // Voting options
  get options(): FormArray {
    // console.log(this.formOptions.controls['options'] as FormArray);

    return this.formOptions.controls['options'] as FormArray;
  }

  addOption() {
    const option = this.fb.group({
      title: ['', Validators.required],
      id: null,
      voting_id: this.voting.id
    });
    this.options.push(option);
  }

  async deleteOption(index: number) {
    const control = this.options.at(index);
    const id = control.value.id;
    const res = await this.dataService.deleteVotingOption(id);
    console.log(res);
    if (res) {
      this.options.removeAt(index);
    }
  }

  saveOptions() {
    console.log('SAVE', this.formOptions.value);
    const obs = [];
    for (let entry of this.formOptions.value.options) {
      if (!entry.id) {
        console.log('ADD THIS', entry);
        const newObs = this.dataService.addVotingOption(entry);
        obs.push(newObs);
      } else {
        // To update the answer
        const newObs = this.dataService.updateVotingOption(entry);
        obs.push(newObs);
      }
    }
    zip(obs).subscribe((res) => {
      console.log('AFTER ADD: ', res);
      this.toastr.success('Voting updated!');
      // alert('Success!');
    })
  }
}
