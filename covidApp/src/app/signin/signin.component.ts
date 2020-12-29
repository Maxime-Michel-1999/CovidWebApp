import { Component, OnInit } from '@angular/core';
import { CovidAppServices } from '../covid-app.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  constructor(public covidAppService : CovidAppServices) { }

  ngOnInit(): void {
  }

}
