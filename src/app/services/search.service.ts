import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private searchHistorySubject = new BehaviorSubject<string[]>([]);
  searchHistory$ = this.searchHistorySubject.asObservable();

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
}