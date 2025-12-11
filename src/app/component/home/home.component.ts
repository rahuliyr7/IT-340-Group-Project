import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { WatchlistService } from '../../services/watchlist.service';
import { NotificationService } from '../../services/notification.service';
import { AuthService } from '../../services/auth.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Hero Section -->
    <div class="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16 px-4">
      <div class="max-w-7xl mx-auto text-center">
        <h2 class="text-5xl font-bold mb-4">Welcome to Atlantic Auctions</h2>
        <p class="text-xl mb-8">The Global Marketplace for Rare Collectibles & Limited Editions</p>
        <div class="flex justify-center space-x-4">
          <button class="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
            Start Bidding
          </button>
          <button class="bg-transparent border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition">
            Sell Items
          </button>
        </div>
      </div>
    </div>

    <!-- Features -->
    <div class="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="text-center">
        <div class="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="text-blue-600 w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
          </svg>
        </div>
        <h3 class="text-xl font-bold mb-2">Verified Listings</h3>
        <p class="text-gray-600">All items verified through community ratings and our authentication process</p>
      </div>
      <div class="text-center">
        <div class="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="text-green-600 w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
          </svg>
        </div>
        <h3 class="text-xl font-bold mb-2">Live Auctions</h3>
        <p class="text-gray-600">Real-time bidding with instant notifications and updates</p>
      </div>
      <div class="text-center">
        <div class="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="text-purple-600 w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
          </svg>
        </div>
        <h3 class="text-xl font-bold mb-2">Direct Messaging</h3>
        <p class="text-gray-600">Communicate directly with sellers and other collectors</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="max-w-7xl mx-auto px-4 mb-8">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-3xl font-bold text-gray-800">Browse Collectibles</h2>
        <button (click)="showFilters = !showFilters" class="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow hover:shadow-md transition">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/>
          </svg>
          <span>Filters</span>
          <svg class="w-5 h-5 transform transition" [class.rotate-180]="showFilters" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
          </svg>
        </button>
      </div>

      <div *ngIf="showFilters" class="bg-white p-6 rounded-lg shadow-md mb-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 class="font-semibold mb-3">Categories</h4>
            <div class="flex flex-wrap gap-2">
              <button *ngFor="let cat of categories" (click)="toggleFilter(cat)" 
                [class.bg-blue-600]="cat === 'All' && selectedFilters.length === 0 || selectedFilters.includes(cat)"
                [class.text-white]="cat === 'All' && selectedFilters.length === 0 || selectedFilters.includes(cat)"
                [class.bg-gray-100]="!(cat === 'All' && selectedFilters.length === 0) && !selectedFilters.includes(cat)"
                [class.text-gray-700]="!(cat === 'All' && selectedFilters.length === 0) && !selectedFilters.includes(cat)"
                class="px-4 py-2 rounded-lg transition hover:bg-gray-200">
                {{cat}}
              </button>
            </div>
          </div>
          <div>
            <h4 class="font-semibold mb-3">Sort By</h4>
            <select [(ngModel)]="sortBy" (change)="onSortChange()" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option *ngFor="let option of sortOptions" [value]="option">{{option}}</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div *ngIf="isLoading" class="max-w-7xl mx-auto px-4 pb-12 text-center py-12">
      <div class="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      <p class="mt-4 text-gray-600 text-lg">Loading products...</p>
    </div>

    <!-- No Products State -->
    <div *ngIf="!isLoading && filteredProducts.length === 0" class="max-w-7xl mx-auto px-4 pb-12">
      <div class="bg-white rounded-lg shadow-md p-12 text-center">
        <svg class="w-20 h-20 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
        </svg>
        <h3 class="text-2xl font-bold text-gray-800 mb-2">No Products Found</h3>
        <p class="text-gray-600 mb-6">Try adjusting your filters or search query</p>
        <button (click)="clearFilters()" class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold">
          Clear All Filters
        </button>
      </div>
    </div>

    <!-- Products Grid -->
    <div *ngIf="!isLoading && filteredProducts.length > 0" class="max-w-7xl mx-auto px-4 pb-12">
      <div class="mb-4 text-gray-600">
        Showing {{filteredProducts.length}} product{{filteredProducts.length !== 1 ? 's' : ''}}
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let product of filteredProducts" class="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
          <div class="relative">
            <img [src]="getProductImage(product)" [alt]="product.name" class="w-full h-48 object-cover" />
            <div *ngIf="product.verified" class="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold flex items-center">
              <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              Verified
            </div>
            <div *ngIf="product.isAuction" class="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
              LIVE AUCTION
            </div>
            <button (click)="toggleWatchlist(product)" 
              [class.bg-red-500]="isInWatchlist(product._id!)"
              [class.bg-white]="!isInWatchlist(product._id!)"
              class="absolute bottom-2 right-2 p-2 rounded-full shadow-lg hover:scale-110 transition">
              <svg class="w-5 h-5" [attr.fill]="isInWatchlist(product._id!) ? 'white' : 'none'" 
                [attr.stroke]="isInWatchlist(product._id!) ? 'white' : 'red'" viewBox="0 0 24 24">
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
            <p class="text-sm text-gray-600 mb-3 line-clamp-2">{{product.description}}</p>
            
            <div *ngIf="product.isAuction">
              <div class="flex items-center justify-between mb-2">
                <div>
                  <p class="text-xs text-gray-500">Current Bid</p>
                  <p class="text-xl font-bold text-green-600">\${{product.currentBid || 0}}</p>
                </div>
                <div class="text-right">
                  <p class="text-xs text-gray-500">{{product.bids?.length || 0}} bids</p>
                  <p class="text-sm font-semibold text-gray-700">Buy Now: \${{product.price}}</p>
                </div>
              </div>
              
              <div class="bg-gray-100 rounded p-2 mb-3 flex items-center justify-center space-x-2 text-sm">
                <svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span class="font-semibold">{{getTimeRemaining(product.auctionEnd)}}</span>
              </div>
              
              <div class="grid grid-cols-2 gap-2">
                <button (click)="placeBid(product)" 
                  [disabled]="!canBid()"
                  class="bg-gradient-to-r from-green-500 to-green-600 text-white py-2 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
                  Place Bid
                </button>
                <button (click)="purchaseProduct(product)"
                  [disabled]="!canPurchase()"
                  class="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
                  Buy Now
                </button>
              </div>
            </div>

            <div *ngIf="!product.isAuction">
              <p class="text-2xl font-bold text-gray-800 mb-3">\${{product.price}}</p>
              <button (click)="purchaseProduct(product)"
                [disabled]="!canPurchase()"
                class="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
                Buy Now
              </button>
            </div>

            <!-- Seller Information -->
            <div class="mt-3 pt-3 border-t border-gray-200">
              <p class="text-xs text-gray-500">Sold by</p>
              <p class="text-sm font-semibold text-gray-700">{{product.sellerName}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class HomeComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories = ['All', 'Sports', 'Comics', 'Watches', 'Movies', 'Music', 'Gaming', 'Other'];
  sortOptions = ['Newest', 'Price: Low to High', 'Price: High to Low', 'Rarity', 'Ending Soon'];
  selectedFilters: string[] = [];
  sortBy = 'Newest';
  showFilters = false;
  searchQuery = '';
  isLoading = true;
  currentUser: any = null;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private watchlistService: WatchlistService,
    private notificationService: NotificationService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Get current user
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      console.log('Current user:', this.currentUser);
    });

    // Load products from API
    this.loadProducts();

    // Set up auto-refresh for auction countdowns (every 60 seconds)
    setInterval(() => {
      if (this.filteredProducts.some(p => p.isAuction)) {
        // Just trigger change detection for time updates
        this.filteredProducts = [...this.filteredProducts];
      }
    }, 60000);
  }

  loadProducts() {
    this.isLoading = true;
    this.productService.getAllProducts().subscribe({
      next: (response) => {
        this.products = response.products;
        this.filteredProducts = response.products;
        this.isLoading = false;
        console.log('Loaded products:', response.count);
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.isLoading = false;
        this.notificationService.addNotification('Error loading products');
      }
    });
  }

  toggleFilter(category: string) {
    if (category === 'All') {
      this.selectedFilters = [];
    } else {
      const index = this.selectedFilters.indexOf(category);
      if (index > -1) {
        this.selectedFilters.splice(index, 1);
      } else {
        this.selectedFilters.push(category);
      }
    }
    this.applyFilters();
  }

  applyFilters() {
    const filters: any = {};
    
    if (this.selectedFilters.length > 0) {
      filters.category = this.selectedFilters[0]; // API supports single category
    }
    
    if (this.searchQuery) {
      filters.search = this.searchQuery;
    }

    // Map sort options to API format
    const sortMap: any = {
      'Newest': 'newest',
      'Price: Low to High': 'price-low',
      'Price: High to Low': 'price-high',
      'Ending Soon': 'ending-soon',
      'Rarity': 'rarity'
    };
    filters.sortBy = sortMap[this.sortBy] || 'newest';

    this.isLoading = true;
    this.productService.getAllProducts(filters).subscribe({
      next: (response) => {
        this.filteredProducts = response.products;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error filtering products:', error);
        this.isLoading = false;
      }
    });
  }

  clearFilters() {
    this.selectedFilters = [];
    this.searchQuery = '';
    this.sortBy = 'Newest';
    this.loadProducts();
  }

  onSearch(query: string) {
    this.searchQuery = query;
    this.applyFilters();
  }

  onSortChange() {
    this.applyFilters();
  }

  canPurchase(): boolean {
    if (!this.currentUser) {
      return false;
    }
    return this.currentUser.accountType === 'buyer';
  }

  canBid(): boolean {
    if (!this.currentUser) {
      return false;
    }
    return this.currentUser.accountType === 'buyer';
  }

  purchaseProduct(product: Product) {
    if (!this.currentUser) {
      this.notificationService.addNotification('Please login to purchase');
      return;
    }

    if (this.currentUser.accountType !== 'buyer') {
      this.notificationService.addNotification('Only buyer accounts can purchase items');
      return;
    }

    const confirmMessage = product.isAuction 
      ? `Purchase ${product.name} immediately for $${product.price}? (This will end the auction)`
      : `Purchase ${product.name} for $${product.price}?`;

    if (confirm(confirmMessage)) {
      this.productService.purchaseProduct(product._id!).subscribe({
        next: (response) => {
          this.notificationService.addNotification(response.message);
          this.loadProducts(); // Reload to remove purchased item
        },
        error: (error) => {
          this.notificationService.addNotification(error.error?.message || 'Purchase failed');
        }
      });
    }
  }

  placeBid(product: Product) {
    if (!this.currentUser) {
      this.notificationService.addNotification('Please login to place a bid');
      return;
    }

    if (this.currentUser.accountType !== 'buyer') {
      this.notificationService.addNotification('Only buyer accounts can place bids');
      return;
    }

    const minBid = (product.currentBid || 0) + 1;
    const bidAmount = prompt(
      `Current bid: $${product.currentBid || 0}\n` +
      `Minimum bid: $${minBid}\n\n` +
      `Enter your bid amount:`
    );
    
    if (bidAmount && !isNaN(Number(bidAmount))) {
      const amount = Number(bidAmount);
      
      if (amount < minBid) {
        this.notificationService.addNotification(`Bid must be at least $${minBid}`);
        return;
      }

      this.productService.placeBid(product._id!, amount).subscribe({
        next: (response) => {
          this.notificationService.addNotification(response.message);
          this.loadProducts(); // Reload to show updated bid
        },
        error: (error) => {
          this.notificationService.addNotification(error.error?.message || 'Failed to place bid');
        }
      });
    }
  }

  addToCart(product: Product) {
    // Check if user is a buyer
    if (!this.currentUser) {
      this.notificationService.addNotification('Please login to add items to cart');
      return;
    }

    if (this.currentUser.accountType !== 'buyer') {
      this.notificationService.addNotification('Only buyer accounts can add items to cart');
      return;
    }

    if (this.cartService.addToCart(product)) {
      this.notificationService.addNotification(`${product.name} added to cart`);
    }
  }

  toggleWatchlist(product: Product) {
    if (!this.currentUser) {
      this.notificationService.addNotification('Please login to add items to watchlist');
      return;
    }

    const added = this.watchlistService.toggleWatchlist(product);
    const message = added ? `${product.name} added to watchlist` : `${product.name} removed from watchlist`;
    this.notificationService.addNotification(message);
  }

  isInWatchlist(productId: string): boolean {
    // Convert string ID to number for watchlist service
    return this.watchlistService.isInWatchlist(Number(productId));
  }

  getRarityClass(rarity: string): string {
    if (rarity === 'Ultra Rare') return 'bg-purple-100 text-purple-600';
    if (rarity === 'Rare') return 'bg-yellow-100 text-yellow-600';
    return 'bg-gray-100 text-gray-600';
  }

  getTimeRemaining(endDate: Date | undefined): string {
    if (!endDate) return 'N/A';
    
    const end = new Date(endDate);
    const total = end.getTime() - Date.now();
    
    if (total < 0) return 'Ended';
    
    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    
    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  }

  getProductImage(product: Product): string {
    if (product.images && product.images.length > 0) {
      return product.images[0];
    }
    if (product.image) {
      return product.image;
    }
    // Default image
    return 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=400';
  }
}
