function paymentsController() {
    return {
        config: {bank: 'Techcombank', account: '19030858434030', name: 'DOAN QUANG KIEN', syntax: 'ORD{order_id}', enabled: true},
        saveConfig() { alert('Đã lưu cấu hình thanh toán!'); }
    }
}
