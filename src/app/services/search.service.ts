import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private searchHistorySubject = new BehaviorSubject<string[]>([]);
  searchHistory$ = this.searchHistorySubject.asObservable();

  // Add this for live search triggering
  private searchTriggerSubject = new BehaviorSubject<string>('');
  searchTrigger$ = this.searchTriggerSubject.asObservable();

  addToHistory(query: string) {
    if (query && query.trim()) {
      const current = this.searchHistorySubject.value;
      if (!current.includes(query)) {
        this.searchHistorySubject.next([query, ...current].slice(0, 10));
      }
    }
  }

  getHistory() {
    return this.searchHistorySubject.value;
  }

  // Trigger a search from anywhere in the app
  triggerSearch(query: string) {
    console.log('SearchService: Triggering search for:', query);
    this.searchTriggerSubject.next(query);
  }

  // Get current search trigger value
  getCurrentSearch() {
    return this.searchTriggerSubject.value;
  }
}
