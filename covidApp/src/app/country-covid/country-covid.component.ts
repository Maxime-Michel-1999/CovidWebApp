import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CovidAppServices } from '../covid-app.service';
import { User } from '../user.model';
import { CountryData } from './countryData';

import { ChartType, ChartOptions, ChartDataSets } from 'chart.js';
import { SingleDataSet, Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip, Color } 
from 'ng2-charts';
import { countryDataHistorical } from './countryDataHistorical';
import { Receiver } from './receiver';


@Component({
  selector: 'app-country-covid',
  templateUrl: './country-covid.component.html',
  styleUrls: ['./country-covid.component.css']
})

export class CountryCovidComponent implements OnInit {
  

  user: User;
  http: HttpClient;

  receiver : Receiver;
  countryData: CountryData[];
  country: CountryData;
 
  weekData : countryDataHistorical;
  monthData : countryDataHistorical;
  
  oldcountry: CountryData;
  oldweekcovidData : countryDataHistorical;
  oldallcovidData : countryDataHistorical;

  News : any [];

  loadInfo : string;
  loadBar: string;
  loadGraph: string;


  Active: number;
  Recovery : number;
  Mortality : number;
  pieChartOptions : ChartOptions={
    responsive:true,
  }
  pieChartLabels: Label[] = ['Dead', 'Recovered', 'Active'];
  pieChartData: SingleDataSet = [100,100,100];
  pieChartType: ChartType = 'pie';
  pieChartLegend = true;
  pieChartPlugins: any = [];


