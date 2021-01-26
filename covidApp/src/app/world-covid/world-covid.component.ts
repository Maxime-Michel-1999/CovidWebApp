import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CovidAppServices } from '../covid-app.service';
import { Observable } from 'rxjs';
import { User } from '../user.model';
import {WorldData} from "./worldData";
import { ChartType, ChartOptions, ChartDataSets } from 'chart.js';
import { SingleDataSet, Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip, Color } 
from 'ng2-charts';
import { worldDataHistorical } from './worldDataHistorical';





@Component({
  selector: 'app-world-covid',
  templateUrl: './world-covid.component.html',
  styleUrls: ['./world-covid.component.css']
})
export class WorldCovidComponent implements OnInit {

  user: User;
  http: HttpClient;
  covidData: WorldData;

  oldcovidData : WorldData;
  oldweekcovidData : worldDataHistorical;
  oldallcovidData : worldDataHistorical;

  News : any [];
  

  weekData: worldDataHistorical;
  monthData: worldDataHistorical;

  loadComponent: string;
  loadInfo: string;
  loadBar: string;
  loadChart: string;


  Active: number;
  Recovery : number;
  Mortality : number;

  weekFigures : [];

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
  private _url2 : string="https://disease.sh/v3/covid-19/historical/all?lastdays=7";
  private _url3 : string="https://disease.sh/v3/covid-19/historical/all?lastdays=all";

  constructor(public covidAppServices : CovidAppServices) { 
    this.loadComponent = "";
    this.loadInfo ="";
    this.loadBar ="";
    this.loadChart ="";
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
    
  }
  
  
  ngOnInit(): void {
      
      this.user = this.covidAppServices.getUser();
      this.http = this.covidAppServices.getHttp();
      this.getData().subscribe(data => {
        this.covidData = data.Global;
        this.updateWorldInfo();
      });

      this.getDataWeek().subscribe(data => {
        this.weekData = data;
        
      });

      this.getDataMonth().subscribe(data => {
        this.monthData = data;
        
      });

      
  
      
}
  
  computingValues(){
    this.Active = Math.round(this.covidData.TotalConfirmed - this.covidData.TotalRecovered);
    this.Recovery = Math.round((this.covidData.TotalRecovered / this.covidData.TotalConfirmed )*100);
    this.Mortality = Math.round((this.covidData.TotalDeaths / this.covidData.TotalConfirmed )*100);
    this.pieChartData = [this.covidData.TotalDeaths,this.covidData.TotalRecovered,this.Active];
    
  }


  getData(): Observable<WorldData> {
    return this.http.get<WorldData>(this._url);
    
  }

  getDataWeek(): Observable<worldDataHistorical> {
    return this.http.get<worldDataHistorical>(this._url2);
    
  }

  getDataMonth(): Observable<worldDataHistorical> {
    return this.http.get<worldDataHistorical>(this._url3);
    
  }



  updateWorldInfo(){
    this.covidAppServices.getWorldInfo().subscribe(data => {this.oldcovidData = data;
    this.covidAppServices.getWorldHistoricalInfo("week").subscribe(data => {this.oldweekcovidData = data;})
    this.covidAppServices.getWorldHistoricalInfo("all").subscribe(data => {this.oldallcovidData = data;})

    if(this.oldcovidData == undefined || this.gettingDate() > this.oldcovidData.Date) {
      
      this.covidData.Date = this.gettingDate();
      this.oldcovidData = this.covidData; 
      this.covidAppServices.updateWorldInfo(this.oldcovidData);

      this.oldweekcovidData = this.weekData; 
      this.covidAppServices.setHistoricalInfo("week","world",this.oldweekcovidData)

      this.oldallcovidData = this.monthData; 
      this.covidAppServices.setHistoricalInfo("all","world",this.oldallcovidData)
    }
    this.covidData=this.oldcovidData;
    this.weekData = this.oldweekcovidData;
    this.monthData = this.oldallcovidData; 

    this.computingValues(); 
    this.gettingNews();
    this.makingWeekGraph();
    this.makingMonthGraph();
    
    this.loadInfo = "Ok";
  });
  }

  makingWeekGraph(){
      //here we create the information list for the bar chart

      var cases = Object.values(this.weekData.cases);
      var deaths = Object.values(this.weekData.deaths);
      var recovery = Object.values(this.weekData.recovered);
      this.barChartData = [{ data: cases, label: 'Active' },
                          { data: deaths, label: 'Deaths' },
                          { data: recovery, label: 'Recovered' }]; 
      this.barChartLabels = Object.keys(this.weekData.cases);
      this.loadBar ="ok";
  }

  makingMonthGraph(){
    //here we create the information list for the bar chart

    var cases = Object.values(this.monthData.cases);
    var deaths = Object.values(this.monthData.deaths);
    var recovery = Object.values(this.monthData.recovered);
    this.lineChartData = [{ data: cases, label: 'Active' },
                        { data: deaths, label: 'Deaths' },
                        { data: recovery, label: 'Recovered' }]; 
    this.lineChartLabels = Object.keys(this.monthData.cases);
    this.loadChart ="ok";
}

  gettingDate(){
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); 
    var yyyy = today.getFullYear();

    var date = yyyy + '-' + mm + '-' + dd;
    return date
  }

  gettingNews(){


    this.covidAppServices.getNews('World').subscribe(data => {this.News = data; 
        this.showingNews()});
    }
  

  showingNews(){

    var news = ''
    
    for (var i = 0; i < this.News.length; i++) {
      news += '<div class="card">' +
      '<div class="card-body"> <h5 class="card-title"> News From : ' +  this.News[i].User.displayName + '</h5>' +
        '<p class="card-text">' + this.News[i].Description + '</p>'+
        '<p class="card-text"><small class="text-muted"> Made the ' + this.News[i].Date + '</small></p> </div> </div>'
    }
    try{document.querySelector('#cards').innerHTML = news;}
    catch(e){}

    

  }


}
