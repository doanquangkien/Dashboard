function productsController() {
    return {
        categories: [
            {id: 1, name: 'Giải trí', products: [{id: 101, name: 'Netflix Premium', price: 69000}]},
            {id: 2, name: 'Phần mềm', products: []}
        ],
        searchQuery: '',

        init() { console.log('Products loaded'); },

        get filteredCategories() {
            if (!this.searchQuery) return this.categories;
            // Filter logic simple
            return this.categories; 
        }
    }
}
