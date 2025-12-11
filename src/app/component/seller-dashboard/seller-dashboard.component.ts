import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-seller-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 py-12">
      <div class="flex justify-between items-center mb-8">
        <h2 class="text-3xl font-bold">Seller Dashboard</h2>
        <button (click)="showCreateForm = true" class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold">
          + Create New Listing
        </button>
      </div>

      <!-- Create Product Form Modal -->
      <div *ngIf="showCreateForm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-2xl font-bold">Create New Product</h3>
            <button (click)="cancelCreate()" class="text-gray-500 hover:text-gray-700">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <form (ngSubmit)="createProduct()">
            <!-- Product Name -->
            <div class="mb-4">
              <label class="block text-gray-700 font-semibold mb-2">Product Name *</label>
              <input type="text" [(ngModel)]="newProduct.name" name="name" required
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Vintage Baseball Card">
            </div>

            <!-- Description -->
            <div class="mb-4">
              <label class="block text-gray-700 font-semibold mb-2">Description *</label>
              <textarea [(ngModel)]="newProduct.description" name="description" required rows="4"
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Detailed description of the product..."></textarea>
            </div>

            <!-- Category and Rarity -->
            <div class="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label class="block text-gray-700 font-semibold mb-2">Category *</label>
                <select [(ngModel)]="newProduct.category" name="category" required
                  class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select Category</option>
                  <option value="Sports">Sports</option>
                  <option value="Comics">Comics</option>
                  <option value="Watches">Watches</option>
                  <option value="Movies">Movies</option>
                  <option value="Music">Music</option>
                  <option value="Gaming">Gaming</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label class="block text-gray-700 font-semibold mb-2">Rarity *</label>
                <select [(ngModel)]="newProduct.rarity" name="rarity" required
                  class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select Rarity</option>
                  <option value="Common">Common</option>
                  <option value="Rare">Rare</option>
                  <option value="Ultra Rare">Ultra Rare</option>
                </select>
              </div>
            </div>

            <!-- Condition and Price -->
            <div class="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label class="block text-gray-700 font-semibold mb-2">Condition</label>
                <select [(ngModel)]="newProduct.condition" name="condition"
                  class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="New">New</option>
                  <option value="Like New">Like New</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Poor">Poor</option>
                </select>
              </div>

              <div>
                <label class="block text-gray-700 font-semibold mb-2">Price ($) *</label>
                <input type="number" [(ngModel)]="newProduct.price" name="price" required min="0" step="0.01"
                  class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00">
              </div>
            </div>

            <!-- Auction Toggle -->
            <div class="mb-4">
              <label class="flex items-center cursor-pointer">
                <input type="checkbox" [(ngModel)]="newProduct.isAuction" name="isAuction" class="mr-2">
                <span class="text-gray-700 font-semibold">List as Auction</span>
              </label>
            </div>

            <!-- Auction Fields (shown only if isAuction is true) -->
            <div *ngIf="newProduct.isAuction" class="bg-blue-50 p-4 rounded-lg mb-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-gray-700 font-semibold mb-2">Auction Duration (days)</label>
                  <input type="number" [(ngModel)]="newProduct.auctionDuration" name="auctionDuration" min="1" max="30"
                    class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="7">
                </div>

                <div>
                  <label class="block text-gray-700 font-semibold mb-2">Reserve Price ($)</label>
                  <input type="number" [(ngModel)]="newProduct.reservePrice" name="reservePrice" min="0" step="0.01"
                    class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Optional">
                </div>
              </div>
              <p class="text-sm text-gray-600 mt-2">
                Note: Price above will be the "Buy Now" price. Bidding starts at $0.
              </p>
            </div>

            <!-- Image URL -->
            <div class="mb-4">
              <label class="block text-gray-700 font-semibold mb-2">Image URL (Optional)</label>
              <input type="url" [(ngModel)]="newProduct.imageUrl" name="imageUrl"
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/image.jpg">
              <p class="text-xs text-gray-500 mt-1">Leave blank for default image</p>
            </div>

            <!-- Error Message -->
            <div *ngIf="errorMessage" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p class="text-sm text-red-600">{{errorMessage}}</p>
            </div>

            <!-- Buttons -->
            <div class="flex space-x-4">
              <button type="submit" [disabled]="isLoading"
                class="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50">
                <span *ngIf="!isLoading">Create Product</span>
                <span *ngIf="isLoading">Creating...</span>
              </button>
              <button type="button" (click)="cancelCreate()"
                class="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400 transition">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Products List -->
      <div *ngIf="isLoading && !showCreateForm" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p class="mt-4 text-gray-600">Loading your products...</p>
      </div>

      <div *ngIf="!isLoading && myProducts.length === 0" class="text-center py-12 bg-white rounded-lg shadow">
        <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
        </svg>
        <p class="text-xl text-gray-600 mb-4">No products yet</p>
        <p class="text-gray-500 mb-6">Create your first product listing to get started!</p>
        <button (click)="showCreateForm = true" class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold">
          Create First Product
        </button>
      </div>

      <div *ngIf="!isLoading && myProducts.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let product of myProducts" class="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden">
          <img [src]="getProductImage(product)" [alt]="product.name" class="w-full h-48 object-cover">
          
          <div class="p-4">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded">{{product.category}}</span>
              <span [class]="getStatusClass(product.status)" class="text-xs font-semibold px-2 py-1 rounded">
                {{product.status.toUpperCase()}}
              </span>
            </div>

            <h3 class="font-semibold text-lg mb-2">{{product.name}}</h3>
            <p class="text-sm text-gray-600 mb-3 line-clamp-2">{{product.description}}</p>

            <div class="mb-3">
              <p class="text-xs text-gray-500">Price</p>
              <p class="text-xl font-bold text-gray-800">\${{product.price}}</p>
            </div>

            <div *ngIf="product.isAuction" class="bg-gray-100 rounded p-2 mb-3">
              <p class="text-xs text-gray-600">Current Bid: <span class="font-bold">\${{product.currentBid || 0}}</span></p>
              <p class="text-xs text-gray-600">Total Bids: <span class="font-bold">{{product.bids?.length || 0}}</span></p>
            </div>

            <div class="flex space-x-2">
              <button (click)="editProduct(product)" 
                [disabled]="product.status !== 'active'"
                class="flex-1 bg-yellow-500 text-white py-2 rounded-lg font-semibold hover:bg-yellow-600 transition disabled:opacity-50 disabled:cursor-not-allowed">
                Edit
              </button>
              <button (click)="deleteProduct(product)" 
                [disabled]="product.status !== 'active'"
                class="flex-1 bg-red-500 text-white py-2 rounded-lg font-semibold hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SellerDashboardComponent implements OnInit {
  myProducts: Product[] = [];
  showCreateForm = false;
  isLoading = false;
  errorMessage = '';

  newProduct: any = {
    name: '',
    description: '',
    category: '',
    rarity: '',
    condition: 'Good',
    price: 0,
    isAuction: false,
    auctionDuration: 7,
    reservePrice: null,
    imageUrl: ''
  };

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.loadMyProducts();
  }

  loadMyProducts() {
    this.isLoading = true;
    this.productService.getMyProducts().subscribe({
      next: (response) => {
        this.myProducts = response.products;
        this.isLoading = false;
        console.log('Loaded my products:', response.count);
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.isLoading = false;
        this.notificationService.addNotification('Error loading your products');
      }
    });
  }

  createProduct() {
    this.errorMessage = '';

    // Validation
    if (!this.newProduct.name || !this.newProduct.description || 
        !this.newProduct.category || !this.newProduct.rarity || !this.newProduct.price) {
      this.errorMessage = 'Please fill in all required fields';
      return;
    }

    if (this.newProduct.price <= 0) {
      this.errorMessage = 'Price must be greater than 0';
      return;
    }

    this.isLoading = true;

    // Prepare product data
    const productData: any = {
      name: this.newProduct.name,
      description: this.newProduct.description,
      category: this.newProduct.category,
      rarity: this.newProduct.rarity,
      condition: this.newProduct.condition,
      price: this.newProduct.price,
      isAuction: this.newProduct.isAuction
    };

    if (this.newProduct.imageUrl) {
      productData.images = [this.newProduct.imageUrl];
    }

    if (this.newProduct.isAuction) {
      productData.auctionDuration = this.newProduct.auctionDuration || 7;
      if (this.newProduct.reservePrice) {
        productData.reservePrice = this.newProduct.reservePrice;
      }
    }

    this.productService.createProduct(productData).subscribe({
      next: (response) => {
        this.notificationService.addNotification('Product created successfully!');
        this.isLoading = false;
        this.showCreateForm = false;
        this.resetForm();
        this.loadMyProducts(); // Reload list
      },
      error: (error) => {
        console.error('Error creating product:', error);
        this.errorMessage = error.error?.message || 'Failed to create product';
        this.isLoading = false;
      }
    });
  }

  editProduct(product: Product) {
    // For now, just show an alert (you can create an edit modal later)
    alert(`Edit functionality coming soon for: ${product.name}`);
    // TODO: Create edit modal similar to create form
  }

  deleteProduct(product: Product) {
    if (!confirm(`Are you sure you want to delete "${product.name}"?`)) {
      return;
    }

    if (product.isAuction && product.bids && product.bids.length > 0) {
      alert('Cannot delete auction with existing bids');
      return;
    }

    this.productService.deleteProduct(product._id!).subscribe({
      next: (response) => {
        this.notificationService.addNotification('Product deleted successfully');
        this.loadMyProducts(); // Reload list
      },
      error: (error) => {
        console.error('Error deleting product:', error);
        this.notificationService.addNotification(error.error?.message || 'Failed to delete product');
      }
    });
  }

  cancelCreate() {
    this.showCreateForm = false;
    this.resetForm();
  }

  resetForm() {
    this.newProduct = {
      name: '',
      description: '',
      category: '',
      rarity: '',
      condition: 'Good',
      price: 0,
      isAuction: false,
      auctionDuration: 7,
      reservePrice: null,
      imageUrl: ''
    };
    this.errorMessage = '';
  }

  getProductImage(product: Product): string {
    if (product.images && product.images.length > 0) {
      return product.images[0];
    }
    return 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=400';
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-600';
      case 'sold':
        return 'bg-blue-100 text-blue-600';
      case 'expired':
        return 'bg-gray-100 text-gray-600';
      case 'removed':
        return 'bg-red-100 text-red-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  }
}
