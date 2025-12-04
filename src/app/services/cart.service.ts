import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<Product[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();

  addToCart(product: Product) {
    const currentItems = this.cartItemsSubject.value;
    if (!product.isAuction && !currentItems.find(item => item.id === product.id)) {
      this.cartItemsSubject.next([...currentItems, product]);
      return true;
    }
    return false;
  }

  removeFromCart(productId: number) {
    const currentItems = this.cartItemsSubject.value;
    this.cartItemsSubject.next(currentItems.filter(item => item.id !== productId));
  }

  getCartItems() {
    return this.cartItemsSubject.value;
  }

  getCartTotal() {
    return this.cartItemsSubject.value.reduce((sum, item) => sum + item.price, 0);
  }
}