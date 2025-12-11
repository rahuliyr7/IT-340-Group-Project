import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private API_URL = 'http://192.168.10.20:3000/api/products';
  private productsSubject = new BehaviorSubject<Product[]>([]);
  public products$ = this.productsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadProducts();
  }

  // Get all products with filters
  getAllProducts(filters?: {
    category?: string;
    rarity?: string;
    search?: string;
    sortBy?: string;
  }): Observable<any> {
    let params = new HttpParams();
    
    if (filters?.category) params = params.set('category', filters.category);
    if (filters?.rarity) params = params.set('rarity', filters.rarity);
    if (filters?.search) params = params.set('search', filters.search);
    if (filters?.sortBy) params = params.set('sortBy', filters.sortBy);

    return this.http.get<any>(`${this.API_URL}`, { params })
      .pipe(map(response => {
        this.productsSubject.next(response.products);
        return response;
      }));
  }

  // Load products into state
  loadProducts() {
    this.getAllProducts().subscribe({
      next: (response) => {
        console.log('Products loaded:', response.count);
      },
      error: (error) => {
        console.error('Error loading products:', error);
      }
    });
  }

  // Get single product by ID
  getProductById(id: string): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/${id}`);
  }

  // Create new product (Sellers only)
  createProduct(productData: any): Observable<any> {
    return this.http.post<any>(this.API_URL, productData);
  }

  // Get seller's products (Sellers only)
  getMyProducts(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/seller/my-products`);
  }

  // Update product (Sellers only)
  updateProduct(id: string, productData: any): Observable<any> {
    return this.http.put<any>(`${this.API_URL}/${id}`, productData);
  }

  // Delete product (Sellers only)
  deleteProduct(id: string): Observable<any> {
    return this.http.delete<any>(`${this.API_URL}/${id}`);
  }

  purchaseProduct(id: string): Observable<any> {
  const token = localStorage.getItem('token');
  console.log('🛒 Purchase - Token:', token ? 'exists' : 'missing');
  
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  });
  
  return this.http.post<any>(
    `${this.API_URL}/${id}/purchase`, 
    {}, 
    { headers }
  );
}

  // Place bid on auction (Buyers only)
placeBid(id: string, amount: number): Observable<any> {
  const token = localStorage.getItem('token');
  console.log('💰 Bid - Token:', token ? 'exists' : 'missing');
  
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  });
  
  return this.http.post<any>(
    `${this.API_URL}/${id}/bid`, 
    { amount }, 
    { headers }
  );
}

  // Get products from current state
  getProducts(): Product[] {
    return this.productsSubject.value;
  }
}
