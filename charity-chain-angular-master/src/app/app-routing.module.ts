import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterbarComponent } from './registerbar/registerbar.component';
import {MetaSenderComponent} from './meta/meta-sender/meta-sender.component';
import { ProfilebarComponent } from './profilebar/profilebar.component';
import { ReqtokenbarComponent } from './reqtokenbar/reqtokenbar.component';

const routes: Routes = [
  { path: '', redirectTo: 'profile', pathMatch: 'full' },
  { path:'register' , component: RegisterbarComponent },
  { path:'donation' , component: MetaSenderComponent },
  { path:'profile' , component: ProfilebarComponent },
  { path:'reqtoken' , component: ReqtokenbarComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
