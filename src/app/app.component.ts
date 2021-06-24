import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/types/user';
import { APIService } from './API.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'huzzah';
  public createForm: FormGroup = {} as FormGroup;

  users: User[] = [];

  constructor(private api: APIService, private fb: FormBuilder) { }

  async ngOnInit() {
    this.createForm = this.fb.group({
      'name': ['', Validators.required],
      'avatar': [''],
    });

    this.api.ListUsers().then(event => {
      this.users = event.items as User[];
    })

    this.api.OnCreateUserListener.subscribe((event: any) => {
      const newUser = event.value.data.onCreateUser;
      this.users = [newUser, ...this.users];
    });
  }

  public onCreate(user: User) {
    this.api.CreateUser(user).then(event => {
      console.log('user created');
      this.createForm.reset();
    })
      .catch(e => {
        console.error('error creating user:', e);
      });
  }
}
