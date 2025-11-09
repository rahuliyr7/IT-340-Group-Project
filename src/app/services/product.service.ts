import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsSubject = new BehaviorSubject<Product[]>([
    {
      id: 1,
      name: 'Vintage Baseball Card Collection',
      price: 1250,
      currentBid: 1100,
      auctionEnd: new Date(Date.now() + 86400000 * 2),
      image: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=400',
      category: 'Sports',
      rarity: 'Rare',
      verified: true,
      isAuction: true,
      bids: 23
    },
    {
      id: 2,
      name: 'Limited Edition Comic Book',
      price: 450,
      image: 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=400',
      category: 'Comics',
      rarity: 'Ultra Rare',
      verified: true,
      isAuction: false
    },
    {
      id: 3,
      name: 'Antique Pocket Watch',
      price: 890,
      currentBid: 750,
      auctionEnd: new Date(Date.now() + 86400000),
      image: 'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=400',
      category: 'Watches',
      rarity: 'Rare',
      verified: true,
      isAuction: true,
      bids: 15
    },
    {
      id: 4,
      name: 'Signed Movie Poster',
      price: 320,
      image: 'https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=400',
      category: 'Movies',
      rarity: 'Common',
      verified: true,
      isAuction: false
    },
    {
      id: 5,
      name: 'Rare Vinyl Record',
      price: 680,
      currentBid: 580,
      auctionEnd: new Date(Date.now() + 86400000 * 3),
      image: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=400',
      category: 'Music',
      rarity: 'Rare',
      verified: true,
      isAuction: true,
      bids: 31
    },
    {
      id: 6,
      name: 'Vintage Video Game Console',
      price: 550,
      image: 'https://images.unsplash.com/photo-1486401899868-0e435ed85128?w=400',
      category: 'Gaming',
      rarity: 'Common',
      verified: false,
      isAuction: false
    }
  ]);

  products$ = this.productsSubject.asObservable();

  getProducts() {
    return this.productsSubject.value;
  }

  searchProducts(query: string, filters: string[]) {
    const allProducts = this.productsSubject.value;
    return allProducts.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = filters.length === 0 || filters.includes(product.category);
      return matchesSearch && matchesCategory;
    });
  }
}