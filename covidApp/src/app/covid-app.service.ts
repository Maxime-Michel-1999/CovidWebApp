import { Injectable } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import  firebase from 'firebase/app';
import {AngularFireAuth} from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';


import { User } from './user.model';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class CovidAppServices {

  private user: User;

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
    this.router.navigate(["worldcovid"]);

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

  goCountry(){
    this.router.navigate(["countrycovid"]);
  }

  goWorld(){
    this.router.navigate(["worldcovid"]);
  }
  
}
