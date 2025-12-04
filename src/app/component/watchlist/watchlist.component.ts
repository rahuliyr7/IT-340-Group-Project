import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WatchlistService } from '../../services/watchlist.service';
import { CartService } from '../../services/cart.service';
import { NotificationService } from '../../services/notification.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-watchlist',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 py-12">
      <h2 class="text-3xl font-bold mb-8">My Watchlist</h2>
      
      <div *ngIf="watchlist.length === 0" class="text-center py-12">
        <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
        </svg>
        <p class="text-xl text-gray-600">No items in your watchlist</p>
        <button class="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
          Browse Items
        </button>
      </div>

      <div *ngIf="watchlist.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let product of watchlist" class="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
          <div class="relative">
            <img [src]="product.image" [alt]="product.name" class="w-full h-48 object-cover" />
            <div *ngIf="product.verified" class="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold flex items-center">
              <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              Verified
            </div>
            <div *ngIf="product.isAuction" class="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
              LIVE AUCTION
            </div>
            <button (click)="removeFromWatchlist(product)" class="absolute bottom-2 right-2 p-2 rounded-full bg-red-500 shadow-lg hover:scale-110 transition">
              <svg class="w-5 h-5" fill="white" stroke="white" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
              </svg>
            </button>
          </div>
          
          <div class="p-4">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded">{{product.category}}</span>
              <span [class]="getRarityClass(product.rarity)" class="text-xs font-semibold px-2 py-1 rounded">
                {{product.rarity}}
              </span>
            </div>
            
            <h3 class="font-semibold text-lg mb-2 text-gray-800">{{product.name}}</h3>
            
            <div *ngIf="product.isAuction">
              <div class="flex items-center justify-between mb-2">
                <div>
                  <p class="text-xs text-gray-500">Current Bid</p>
                  <p class="text-xl font-bold text-green-600">\${{product.currentBid}}</p>
                </div>
                <div class="text-right">
                  <p class="text-xs text-gray-500">{{product.bids}} bids</p>
                  <p class="text-sm font-semibold text-gray-700">Buy Now: \${{product.price}}</p>
                </div>
              </div>
              
              <div class="bg-gray-100 rounded p-2 mb-3 flex items-center justify-center space-x-2 text-sm">
                <svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span class="font-semibold">{{getTimeRemaining(product.auctionEnd!)}}</span>
              </div>
              
              <button class="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-2 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition">
                Place Bid
              </button>
            </div>

            <div *ngIf="!product.isAuction">
              <p class="text-2xl font-bold text-gray-800 mb-3">\${{product.price}}</p>
              <button (click)="addToCart(product)" class="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class WatchlistComponent implements OnInit {
  watchlist: Product[] = [];

  constructor(
    private watchlistService: WatchlistService,
    private cartService: CartService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.watchlistService.watchlist$.subscribe(items => {
      this.watchlist = items;
    });
  }

  removeFromWatchlist(product: Product) {
    this.watchlistService.toggleWatchlist(product);
    this.notificationService.addNotification(`${product.name} removed from watchlist`);
  }

  addToCart(product: Product) {
    if (this.cartService.addToCart(product)) {
      this.notificationService.addNotification(`${product.name} added to cart`);
    }
  }

  getRarityClass(rarity: string): string {
    if (rarity === 'Ultra Rare') return 'bg-purple-100 text-purple-600';
    if (rarity === 'Rare') return 'bg-yellow-100 text-yellow-600';
    return 'bg-gray-100 text-gray-600';
  }

  getTimeRemaining(endDate: Date): string {
    const total = endDate.getTime() - Date.now();
    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    return `${days}d ${hours}h ${minutes}m`;
  }
}