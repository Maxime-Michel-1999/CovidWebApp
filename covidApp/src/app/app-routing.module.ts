import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { CountryCovidComponent } from './country-covid/country-covid.component';
import { SecurePagesGuard } from './secure-pages.guard';
import { SigninComponent } from './signin/signin.component';
import { WorldCovidComponent } from './world-covid/world-covid.component';

const routes: Routes = [
  { path: "signin", component: SigninComponent,
canActivate:[SecurePagesGuard]},
  { path: "worldcovid", component: WorldCovidComponent,
canActivate: [AuthGuard]},
  { path: "countrycovid", component: CountryCovidComponent,
canActivate: [AuthGuard]},
  { path:"", pathMatch: "full", redirectTo: "signin"},
  { path: "**", redirectTo: "signin"}


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
