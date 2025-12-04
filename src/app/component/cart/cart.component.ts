import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 py-12">
      <h2 class="text-3xl font-bold mb-8">Shopping Cart</h2>
      
      <div *ngIf="cartItems.length === 0" class="text-center py-12">
        <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
        </svg>
        <p class="text-xl text-gray-600">Your cart is empty</p>
        <button class="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
          Continue Shopping
        </button>
      </div>

      <!-- REMOVED THE CORRUPTED LINE HERE -->

      <div *ngIf="cartItems.length > 0" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-4">
          <div *ngFor="let item of cartItems" class="bg-white rounded-lg shadow-md p-4 flex items-center space-x-4">
            <img [src]="item.image" [alt]="item.name" class="w-24 h-24 object-cover rounded" />
            <div class="flex-1">
              <h3 class="font-semibold text-lg">{{item.name}}</h3>
              <p class="text-gray-600">{{item.category}}</p>
              <p class="text-xl font-bold text-blue-600 mt-2">\${{item.price}}</p>
            </div>
            <button (click)="removeFromCart(item.id)" class="text-red-500 hover:text-red-700 transition">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>
        
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h3 class="text-xl font-bold mb-4">Order Summary</h3>
            <div class="space-y-2 mb-4">
              <div class="flex justify-between">
                <span>Subtotal</span>
                <span>\${{total}}</span>
              </div>
              <div class="flex justify-between">
                <span>Shipping</span>
                <span>\$15</span>
              </div>
              <div class="flex justify-between">
                <span>Tax</span>
                <span>\${{(total * 0.08).toFixed(2)}}</span>
              </div>
              <div class="border-t pt-2 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>\${{(total + 15 + total * 0.08).toFixed(2)}}</span>
              </div>
            </div>
            <button class="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition mb-2">
              Checkout
            </button>
            <button class="w-full bg-yellow-500 text-white py-3 rounded-lg font-semibold hover:bg-yellow-600 transition flex items-center justify-center">
              <span class="mr-2">Pay with</span>
              <span class="font-bold">PayPal</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CartComponent implements OnInit {
  cartItems: Product[] = [];
  total = 0;

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.total = this.cartService.getCartTotal();
    });
  }

  removeFromCart(productId: number) {
    this.cartService.removeFromCart(productId);
  }
}