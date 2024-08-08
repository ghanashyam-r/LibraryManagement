const HomeView = Vue.component('HomeView', {
    template: `
        <div class="home-container">
            <div class="background-image"></div>
            <div class="content-overlay">
                <div class="jumbotron text-center">
                    <h1 class="display-4">Welcome to the Ghanashyam's E Library!</h1>
                    <p class="lead">Login or Register to enter into the magical world of books!</p>
                    <hr class="my-4">
                    <div class="d-flex justify-content-center mt-4">
                        <router-link to="/login" class="btn btn-primary btn-lg mx-2">Login</router-link>
                        <router-link to="/register" class="btn btn-secondary btn-lg mx-2">Register</router-link>
                    </div>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            
        };
    },
    methods: {
        
    }
});

export default HomeView;
