import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class WatchlistService {
  private watchlistSubject = new BehaviorSubject<Product[]>([]);
  watchlist$ = this.watchlistSubject.asObservable();

  toggleWatchlist(product: Product) {
    const currentList = this.watchlistSubject.value;
    const exists = currentList.find(item => item.id === product.id);
    
    if (exists) {
      this.watchlistSubject.next(currentList.filter(item => item.id !== product.id));
      return false;
    } else {
      this.watchlistSubject.next([...currentList, product]);
      return true;
    }
  }

  isInWatchlist(productId: number) {
    return this.watchlistSubject.value.some(item => item.id === productId);
  }

  getWatchlist() {
    return this.watchlistSubject.value;
  }
}