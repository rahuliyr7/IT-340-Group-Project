// search.component.ts
availableTags = ['collectibles', 'rare', 'vintage', 'electronics']; // Or fetch from API
selectedTags: string[] = [];
searchTerm = '';

search() {
  let params = new HttpParams();
  if (this.searchTerm) params = params.set('search', this.searchTerm);
  if (this.selectedTags.length) params = params.set('tags', this.selectedTags.join(','));

  this.http.get('/api/products', { params }).subscribe((products: any) => {
    this.products = products;
  });
}

updateTags(event: any) {
  if (event.target.checked) {
    this.selectedTags.push(event.target.value);
  } else {
    this.selectedTags = this.selectedTags.filter(t => t !== event.target.value);
  }
}
