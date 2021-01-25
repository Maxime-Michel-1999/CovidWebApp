import { Injectable, Query } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import  firebase from 'firebase/app';
import {AngularFireAuth} from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';


import { User } from './user.model';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { WorldData } from './world-covid/worldData';
import { CountryData } from './country-covid/countryData';
import { worldDataHistorical } from './world-covid/worldDataHistorical';
import { countryDataHistorical } from './country-covid/countryDataHistorical';


@Injectable({
  providedIn: 'root'
})
export class CovidAppServices {

  private News : {};
  private user: User;
  private country: CountryData;

  constructor(private afAuth : AngularFireAuth, 
    private router : Router,
    private firestore: AngularFirestore,
    private http: HttpClient) { }

  async signInWithGoogle(){
    const credientals = await this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
    
    this.user ={
      uid: credientals.user.uid,
      displayName: credientals.user.displayName,
      email: credientals.user.email

    };
    localStorage.setItem("user", JSON.stringify(this.user));
    this.updateUserData();
    this.router.navigate(["menu"]);

  }


  private updateUserData(){
    this.firestore.collection("users").doc(this.user.uid).set({
      uid: this.user.uid,
      displayName: this.user.displayName,
      email: this.user.email
    },{merge:true})

  }

  getUser(){
    
    if(this.user == null && this.userSignedIn()){
      this.user = JSON.parse(localStorage.getItem("user"));
    }
    return this.user;
  }

  getHttp(){
    return this.http;
  }

  userSignedIn(): boolean{
    return JSON.parse(localStorage.getItem("user")) != null;
  }

  signOut(){
    this.afAuth.signOut();
    localStorage.removeItem("user");
    this.user = null;
    this.router.navigate(["signin"]);
  }

  
// Updating the covid data on the firebaseµ
  getWorldInfo(){
    return this.firestore.collection("World").doc<WorldData>("x6DB2ApJ8wyOkVzKSKfZ").valueChanges();
}

  updateWorldInfo(covidData: WorldData){ 
    this.firestore.collection("world").doc("x6DB2ApJ8wyOkVzKSKfZ").set(covidData,{merge:true});
  }

  getCountriesInfo(name: string){
    return this.firestore.collection("Countries").doc<CountryData>(name).valueChanges();
  }

  updateCountriesInfo(covidData: CountryData){
      this.firestore.collection("Countries").doc(covidData.Country).set(covidData,{merge:true});
  }

  getWorldHistoricalInfo(time : string){
    return this.firestore.collection("Historical").doc("world").collection("scale").doc<worldDataHistorical>(time).valueChanges();
  }

  getCountryHistoricalInfo(time : string, country : string){
    return this.firestore.collection("Historical").doc(country).collection("scale").doc<countryDataHistorical>(time).valueChanges();
  }

  setHistoricalInfo(time : string, country : string, covidData : any){
    this.firestore.collection("Historical").doc(country).collection("scale").doc(time).set(covidData,{merge:true});
  }

  
    
    





  getCountriesNames(){
    
  }

  gettingDate(){
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); 
    var yyyy = today.getFullYear();

    var date = yyyy + '-' + mm + '-' + dd;
    return date
  }

  addNews(description : string, country: string){
    //Create the news object
    var News = {
      User : this.user,
      Date : this.gettingDate(),
      Description : description,
      Country : country

    }
    
    this.firestore.collection("News").add(News);
  }

  getNews(country : string){

    return  this.firestore.collection('News', ref => ref.where('Country', '==', country)).valueChanges();

  }


}
