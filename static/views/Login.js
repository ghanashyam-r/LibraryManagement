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
            // Implement login functionality here
            console.log('Login clicked');
            console.log('Username:', this.username);
    }
}    
});

export default LoginView;
