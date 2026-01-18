document.addEventListener('alpine:init', () => {

    
    // --- THÊM MỚI: AUTH STORE ---
    Alpine.store('auth', {
        // Kiểm tra xem trong bộ nhớ có token chưa
        isLoggedIn: !!localStorage.getItem('admin_token'),

        logout() {
            if(confirm('Bạn chắc chắn muốn đăng xuất?')) {
                localStorage.removeItem('admin_token');
                this.isLoggedIn = false;
                // Reset lại trang về Home để tránh lỗi view cũ
                Alpine.store('app').setTab('home'); 
            }
        }
    });


    // APP STORE: Quản lý Tab và Sidebar
    Alpine.store('app', {
        sidebarOpen: false,
        currentTab: 'home',
        isLoading: false,

        toggleSidebar() {
            this.sidebarOpen = !this.sidebarOpen;
        },

        async setTab(tab) {
            this.currentTab = tab;
            this.sidebarOpen = false;
            this.isLoading = true;

            try {
                const response = await fetch(`views/${tab}.html`);
                if (!response.ok) throw new Error(`View ${tab} not found`);
                
                const html = await response.text();
                const container = document.getElementById('main-view');
                
                // Inject HTML và khởi động lại Alpine cho vùng mới
                container.innerHTML = html;
                
                // Quan trọng: Đợi DOM cập nhật xong mới init logic mới
                requestAnimationFrame(() => {
                    Alpine.initTree(container);
                });

            } catch (error) {
                console.error(error);
                document.getElementById('main-view').innerHTML = `<div class="p-10 text-center text-red-500">Lỗi tải trang: ${tab}</div>`;
            } finally {
                setTimeout(() => this.isLoading = false, 200);
            }
        },

        init() {
            this.setTab('home');
        }
    });

    // MODAL STORE: Quản lý Popup
    Alpine.store('modal', {
        isOpen: false,
        type: '',
        title: '',
        data: {},

        open(type, data = {}) {
            this.type = type;
            this.data = data; // Dữ liệu truyền vào (ví dụ: thông tin user cần sửa)
            this.title = this.getModalTitle(type);
            this.isOpen = true;
        },

        close() {
            this.isOpen = false;
            this.data = {};
        },

        save() {
            // Demo save action
            alert('Đã lưu dữ liệu! (Logic backend sẽ nằm ở đây)');
            this.close();
        },

        getModalTitle(type) {
            const titles = {
                addProduct: 'Thêm sản phẩm mới',
                editProduct: 'Sửa sản phẩm',
                addCategory: 'Thêm danh mục',
                addVariant: 'Thêm biến thể',
                addCoupon: 'Tạo mã giảm giá',
                editCoupon: 'Sửa mã giảm giá',
                delivery: 'Gửi hàng thủ công',
                viewLog: 'Xem chi tiết log',
            };
            return titles[type] || 'Modal';
        }
    });
});