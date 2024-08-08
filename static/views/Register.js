
const RegisterView = Vue.component('RegisterView', {
    template: `
        <div class="d-flex justify-content-center align-items-start min-vh-100 bg-light">
            <div class="card shadow-lg p-4 rounded mt-5" style="width: 100%; max-width: 400px;">
                <div class="card-body">
                    <h3 class="card-title text-center mb-4">Register</h3>
                    <form @submit.prevent="register">
                        <div class="mb-3">
                            <label for="username" class="form-label">Username</label>
                            <input type="text" v-model="username" class="form-control" id="username" placeholder="Enter your username" required>
                        </div>
                        <div class="mb-3">
                            <label for="email" class="form-label">Email</label>
                            <input type="email" v-model="email" class="form-control" id="email" placeholder="Enter your email" required>
                        </div>
                        <div class="mb-3">
                            <label for="password" class="form-label">Password</label>
                            <input type="password" v-model="password" class="form-control" id="password" placeholder="Enter your password" required>
                        </div>
                        <button type="submit" class="btn btn-primary w-100">Register</button>
                    </form>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            username: '',
            email: '',
            password: ''
        };
    },
    methods: {
        register() {
            fetch('/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: this.username,
                    email: this.email,
                    password: this.password
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    alert(data.error);
                } else {
                    alert(data.message);
                    this.$router.push('/login');
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }
    }
});

export default RegisterView;
