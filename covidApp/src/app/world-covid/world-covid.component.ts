import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CovidAppServices } from '../covid-app.service';
import { Observable } from 'rxjs';
import { User } from '../user.model';
import {WorldData} from "./worldData";



@Component({
  selector: 'app-world-covid',
  templateUrl: './world-covid.component.html',
  styleUrls: ['./world-covid.component.css']
})
export class WorldCovidComponent implements OnInit {

  user: User;
  http: HttpClient;
  covidData: WorldData;

  private _url : string="https://api.covid19api.com/summary";

  constructor(public covidAppServices : CovidAppServices) { }
  ngOnInit(): void {
      this.user = this.covidAppServices.getUser();
      this.http = this.covidAppServices.getHttp();
      this.getData()
      .subscribe(data => this.covidData = data.Global)
      
}
  

  getData(): Observable<WorldData> {
    return this.http.get<WorldData>(this._url);
    
  }

}
