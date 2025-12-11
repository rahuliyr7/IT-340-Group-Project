// Track search if there's a search query and user is logged in as buyer
const shouldTrackSearch = !!(
  this.searchQuery && 
  this.searchQuery.trim().length > 0 && 
  this.currentUser && 
  this.currentUser.accountType === 'buyer'
);

this.isLoading = true;
this.productService.getAllProducts(filters, shouldTrackSearch).subscribe({
  next: (response) => {
    this.filteredProducts = response.products;
    this.isLoading = false;
    
    // Log search tracking
    if (shouldTrackSearch) {
      console.log('Search tracked:', this.searchQuery);
    }
  },
  error: (error) => {
    console.error('Error filtering products:', error);
    this.isLoading = false;
  }
});
