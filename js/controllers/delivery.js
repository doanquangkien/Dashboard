function deliveryController() {
    return {
        templates: [{name: 'Netflix', content: 'User: {user}\nPass: {pass}'}],
        send() { alert('Đã gửi hàng thành công (Demo)'); }
    }
}