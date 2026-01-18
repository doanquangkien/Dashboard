function productsController() {
    return {
        view: 'manage', // 'manage' | 'editor'
        currentTab: 'all',
        searchQuery: '',
        
        // UI Helpers
        showUrlInput: false,
        tempImageUrl: '',
        isCreatingCollection: false,
        newCollectionName: '',
        
        // DATA
        collections: [],
        products: [],

        defaultCollections: [
            { id: 1, name: 'Tài khoản giải trí' },
            { id: 2, name: 'Phần mềm làm việc' },
            { id: 3, name: 'Sản phẩm bán chạy' }
        ],
        
        formData: {},

        init() {
            const storedProducts = localStorage.getItem('admin_products');
            const storedCollections = localStorage.getItem('admin_collections');

            if (storedProducts) this.products = JSON.parse(storedProducts);
            else this.products = [];

            if (storedCollections) {
                this.collections = JSON.parse(storedCollections);
            } else {
                this.collections = this.defaultCollections;
                this.persistData();
            }
            
            console.log('System Ready: Variants & Collections Fixed');
        },

        persistData() {
            localStorage.setItem('admin_products', JSON.stringify(this.products));
            localStorage.setItem('admin_collections', JSON.stringify(this.collections));
        },

        // --- COMPUTED ---
        get filteredProducts() {
            return this.products.filter(p => {
                if (this.currentTab === 'active' && p.status !== 'active') return false;
                if (this.currentTab === 'draft' && p.status !== 'draft') return false;
                
                const term = this.searchQuery.toLowerCase();
                const matchName = p.title.toLowerCase().includes(term);
                return matchName;
            });
        },

        getCollectionName(id) {
            const col = this.collections.find(c => c.id === id);
            return col ? col.name : 'Unknown';
        },

        // --- ACTIONS: PRODUCT ---
        openEditor(product = null) {
            this.showUrlInput = false;
            this.isCreatingCollection = false;

            if (product) {
                this.formData = JSON.parse(JSON.stringify(product));
            } else {
                this.formData = {
                    id: null,
                    title: '',
                    desc: '',
                    status: 'active',
                    images: [],
                    price: 0,
                    compare_price: 0,
                    cost: 0,
                    stock: 0,
                    collection_ids: [],
                    has_variants: false,
                    variants: []
                };
            }
            this.view = 'editor';
            window.scrollTo({ top: 0, behavior: 'smooth' });
        },

        saveProduct() {
            if (!this.formData.title) return alert('Vui lòng nhập tên sản phẩm');

            if (this.formData.id) {
                const idx = this.products.findIndex(p => p.id === this.formData.id);
                if (idx !== -1) this.products[idx] = {...this.formData};
            } else {
                this.formData.id = Date.now();
                this.products.unshift({...this.formData});
            }
            
            this.persistData();
            alert('Đã lưu sản phẩm!');
            this.view = 'manage';
        },

        deleteProduct(id) {
            if(confirm('Xóa vĩnh viễn sản phẩm này?')) {
                this.products = this.products.filter(p => p.id !== id);
                this.persistData();
                if(this.view === 'editor') this.view = 'manage';
            }
        },

        // --- ACTIONS: COLLECTION (ĐÃ SỬA) ---
        createCollection() {
            if(!this.newCollectionName.trim()) return;
            const newId = Date.now();
            this.collections.push({ id: newId, name: this.newCollectionName });
            this.formData.collection_ids.push(newId);
            this.persistData();
            this.newCollectionName = '';
            this.isCreatingCollection = false;
        },

        deleteCollection(id) {
            // Popup xác nhận (Native)
            if(confirm('Bạn có chắc muốn xóa bộ sưu tập này? (Sản phẩm bên trong sẽ không bị xóa)')) {
                this.collections = this.collections.filter(c => c.id !== id);
                
                // (Tùy chọn) Xóa ID này khỏi các sản phẩm đang gắn nó
                this.products.forEach(p => {
                    p.collection_ids = p.collection_ids.filter(cid => cid !== id);
                });
                // Xóa khỏi form hiện tại nếu đang tick
                if(this.formData.collection_ids) {
                     this.formData.collection_ids = this.formData.collection_ids.filter(cid => cid !== id);
                }

                this.persistData();
            }
        },

        // --- HELPER: IMAGES ---
        toggleUrlInput() {
            this.showUrlInput = !this.showUrlInput;
            if(this.showUrlInput) setTimeout(() => document.getElementById('urlInputRef').focus(), 100);
        },
        addImageFromUrl() {
            if(!this.tempImageUrl) return;
            this.formData.images.push(this.tempImageUrl);
            this.tempImageUrl = '';
            this.showUrlInput = false;
        },
        handleImageUpload(e) {
            const files = e.target.files;
            if(!files.length) return;
            Array.from(files).forEach(file => {
                const reader = new FileReader();
                reader.onload = (ev) => this.formData.images.push(ev.target.result);
                reader.readAsDataURL(file);
            });
            e.target.value = '';
        },
        removeImage(index) {
            this.formData.images.splice(index, 1);
        },

        // --- HELPER: VARIANTS (ĐÃ SỬA) ---
        toggleVariants() {
            this.formData.has_variants = !this.formData.has_variants;
            if(this.formData.has_variants && this.formData.variants.length === 0) {
                this.addVariant();
            }
        },
        addVariant() {
            this.formData.variants.push({ 
                id: Date.now() + Math.random(), // Random ID để tránh trùng key
                title: '', 
                price: this.formData.price || 0, 
                stock: 10 
            });
        },
        removeVariant(index) {
            this.formData.variants.splice(index, 1);
            if(this.formData.variants.length === 0) this.formData.has_variants = false;
        },

        // Misc
        cancelEditor() {
            if(confirm('Hủy bỏ thay đổi?')) {
                this.view = 'manage';
                this.formData = {};
            }
        },
        toggleCollection(id) {
            const index = this.formData.collection_ids.indexOf(id);
            if (index === -1) this.formData.collection_ids.push(id);
            else this.formData.collection_ids.splice(index, 1);
        },
        formatMoney(amount) {
            return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
        }
    }
}