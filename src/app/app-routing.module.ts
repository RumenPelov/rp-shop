import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { SearchComponent } from './search/search.component';
import { ItemComponent } from './item/item.component';
import { CartComponent } from './cart/cart.component';

import { OnlyLoggedInGuard } from "./_services/guards/only-logged-in-guard";



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
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
