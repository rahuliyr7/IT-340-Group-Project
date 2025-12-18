import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private API_URL = 'http://192.168.10.20:3000/api/products';
  private HISTORY_URL = 'http://192.168.10.20:3000/api/history';  // ADD THIS
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
  }, trackSearch: boolean = false): Observable<any> {  // ADD trackSearch parameter
    let params = new HttpParams();
    
    if (filters?.category) params = params.set('category', filters.category);
    if (filters?.rarity) params = params.set('rarity', filters.rarity);
    if (filters?.search) params = params.set('search', filters.search);
    if (filters?.sortBy) params = params.set('sortBy', filters.sortBy);

    return this.http.get<any>(`${this.API_URL}`, { params })  // FIXED: Was using backticks wrong
      .pipe(
        map(response => {
          this.productsSubject.next(response.products);
          return response;
        }),
        tap(response => {
          // Track search if requested and has search query
          if (trackSearch && filters?.search && filters.search.trim()) {
            this.saveSearch(filters.search, filters, response.count).subscribe({
              next: () => console.log('Search tracked'),
              error: (err) => console.log('Search tracking failed (user might not be logged in)')
            });
          }
        })
      );
  }
  // NEW: Get categories (from Product enum)
getCategories(): Observable<{ message: string; categories: string[] }> {
  return this.http.get<{ message: string; categories: string[] }>(`${this.API_URL}/categories`);
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
    return this.http.get<any>(`${this.API_URL}/${id}`);  // FIXED: Was using backticks wrong
  }

  // Create new product (Sellers only)
  createProduct(productData: any): Observable<any> {
    return this.http.post<any>(this.API_URL, productData);
  }

  // Get seller's products (Sellers only)
  getMyProducts(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/seller/my-products`);  // FIXED: Was using backticks wrong
  }

  // Update product (Sellers only)
  updateProduct(id: string, productData: any): Observable<any> {
    return this.http.put<any>(`${this.API_URL}/${id}`, productData);  // FIXED: Was using backticks wrong
  }

  // Delete product (Sellers only)
  deleteProduct(id: string): Observable<any> {
    return this.http.delete<any>(`${this.API_URL}/${id}`);  // FIXED: Was using backticks wrong
  }

  // Purchase product (Buyers only)
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

  // ==================== HISTORY METHODS ====================

  // Save search to history
  saveSearch(searchQuery: string, filters: any, resultsCount: number): Observable<any> {
    return this.http.post<any>(`${this.HISTORY_URL}/searches`, {
      searchQuery,
      filters,
      resultsCount
    });
  }

  // Get search history
  getSearchHistory(): Observable<any> {
    return this.http.get<any>(`${this.HISTORY_URL}/searches`);
  }

  // Clear search history
  clearSearchHistory(): Observable<any> {
    return this.http.delete<any>(`${this.HISTORY_URL}/searches`);
  }

  // Get order history
  getOrderHistory(): Observable<any> {
    return this.http.get<any>(`${this.HISTORY_URL}/orders`);
  }

  // Get order by ID
  getOrderById(orderId: string): Observable<any> {
    return this.http.get<any>(`${this.HISTORY_URL}/orders/${orderId}`);
  }

  // =========================================================

  // Get products from current state
  getProducts(): Product[] {
    return this.productsSubject.value;
  }
}
