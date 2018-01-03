import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from "@angular/router";


import { AppComponent } from './app.component';

import { ServerService } from "./_services/server.service";
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { SearchComponent } from './search/search.component';
import { ItemComponent } from './item/item.component';
import { CartComponent } from './cart/cart.component';
import { AuthService } from "./_services/auth.service";
import { OnlyLoggedInGuard } from "./_services/guards/only-logged-in-guard";
import { CartService } from "./_services/cart.service";
import { FooterComponent } from './footer/footer.component';


const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'search', component: SearchComponent},
  {
    path: 'item/:itemId',
    component: ItemComponent
  },
  {
    path: 'user/:userId/cart',
    component: CartComponent,
    canActivate: [OnlyLoggedInGuard]
  },
  {path: '**', component: HomeComponent}
];


@NgModule({
  declarations: [
    AppComponent,
	HeaderComponent,
	HomeComponent,
	SearchComponent,
	ItemComponent,
	CartComponent,
	FooterComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes, {useHash: true})
  ],
  providers: [ServerService, AuthService, OnlyLoggedInGuard, CartService],
  bootstrap: [AppComponent]
})
export class AppModule { }
