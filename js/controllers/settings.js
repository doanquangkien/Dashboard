function settingsController() {
    return {
        settings: {autoCancel: false, lowStockAlert: true, autoCheckBank: false, autoDelivery: false},
        save() { alert('Đã lưu cấu hình!'); }
    }
}