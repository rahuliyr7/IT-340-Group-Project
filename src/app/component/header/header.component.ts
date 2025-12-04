import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { WatchlistService } from '../../services/watchlist.service';
import { NotificationService } from '../../services/notification.service';
import { SearchService } from '../../services/search.service';
import { Notification } from '../../models/product.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <header class="bg-gradient-to-r from-blue-900 to-blue-700 text-white shadow-lg sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <button (click)="mobileMenuOpen = !mobileMenuOpen" class="lg:hidden">
              <svg *ngIf="!mobileMenuOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
              <svg *ngIf="mobileMenuOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
            <div class="flex items-center space-x-2 cursor-pointer" (click)="changePage('home')">
              <div class="bg-white text-blue-900 p-2 rounded-lg font-bold text-xl">AA</div>
              <div>
                <h1 class="text-2xl font-bold">Atlantic Auctions</h1>
                <p class="text-xs text-blue-200">Global Collectibles Marketplace</p>
              </div>
            </div>
          </div>

          <div class="hidden lg:flex flex-1 max-w-2xl mx-8">
            <div class="relative w-full">
              <input
                type="text"
                placeholder="Search for collectibles, auctions, and more..."
                [(ngModel)]="searchQuery"
                (input)="onSearch()"
                class="w-full px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <svg class="absolute right-3 top-3 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
          </div>

          <div class="flex items-center space-x-4">
            <button (click)="showNotifications = !showNotifications" class="relative hover:bg-blue-800 p-2 rounded-lg transition">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
              </svg>
              <span *ngIf="notificationCount > 0" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {{notificationCount}}
              </span>
            </button>
            <button (click)="changePage('messages')" class="hover:bg-blue-800 p-2 rounded-lg transition">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
              </svg>
            </button>
            <button (click)="changePage('watchlist')" class="relative hover:bg-blue-800 p-2 rounded-lg transition">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
              </svg>
              <span *ngIf="watchlistCount > 0" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {{watchlistCount}}
              </span>
            </button>
            <button (click)="changePage('cart')" class="relative hover:bg-blue-800 p-2 rounded-lg transition">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
              <span *ngIf="cartCount > 0" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {{cartCount}}
              </span>
            </button>
            <button (click)="changePage('profile')" class="hover:bg-blue-800 p-2 rounded-lg transition">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Mobile Search -->
        <div class="lg:hidden mt-4">
          <div class="relative">
            <input
              type="text"
              placeholder="Search..."
              [(ngModel)]="searchQuery"
              (input)="onSearch()"
              class="w-full px-4 py-2 rounded-lg text-gray-900 focus:outline-none"
            />
            <svg class="absolute right-3 top-2 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
        </div>
      </div>

      <!-- Notifications Dropdown -->
      <div *ngIf="showNotifications" class="absolute right-4 mt-2 w-80 bg-white text-gray-900 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
        <div class="p-4 border-b font-semibold">Notifications</div>
        <div *ngIf="notifications.length === 0" class="p-4 text-center text-gray-500">No notifications</div>
        <div *ngFor="let notif of notifications" class="p-4 border-b hover:bg-gray-50">
          <p class="text-sm">{{notif.message}}</p>
          <p class="text-xs text-gray-500 mt-1">{{notif.time | date:'short'}}</p>
        </div>
      </div>
    </header>
  `
})
export class HeaderComponent {
  @Output() pageChange = new EventEmitter<string>();
  @Output() logout = new EventEmitter<void>();
  
  searchQuery = '';
  mobileMenuOpen = false;
  showNotifications = false;
  
  cartCount = 0;
  watchlistCount = 0;
  notificationCount = 0;
  notifications: Notification[] = [];

  constructor(
    private cartService: CartService,
    private watchlistService: WatchlistService,
    private notificationService: NotificationService,
    private searchService: SearchService
    private authService: AuthService,
  ) {
    this.cartService.cartItems$.subscribe(items => {
      this.cartCount = items.length;
    });

    this.watchlistService.watchlist$.subscribe(items => {
      this.watchlistCount = items.length;
    });

    this.notificationService.notifications$.subscribe(notifs => {
      this.notifications = notifs;
      this.notificationCount = notifs.length;
    });
  }

  changePage(page: string) {
    this.pageChange.emit(page);
    this.mobileMenuOpen = false;
  }

  onSearch() {
    if (this.searchQuery.trim()) {
      this.searchService.addToHistory(this.searchQuery);
    }
  }
}

onLogout() {
  this.authService.logout();
  this.logout.emit();
}
