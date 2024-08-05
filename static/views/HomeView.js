const HomeView = Vue.component('HomeView', {
    template: `
        <div class="container">
            <h1 class="mt-5">Welcome to the Library Management System</h1>
            <p class="lead">Manage your library efficiently and effectively.</p>
            <div class="row mt-4">
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Browse Books</h5>
                            <p class="card-text">Explore our vast collection of books across various genres.</p>
                            <a href="#" class="btn btn-primary">Browse</a>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Manage Requests</h5>
                            <p class="card-text">Handle book requests from users efficiently.</p>
                            <a href="#" class="btn btn-primary">Manage</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            // Any data properties you need for this component
        };
    },
    methods: {
        // Any methods you need for this component
    }
});

export default HomeView;
