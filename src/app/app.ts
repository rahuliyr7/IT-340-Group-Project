import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './component/header/header.component';
import { HomeComponent } from './component/home/home.component';
import { CartComponent } from './component/cart/cart.component';
import { WatchlistComponent } from './component/watchlist/watchlist.component';
import { MessagesComponent } from './component/messages/messages.component';
import { ProfileComponent } from './component/profile/profile.component';
import { LoginComponent } from './component/login/login.component';
import { RegisterComponent } from './component/register/register.component';
import { SellerDashboardComponent } from './component/seller-dashboard/seller-dashboard.component';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    HomeComponent,
    CartComponent,
    WatchlistComponent,
    MessagesComponent,
    ProfileComponent,
    LoginComponent,
    RegisterComponent,
    SellerDashboardComponent
  ],
  template: `
    <!-- Show registration page -->
    <app-register *ngIf="!isLoggedIn && showRegister" 
      (registerSuccess)="onRegisterSuccess()" 
      (switchToLogin)="showRegister = false">
    </app-register>
    
    <!-- Show login page -->
    <app-login *ngIf="!isLoggedIn && !showRegister" 
      (loginSuccess)="onLoginSuccess()"
      (switchToRegister)="showRegister = true">
    </app-login>
    
    <!-- Show main app if logged in -->
    <div *ngIf="isLoggedIn" class="min-h-screen bg-gray-50">
      <app-header 
        (pageChange)="currentPage = $event" 
        (logout)="onLogout()">
      </app-header>
      
      <!-- Seller Dashboard (only for sellers on home page) -->
      <app-seller-dashboard *ngIf="currentUser && currentUser.accountType === 'seller' && currentPage === 'home'"></app-seller-dashboard>
      
      <!-- Buyer Home Page -->
      <app-home *ngIf="currentPage === 'home' && (!currentUser || currentUser.accountType === 'buyer')"></app-home>
      
      <!-- Other Pages -->
      <app-cart *ngIf="currentPage === 'cart'"></app-cart>
      <app-watchlist *ngIf="currentPage === 'watchlist'"></app-watchlist>
      <app-messages *ngIf="currentPage === 'messages'"></app-messages>
      <app-profile *ngIf="currentPage === 'profile'"></app-profile>

      <footer class="bg-gray-900 text-white py-12 mt-12">
        <!-- Keep footer as is -->
      </footer>
    </div>
  `
})
export class AppComponent {
  currentPage = 'home';
  isLoggedIn = false;
  showRegister = false;
  currentUser: any = null;

  constructor(private authService: AuthService) {
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
  }

  onLoginSuccess() {
    this.isLoggedIn = true;
    this.currentPage = 'home';
  }

  onRegisterSuccess() {
    this.isLoggedIn = true;
    this.currentPage = 'home';
  }

  onLogout() {
    this.isLoggedIn = false;
    this.showRegister = false;
    this.currentPage = 'home';
    this.currentUser = null;
  }
}
