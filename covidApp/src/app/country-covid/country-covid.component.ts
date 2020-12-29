import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CovidAppServices } from '../covid-app.service';
import { User } from '../user.model';
import { CountryData } from './countryData';

@Component({
  selector: 'app-country-covid',
  templateUrl: './country-covid.component.html',
  styleUrls: ['./country-covid.component.css']
})
export class CountryCovidComponent implements OnInit {

  user: User;
  http: HttpClient;
  countryData: CountryData[];

  private _url : string="https://api.covid19api.com/summary";

  constructor(public covidAppServices: CovidAppServices) {
   }

  ngOnInit(): void {
    this.http = this.covidAppServices.getHttp();
    this.user = this.covidAppServices.getUser();
    this.getData()
        .subscribe(data => this.countryData = data.Countries)
        
  }

  getData(): Observable<CountryData[]> {
    return this.http.get<CountryData[]>(this._url);
    
  }

}
