import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule }    from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
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
import { ItemCardComponent } from './_components/item-card/item-card.component';
import { ButtonMainComponent } from './_components/button-main/button-main.component';
import { ModalLoginComponent } from './_components/modal-login/modal-login.component';
import { ModalSignupComponent } from './_components/modal-signup/modal-signup.component';
import { PaginationComponent } from './_components/pagination/pagination.component';
import { ListCategoriesComponent } from './_components/list-categories/list-categories.component';
import { BreadcrumbComponent } from './_components/breadcrumb/breadcrumb.component';
import { ReviewComponent } from './_components/review/review.component';
import { AddReviewFormComponent } from './_components/add-review-form/add-review-form.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    SearchComponent,
    ItemComponent,
    CartComponent,
    FooterComponent,
    ItemCardComponent,
    ButtonMainComponent,
    ModalLoginComponent,
    ModalSignupComponent,
    PaginationComponent,
    ListCategoriesComponent,
    BreadcrumbComponent,
    ReviewComponent,
    AddReviewFormComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [ServerService, AuthService, OnlyLoggedInGuard, CartService],
  bootstrap: [AppComponent]
})
export class AppModule { }
