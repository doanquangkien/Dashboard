function dashboardController() {
    return {
        revenue: '1.2tr',
        pendingCount: 0,
        shippingCount: 0,
        lowStockCount: 5,
        urgentTasks: [],

        init() {
            // Mock Data
            this.pendingCount = 1;
            this.shippingCount = 0;
            this.urgentTasks = [
                { id: 'ORD-9981', email: 'khachhang@gmail.com', total: 250000, status: 'pending' }
            ];
        }
    }
}