  barChartOptions: ChartOptions = {
    responsive: true,
  };
  barChartLabels: Label[] = ["","","","","","",""];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins: any = [];
  barChartData: ChartDataSets[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: '' }];

  
  lineChartData: ChartDataSets[];
  lineChartLabels: Label[] = ['', '', '', '', '', '', ''];
  lineChartOptions: (ChartOptions) = {responsive: true,};
  lineChartColors: Color[] = [{borderColor: 'lightgreen'},];
  lineChartLegend = true;
  lineChartType : ChartType = 'line';
  lineChartPlugins: any = [];


  

  private _url : string="https://api.covid19api.com/summary";
  private _url2 : string="";
  

  constructor(public covidAppServices: CovidAppServices) {
    this.loadInfo = '';
    this.loadBar = '';
    this.loadGraph = '';
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
    
   }

  ngOnInit(): void {
    
    this.user = this.covidAppServices.getUser();

    this.http = this.covidAppServices.getHttp();
    this.getData()
       .subscribe(data => {
        this.countryData = data.Countries;
         this.makeList();
       });   

  }

  computingValues(){
    this.Active = Math.round(this.country.TotalConfirmed - this.country.TotalRecovered);
    this.Recovery = Math.round((this.country.TotalRecovered / this.country.TotalConfirmed )*100);
    this.Mortality = Math.round((this.country.TotalDeaths / this.country.TotalConfirmed )*100);
    this.pieChartData = [this.country.TotalDeaths,this.country.TotalRecovered,this.Active];
    
  }

  makeList(){
    var options = '';

    for (var i = 0; i < this.countryData.length; i++) {
      options += '<option value="' + this.countryData[i].Country + '" />';
    }
    
    document.querySelector('#Countries').innerHTML = options;

  }

  getData(): Observable<Receiver> {
    
    return this.http.get<Receiver>(this._url);
    
  }

  getDataWeek(): Observable<countryDataHistorical> {
    return this.http.get<countryDataHistorical>(this._url2);
    
  }






  gettingDate(){
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); 
    var yyyy = today.getFullYear();

    var date = yyyy + '-' + mm + '-' + dd;
    return date
  }

  

  gettingCloud(){

    let countryName = (<HTMLInputElement><unknown>document.getElementById('CountryName')).value;
    this.covidAppServices.getCountriesInfo(countryName).subscribe(data => {
      this.oldcountry = data;
      this.covidAppServices.getCountryHistoricalInfo(countryName,"week").subscribe(data => {this.oldweekcovidData = data; this.callingHistoryWeek(countryName)})
      this.covidAppServices.getCountryHistoricalInfo(countryName,"all").subscribe(data => {this.oldallcovidData = data;this.callingHistoryTotal(countryName)})
      this.updateCountriesInfo(countryName)})
      this.gettingNews(countryName);
    }



  updateCountriesInfo(countryName : string){
  
    if(this.oldcountry == undefined || this.gettingDate() > this.oldcountry.Date) {

      this.country = this.countryData.find(x => x.Country === countryName);
      this.country.Date = this.country.Date.substr(0,10);
      this.covidAppServices.updateCountriesInfo(this.country);   
      this.oldcountry = this.country; 
    }
    this.country=this.oldcountry;
    this.computingValues(); 
    this.loadInfo = "Ok";
}



    

  callingHistoryWeek(countryName: string){

    if(this.oldweekcovidData == undefined || this.gettingDate() > this.oldweekcovidData.date) {
      this._url2 = "https://disease.sh/v3/covid-19/historical/" + countryName +"?lastdays=7";
      this.getDataWeek().subscribe(data => {
          this.weekData = data;
          this.weekData.date = this.gettingDate();
          this.covidAppServices.setHistoricalInfo("week",countryName,this.weekData);
          this.makingWeekGraph();});
      return;
    }
    this.weekData = this.oldweekcovidData;
    this.makingWeekGraph();
    }


  makingWeekGraph(){
    //here we create the information list for the bar chart
    
    var cases = Object.values(this.weekData.timeline.cases);
    var deaths = Object.values(this.weekData.timeline.deaths);
    var recovery = Object.values(this.weekData.timeline.recovered);
    this.barChartData = [{ data: cases, label: 'Active' },
                        { data: deaths, label: 'Deaths' },
                        { data: recovery, label: 'Recovered' }]; 
    this.barChartLabels = Object.keys(this.weekData.timeline.cases);
    this.loadBar = "ok";

  }




  callingHistoryTotal(countryName: string){
    if(this.oldallcovidData == undefined || this.gettingDate() > this.oldallcovidData.date) {
      this._url2 = "https://disease.sh/v3/covid-19/historical/" + countryName +"?lastdays=all";
      this.getDataWeek().subscribe(data => {
          this.monthData = data;
          this.monthData.date = this.gettingDate();
          this.covidAppServices.setHistoricalInfo("all",countryName,this.monthData);
          this.makingMonthGraph();});
          return;
        }
    this.monthData = this.oldallcovidData;
    this.makingMonthGraph();
  }

  makingMonthGraph(){

    var cases = Object.values(this.monthData.timeline.cases);
    var deaths = Object.values(this.monthData.timeline.deaths);
    var recovery = Object.values(this.monthData.timeline.recovered);
    this.lineChartData = [{ data: cases, label: 'Active' },
                        { data: deaths, label: 'Deaths' },
                        { data: recovery, label: 'Recovered' }]; 
    this.lineChartLabels = Object.keys(this.monthData.timeline.cases);
    this.loadGraph = "ok";
  }


  gettingNews(country : string){


    this.covidAppServices.getNews(country).subscribe(data => {this.News = data; 
        this.showingNews()});
    }
  

  showingNews(){

    var news = ''
    if(this.News[0] == undefined ){
  
      news = '<div class="card">' +
        '<p class="card-text">' + 'No News For your Country ! Please Add some !' + '</p>'
    
        
    }
    else{for (var i = 0; i < this.News.length; i++) {
      news += '<div class="card">' +
      '<div class="card-body"> <h5 class="card-title"> News From : ' +  this.News[i].User.displayName + '</h5>' +
        '<p class="card-text">' + this.News[i].Description + '</p>'+
        '<p class="card-text"><small class="text-muted"> Made the ' + this.News[i].Date + '</small></p> </div> </div>'
    }}
    document.querySelector('#cards').innerHTML = news;
    
    
    
    
    

  

  }


}
