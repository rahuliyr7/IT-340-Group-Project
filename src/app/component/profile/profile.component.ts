import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 py-12">
      <h2 class="text-3xl font-bold mb-8">My Profile</h2>
      
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="text-center mb-6">
            <div class="bg-blue-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
            </div>
            <h3 class="text-xl font-bold">John Collector</h3>
            <p class="text-gray-600">Member since 2024</p>
          </div>
          <div class="space-y-3">
            <button class="w-full text-left px-4 py-2 rounded hover:bg-gray-100 transition">Account Settings</button>
            <button class="w-full text-left px-4 py-2 rounded hover:bg-gray-100 transition">My Listings</button>
            <button class="w-full text-left px-4 py-2 rounded hover:bg-gray-100 transition">Payment Methods</button>
            <button class="w-full text-left px-4 py-2 rounded hover:bg-gray-100 transition">Shipping Addresses</button>
          </div>
        </div>
        
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-xl font-bold mb-4">Order History</h3>
            <p class="text-gray-600 text-center py-8">No orders yet</p>
          </div>
          
          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-xl font-bold mb-4">Search History</h3>
            <div *ngIf="searchHistory.length === 0" class="text-gray-600 text-center py-8">
              No search history
            </div>
            <div *ngIf="searchHistory.length > 0" class="flex flex-wrap gap-2">
              <button *ngFor="let query of searchHistory" 
                class="px-3 py-1 bg-gray-100 rounded-full text-sm hover:bg-gray-200 transition">
                {{query}}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProfileComponent implements OnInit {
  searchHistory: string[] = [];

  constructor(private searchService: SearchService) {}

  ngOnInit() {
    this.searchService.searchHistory$.subscribe(history => {
      this.searchHistory = history;
    });
  }
}