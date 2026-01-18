function authController() {
    return {
        email: '',
        password: '',
        error: '',
        loading: false,

        login() {
            this.loading = true;
            this.error = '';

            setTimeout(() => {
                // Tài khoản Demo: admin@mecwish.com / 123456
                if (this.email === 'admin@mecwish.com' && this.password === '123456') {
                    
                    localStorage.setItem('admin_token', 'mecwish_secret_token_123');
                    Alpine.store('auth').isLoggedIn = true;
                    
                    console.log('Login success');

                    // --- SỬA LỖI TẠI ĐÂY ---
                    // Đợi 50ms để HTML Dashboard hiển thị xong, rồi mới load nội dung Home
                    setTimeout(() => {
                        Alpine.store('app').setTab('home');
                    }, 50);

                } else {
                    this.error = 'Email hoặc mật khẩu không đúng!';
                }
                this.loading = false;
            }, 800);
        }
    }
}