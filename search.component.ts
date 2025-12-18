// search.component.ts
categories: string[] = [];
selectedCategory = '';
availableTags = ['collectibles', 'rare', 'vintage', 'electronics']; // Or fetch from API
selectedTags: string[] = [];
searchTerm = '';

search() {
  let params = new HttpParams();
  if (this.searchTerm) params = params.set('search', this.searchTerm);
  if (this.selectedTags.length) params = params.set('tags', this.selectedTags.join(','));
  if (this.selectedCategory) params = params.set('category', this.selectedCategory);


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
loadCategories() {
  this.productService.getCategories().subscribe({
    next: (res: any) => {
      this.categories = res.categories;
    },
    error: err => console.error('Failed to load categories', err)
  });
}
ngOnInit() {
  this.loadCategories();
}
setCategory(category: string) {
  this.selectedCategory = category;
  this.search();
}


