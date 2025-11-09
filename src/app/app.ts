import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './component/header/header.component';
import { HomeComponent } from './component/home/home.component';
import { CartComponent } from './component/cart/cart.component';
import { WatchlistComponent } from './component/watchlist/watchlist.component';
import { MessagesComponent } from './component/messages/messages.component';
import { ProfileComponent } from './component/profile/profile.component';

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
    ProfileComponent
  ],
  template: `
    <div class="min-h-screen bg-gray-50">
      <app-header (pageChange)="currentPage = $event"></app-header>
      
      <app-home *ngIf="currentPage === 'home'"></app-home>
      <app-cart *ngIf="currentPage === 'cart'"></app-cart>
      <app-watchlist *ngIf="currentPage === 'watchlist'"></app-watchlist>
      <app-messages *ngIf="currentPage === 'messages'"></app-messages>
      <app-profile *ngIf="currentPage === 'profile'"></app-profile>

      <footer class="bg-gray-900 text-white py-12 mt-12">
        <div class="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 class="text-xl font-bold mb-4">Atlantic Auctions</h3>
            <p class="text-gray-400 text-sm">
              The global marketplace for rare collectibles and limited edition items.
            </p>
          </div>
          <div>
            <h4 class="font-semibold mb-4">Quick Links</h4>
            <ul class="space-y-2 text-sm text-gray-400">
              <li><button class="hover:text-white transition">About Us</button></li>
              <li><button class="hover:text-white transition">How It Works</button></li>
              <li><button class="hover:text-white transition">Sell Items</button></li>
              <li><button class="hover:text-white transition">Contact Support</button></li>
            </ul>
          </div>
          <div>
            <h4 class="font-semibold mb-4">Categories</h4>
            <ul class="space-y-2 text-sm text-gray-400">
              <li><button class="hover:text-white transition">Sports Collectibles</button></li>
              <li><button class="hover:text-white transition">Comics & Art</button></li>
              <li><button class="hover:text-white transition">Watches & Jewelry</button></li>
              <li><button class="hover:text-white transition">Gaming & Tech</button></li>
            </ul>
          </div>
          <div>
            <h4 class="font-semibold mb-4">Customer Service</h4>
            <ul class="space-y-2 text-sm text-gray-400">
              <li><button class="hover:text-white transition">Help Center</button></li>
              <li><button class="hover:text-white transition">Buyer Protection</button></li>
              <li><button class="hover:text-white transition">Shipping Info</button></li>
              <li><button class="hover:text-white transition">Returns Policy</button></li>
            </ul>
          </div>
        </div>
        <div class="max-w-7xl mx-auto px-4 mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
          <p>&copy; 2024 Atlantic Auctions. All rights reserved.</p>
        </div>
      </footer>
    </div>
  `
})
export class AppComponent {
  currentPage = 'home';
}