import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { AuthService } from '../../services/auth.service';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 py-12">
      <h2 class="text-3xl font-bold mb-8">My Profile</h2>
      
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- User Info Sidebar -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="text-center mb-6">
            <div class="bg-blue-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
            </div>
            <h3 class="text-xl font-bold">{{currentUser?.firstName}} {{currentUser?.lastName}}</h3>
            <p class="text-gray-600">{{currentUser?.email}}</p>
            <p class="text-sm text-gray-500 mt-2">
              <span class="px-3 py-1 rounded-full" 
                [class.bg-blue-100]="currentUser?.accountType === 'buyer'"
                [class.text-blue-600]="currentUser?.accountType === 'buyer'"
                [class.bg-purple-100]="currentUser?.accountType === 'seller'"
                [class.text-purple-600]="currentUser?.accountType === 'seller'">
                {{currentUser?.accountType === 'buyer' ? 'Buyer Account' : 'Seller Account'}}
              </span>
            </p>
          </div>
          <div class="space-y-3">
            <button class="w-full text-left px-4 py-2 rounded hover:bg-gray-100 transition">Account Settings</button>
            <button class="w-full text-left px-4 py-2 rounded hover:bg-gray-100 transition">Payment Methods</button>
            <button class="w-full text-left px-4 py-2 rounded hover:bg-gray-100 transition">Shipping Addresses</button>
          </div>
        </div>
        
        <!-- Order & Search History (Buyers Only) -->
        <div *ngIf="currentUser?.accountType === 'buyer'" class="lg:col-span-2 space-y-6">
          
          <!-- Order History -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-xl font-bold">Order History</h3>
              <button (click)="refreshOrders()" class="text-blue-600 hover:text-blue-800 text-sm">
                <svg class="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
                Refresh
              </button>
            </div>
            
            <div *ngIf="loadingOrders" class="text-center py-8">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>

            <div *ngIf="!loadingOrders && orders.length === 0" class="text-center py-8">
              <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
              </svg>
              <p class="text-gray-600">No orders yet</p>
              <p class="text-sm text-gray-500 mt-2">Your purchase history will appear here</p>
            </div>

            <div *ngIf="!loadingOrders && orders.length > 0" class="space-y-4">
              <div *ngFor="let order of orders" class="border rounded-lg p-4 hover:bg-gray-50 transition">
                <div class="flex items-start space-x-4">
                  <img [src]="order.productImage || 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=100'" 
                    [alt]="order.productName" 
                    class="w-20 h-20 object-cover rounded">
                  
                  <div class="flex-1">
                    <div class="flex justify-between items-start">
                      <div>
                        <h4 class="font-semibold text-lg">{{order.productName}}</h4>
                        <p class="text-sm text-gray-600">Sold by: {{order.sellerName}}</p>
                        <p class="text-xs text-gray-500 mt-1">
                          Order #{{order._id.slice(-8)}} • 
                          {{order.orderDate | date:'MMM d, yyyy'}}
                        </p>
                      </div>
                      <div class="text-right">
                        <p class="text-xl font-bold text-blue-600">\${{order.finalBid || order.price}}</p>
                        <span class="text-xs px-2 py-1 rounded-full" 
                          [class.bg-green-100]="order.status === 'completed'"
                          [class.text-green-600]="order.status === 'completed'"
                          [class.bg-yellow-100]="order.status === 'pending'"
                          [class.text-yellow-600]="order.status === 'pending'">
                          {{order.status.toUpperCase()}}
                        </span>
                      </div>
                    </div>
                    
                    <div *ngIf="order.orderType === 'auction_win'" class="mt-2">
                      <span class="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded">
                        🏆 Won Auction
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Search History -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-xl font-bold">Search History</h3>
              <button *ngIf="searchHistory.length > 0" 
                (click)="clearSearchHistory()" 
                class="text-red-600 hover:text-red-800 text-sm">
                Clear All
              </button>
            </div>
            
            <div *ngIf="loadingSearches" class="text-center py-8">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>

            <div *ngIf="!loadingSearches && searchHistory.length === 0" class="text-center py-8">
              <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <p class="text-gray-600">No search history</p>
              <p class="text-sm text-gray-500 mt-2">Your searches will be saved here</p>
            </div>

            <div *ngIf="!loadingSearches && searchHistory.length > 0" class="space-y-2">
              <div *ngFor="let search of searchHistory" 
                (click)="repeatSearch(search)"
                class="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition">
                <div class="flex-1">
                  <p class="font-medium">{{search.searchQuery}}</p>
                  <div class="flex items-center space-x-3 mt-1">
                    <span class="text-xs text-gray-500">
                      {{search.timestamp | date:'MMM d, h:mm a'}}
                    </span>
                    <span *ngIf="search.filters?.category" class="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded">
                      {{search.filters.category}}
                    </span>
                    <span class="text-xs text-gray-500">
                      {{search.resultsCount}} results
                    </span>
                  </div>
                </div>
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Seller View (No Order/Search History) -->
        <div *ngIf="currentUser?.accountType === 'seller'" class="lg:col-span-2 space-y-6">
          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-xl font-bold mb-4">Seller Account</h3>
            <p class="text-gray-600">Order and search history features are available for buyer accounts only.</p>
            <p class="text-sm text-gray-500 mt-4">Visit the home page to manage your product listings.</p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProfileComponent implements OnInit {
  currentUser: any = null;
  orders: any[] = [];
  searchHistory: any[] = [];
  loadingOrders = false;
  loadingSearches = false;

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private searchService: SearchService
  ) {}

  ngOnInit() {
    // Get current user
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      
      // Only load history for buyers
      if (user && user.accountType === 'buyer') {
        this.loadOrderHistory();
        this.loadSearchHistory();
      }
    });
  }

  loadOrderHistory() {
    this.loadingOrders = true;
    this.productService.getOrderHistory().subscribe({
      next: (response) => {
        this.orders = response.orders;
        this.loadingOrders = false;
        console.log('Loaded orders:', response.count);
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.loadingOrders = false;
      }
    });
  }

  loadSearchHistory() {
    this.loadingSearches = true;
    this.productService.getSearchHistory().subscribe({
      next: (response) => {
        this.searchHistory = response.searches;
        this.loadingSearches = false;
        console.log('Loaded search history:', response.count);
      },
      error: (error) => {
        console.error('Error loading search history:', error);
        this.loadingSearches = false;
      }
    });
  }

  refreshOrders() {
    this.loadOrderHistory();
  }

  clearSearchHistory() {
    if (confirm('Are you sure you want to clear your search history?')) {
      this.productService.clearSearchHistory().subscribe({
        next: () => {
          this.searchHistory = [];
          console.log('Search history cleared');
        },
        error: (error) => {
          console.error('Error clearing search history:', error);
        }
      });
    }
  }

  repeatSearch(search: any) {
    // Navigate to home and apply search
    console.log('Repeat search:', search.searchQuery);
    // You can emit an event or use a service to trigger search on home page
    alert(`Repeating search: "${search.searchQuery}"\n(Full implementation would navigate to home with this search)`);
  }
}
