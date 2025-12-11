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
    const productId = product._id || product.id;
    const exists = currentList.find(item => (item._id || item.id) === productId);
    
    if (exists) {
      this.watchlistSubject.next(currentList.filter(item => 
        (item._id || item.id) !== productId
      ));
      return false;
    } else {
      this.watchlistSubject.next([...currentList, product]);
      return true;
    }
  }

  isInWatchlist(productId: string | number): boolean {
    return this.watchlistSubject.value.some(item => 
      (item._id || item.id)?.toString() === productId?.toString()
    );
  }

  getWatchlist() {
    return this.watchlistSubject.value;
  }
}
