function ordersController() {
    return {
        currentOrderTab: 'all',
        searchQuery: '',
        orders: [
            {id: 'ORD-9981', time: '2 phút trước', product: 'Spotify Premium 1 Năm', email: 'khachhang@gmail.com', total: 250000, status: 'pending', content: 'ORD9981', phone: '0123456789'},
        ],

        get filteredOrders() {
            return this.orders.filter(o => {
                const matchTab = this.currentOrderTab === 'all' || o.status === this.currentOrderTab;
                const matchSearch = o.id.toLowerCase().includes(this.searchQuery.toLowerCase()) || o.email.includes(this.searchQuery);
                return matchTab && matchSearch;
            });
        },
        
        statusLabel(status) {
            const map = { pending: 'Chờ thanh toán', paid: 'Đã thanh toán', shipping: 'Đang giao', completed: 'Hoàn thành', cancelled: 'Hủy' };
            return map[status] || status;
        },
        statusClass(status) {
            const map = { pending: 'bg-yellow-100 text-yellow-800', paid: 'bg-blue-100 text-blue-800', shipping: 'bg-orange-100 text-orange-800', completed: 'bg-green-100 text-green-800', cancelled: 'bg-red-100 text-red-800' };
            return map[status] || 'bg-gray-100';
        }
    }
}
