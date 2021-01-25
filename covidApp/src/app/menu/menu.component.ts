import { Component, OnInit } from '@angular/core';
import { CountryCovidComponent } from '../country-covid/country-covid.component';
import { WorldCovidComponent } from '../world-covid/world-covid.component';
import { CovidAppServices } from '../covid-app.service';
import { User } from '../user.model';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  user: User;
  loadComponentWorld: string;
  loadComponentCountry : string;


  constructor(public covidAppServices : CovidAppServices) {
    this.loadComponentWorld = "";
    this.loadComponentCountry = "";

    
   }

  ngOnInit(): void {
    this.user = this.covidAppServices.getUser();
    //this.makeList();
  }

  makeList(){
    var options = '';
    var countryNames: string | any[] = [];

    for (var i = 0; i < countryNames.length; i++) {
      options += '<option value="' + countryNames[i].Country + '" />';
    }
    
    //document.querySelector('#countries').innerHTML = options;

  }

  loadWorld() {
    this.loadComponentCountry = "";
    this.loadComponentWorld = "ok";
  }

  loadCountry() {
    this.loadComponentWorld = "";
    this.loadComponentCountry = "ok";
  }

  addNews(){
    let description = (<HTMLInputElement><unknown>document.getElementById('description')).value;
    let country = (<HTMLInputElement><unknown>document.getElementById('Country')).value;
    this.covidAppServices.addNews(description,country);
    (<HTMLInputElement><unknown>document.getElementById('description')).value = "";
    (<HTMLInputElement><unknown>document.getElementById('Country')).value = "";
  }

}
