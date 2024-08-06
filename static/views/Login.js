const LoginView = Vue.component('LoginView', {
    template: `
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-md-6">
                    <div class="card mt-5">
                        <div class="card-body">
                            <h3 class="card-title text-center">Login</h3>
                            <form @submit.prevent="login">
                                <div class="mb-3">
                                    <label for="username" class="form-label">Username</label>
                                    <input type="text" v-model="username" class="form-control" id="username" required>
                                </div>
                                <div class="mb-3">
                                    <label for="password" class="form-label">Password</label>
                                    <input type="password" v-model="password" class="form-control" id="password" required>
                                </div>
                                <button type="submit" class="btn btn-primary w-100">Login</button>
                            </form>
                        </div>
                    </div>
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
                    // Save the token and user role to localStorage
                    localStorage.setItem('access_token', data.access_token); // Ensure your backend returns this token
                    localStorage.setItem('user_role', data.role); // Save the role for future use

                    // Redirect based on role
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

