function dashboardController() {
    return {
        // Data KPI
        revenue: 0,
        revenuePeriod: 'day', // day | week | month
        pendingCount: 0,
        shippingCount: 0,
        lowStockCount: 0,
        visitorCount: 0,
        
        // Data Lists
        urgentTasks: [],
        topProducts: [],
        
        // Chart Instance
        chartInstance: null,

        init() {
            console.log('Dashboard Init');
            
            // 1. Load KPI cơ bản
            this.pendingCount = 3;
            this.shippingCount = 12;
            this.lowStockCount = 5;
            this.visitorCount = 450;
            
            // 2. Load Task & Top Products
            this.urgentTasks = [
                { id: 'ORD-9981', email: 'khach@gmail.com', total: 250000, status: 'pending', time: '10p trước' },
                { id: 'ORD-9985', email: 'tuan@test.com', total: 69000, status: 'pending', time: '30p trước' }
            ];

            this.topProducts = [
                { name: 'Netflix Premium', sales: 150, revenue: 12500000, image: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg' },
                { name: 'Spotify 1 Năm', sales: 89, revenue: 4500000, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/2048px-Spotify_logo_without_text.svg.png' },
                { name: 'Youtube Premium', sales: 45, revenue: 1200000, image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/YouTube_full-color_icon_%282017%29.svg/1024px-YouTube_full-color_icon_%282017%29.svg.png' },
            ];

            // 3. Khởi tạo dữ liệu ban đầu & Vẽ biểu đồ
            // Dùng setTimeout để đảm bảo HTML Canvas đã render xong
            setTimeout(() => {
                this.updateRevenue();
            }, 100);
        },

        updateRevenue() {
            // Mock Data cho Chart và KPI
            let chartLabels = [];
            let chartData = [];
            let totalRev = 0;

            if (this.revenuePeriod === 'day') {
                totalRev = 1200000;
                chartLabels = ['0h', '4h', '8h', '12h', '16h', '20h', '24h'];
                chartData = [50, 100, 450, 1200, 900, 1500, 1000]; // Doanh thu theo giờ (nghìn đồng)
            } else if (this.revenuePeriod === 'week') {
                totalRev = 8500000;
                chartLabels = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
                chartData = [1200, 1500, 800, 2000, 1800, 3000, 2500];
            } else if (this.revenuePeriod === 'month') {
                totalRev = 35000000;
                chartLabels = ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4'];
                chartData = [8000, 12000, 9500, 15000];
            }

            // Update số hiển thị
            this.revenue = totalRev;

            // Update Chart
            this.renderChart(chartLabels, chartData);
        },

        renderChart(labels, data) {
            const ctx = document.getElementById('revenueChart');
            if (!ctx) return;

            // Hủy biểu đồ cũ nếu có để vẽ cái mới
            if (this.chartInstance) {
                this.chartInstance.destroy();
            }

            this.chartInstance = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Doanh thu (nghìn đ)',
                        data: data,
                        borderColor: '#3b82f6', // Blue-500
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        borderWidth: 2,
                        tension: 0.4, // Đường cong mềm mại
                        fill: true,
                        pointBackgroundColor: '#ffffff',
                        pointBorderColor: '#3b82f6',
                        pointRadius: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false } // Ẩn chú thích cho gọn
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: { borderDash: [5, 5] }
                        },
                        x: {
                            grid: { display: false }
                        }
                    }
                }
            });
        }
    }
}