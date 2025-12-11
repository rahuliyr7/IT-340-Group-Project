import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
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
    RouterOutlet,
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
    <!-- Registration Page -->
    <app-register 
      *ngIf="!isLoggedIn && showRegister" 
      (registerSuccess)="onRegisterSuccess()" 
      (switchToLogin)="showRegister = false">
    </app-register>
    
    <!-- Login Page -->
    <app-login 
      *ngIf="!isLoggedIn && !showRegister" 
      (loginSuccess)="onLoginSuccess()"
      (switchToRegister)="showRegister = true">
    </app-login>
    
    <!-- Main Application (After Login) -->
    <div *ngIf="isLoggedIn" class="min-h-screen bg-gray-50">
      <!-- Header Navigation -->
      <app-header 
        (pageChange)="currentPage = $event" 
        (logout)="onLogout()">
      </app-header>
      
      <!-- Home Page - Role-Based Display -->
      <div *ngIf="currentPage === 'home'">
        <!-- Seller Dashboard for Seller Accounts -->
        <app-seller-dashboard 
          *ngIf="currentUser && currentUser.accountType === 'seller'">
        </app-seller-dashboard>
        
        <!-- Buyer Home Page for Buyer Accounts -->
        <app-home 
          *ngIf="!currentUser || currentUser.accountType === 'buyer'">
        </app-home>
      </div>
      
      <!-- Other Pages (Available to All Users) -->
      <app-cart *ngIf="currentPage === 'cart'"></app-cart>
      <app-watchlist *ngIf="currentPage === 'watchlist'"></app-watchlist>
      <app-messages *ngIf="currentPage === 'messages'"></app-messages>
      <app-profile *ngIf="currentPage === 'profile'"></app-profile>

      <!-- Footer -->
      <footer class="bg-gray-900 text-white py-12 mt-12">
        <div class="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <!-- Company Info -->
          <div>
            <h3 class="text-xl font-bold mb-4">Atlantic Auctions</h3>
            <p class="text-gray-400 text-sm">
              The global marketplace for rare collectibles and limited edition items.
            </p>
            <div class="mt-4">
              <p class="text-sm text-gray-400">
                <span class="font-semibold">Account Type:</span> 
                <span class="text-blue-400">
                  {{ currentUser?.accountType === 'seller' ? 'Seller' : 'Buyer' }}
                </span>
              </p>
            </div>
          </div>
          
          <!-- Quick Links -->
          <div>
            <h4 class="font-semibold mb-4">Quick Links</h4>
            <ul class="space-y-2 text-sm text-gray-400">
              <li><button class="hover:text-white transition">About Us</button></li>
              <li><button class="hover:text-white transition">How It Works</button></li>
              <li *ngIf="currentUser?.accountType === 'buyer'">
                <button class="hover:text-white transition">Start Bidding</button>
              </li>
              <li *ngIf="currentUser?.accountType === 'seller'">
                <button class="hover:text-white transition">List Your Items</button>
              </li>
              <li><button class="hover:text-white transition">Contact Support</button></li>
            </ul>
          </div>
          
          <!-- Categories -->
          <div>
            <h4 class="font-semibold mb-4">Categories</h4>
            <ul class="space-y-2 text-sm text-gray-400">
              <li><button class="hover:text-white transition">Sports Collectibles</button></li>
              <li><button class="hover:text-white transition">Comics & Art</button></li>
              <li><button class="hover:text-white transition">Watches & Jewelry</button></li>
              <li><button class="hover:text-white transition">Movies & Entertainment</button></li>
              <li><button class="hover:text-white transition">Music & Vinyl</button></li>
              <li><button class="hover:text-white transition">Gaming & Tech</button></li>
            </ul>
          </div>
          
          <!-- Customer Service -->
          <div>
            <h4 class="font-semibold mb-4">Customer Service</h4>
            <ul class="space-y-2 text-sm text-gray-400">
              <li><button class="hover:text-white transition">Help Center</button></li>
              <li><button class="hover:text-white transition">Buyer Protection</button></li>
              <li><button class="hover:text-white transition">Seller Guidelines</button></li>
              <li><button class="hover:text-white transition">Shipping Info</button></li>
              <li><button class="hover:text-white transition">Returns Policy</button></li>
              <li><button class="hover:text-white transition">Terms of Service</button></li>
            </ul>
          </div>
        </div>
        
        <!-- Copyright -->
        <div class="max-w-7xl mx-auto px-4 mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
          <p>&copy; 2024 Atlantic Auctions. All rights reserved.</p>
          <p class="mt-2">
            IT 340 - Introduction to Systems Administration | Milestone 3
          </p>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `]
})
export class AppComponent {
  title = 'Atlantic Auctions';
  currentPage = 'home';
  isLoggedIn = false;
  showRegister = false;
  currentUser: any = null;

  constructor(private authService: AuthService) {
    // Subscribe to current user changes
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      console.log('Current user updated:', user);
    });

    // Check if user is already logged in (token in localStorage)
    const token = this.authService.getToken();
    if (token && this.authService.isLoggedIn()) {
      this.isLoggedIn = true;
    }
  }

  onLoginSuccess() {
    console.log('Login successful');
    this.isLoggedIn = true;
    this.currentPage = 'home';
    this.showRegister = false;
  }

  onRegisterSuccess() {
    console.log('Registration successful');
    this.isLoggedIn = true;
    this.currentPage = 'home';
    this.showRegister = false;
  }

  onLogout() {
    console.log('Logging out');
    this.authService.logout();
    this.isLoggedIn = false;
    this.showRegister = false;
    this.currentPage = 'home';
    this.currentUser = null;
  }
}
