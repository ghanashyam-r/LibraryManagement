const LoginView = Vue.component('LoginView', {
    template: `
        <div class="d-flex justify-content-center align-items-start min-vh-100 bg-light">
            <div class="card shadow-lg p-4 rounded mt-5" style="width: 100%; max-width: 400px;">
                <div class="card-body">
                    <h3 class="card-title text-center mb-4">Login</h3>
                    <form @submit.prevent="login">
                        <div class="mb-3">
                            <label for="username" class="form-label">Username</label>
                            <input type="text" v-model="username" class="form-control" id="username" placeholder="Enter your username" required>
                        </div>
                        <div class="mb-3">
                            <label for="password" class="form-label">Password</label>
                            <input type="password" v-model="password" class="form-control" id="password" placeholder="Enter your password" required>
                        </div>
                        <button type="submit" class="btn btn-primary w-100">Login</button>
                    </form>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            username: '',
            password: ''
        };
    },
    methods: {
        login() {
            fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: this.username,
                    password: this.password
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.msg === "login successful") {
                    localStorage.setItem('access_token', data.access_token);
                    localStorage.setItem('user_role', data.role);

                    if (data.role === 'admin') {
                        this.$router.push('/librariandashboard');
                    } else {
                        this.$router.push('/userdashboard');
                    }
                } else {
                    alert(data.msg);
                }
            })
            .catch(error => {
                console.error('Login Error:', error);
            });
        }
    }
});

export default LoginView;


