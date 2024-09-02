export default {
    template: `
    <div class="container mt-5">
    <!-- Navbar -->
            <nav class="navbar navbar-light bg-light mb-4">
                <a class="navbar-brand" href="#">Librarian Dashboard</a>
                <router-link to="/librariandashboard" class="btn btn-primary">Back to Dashboard</router-link>
            </nav>
        <h2 class="text-center mb-4">Admin Dashboard - Statistics</h2>
        <div class="row">
            <!-- Active Users -->
            <div class="col-md-4">
                <div class="card text-white bg-primary mb-3">
                    <div class="card-header">Active Users</div>
                    <div class="card-body">
                        <h5 class="card-title">{{ activeUsers }}</h5>
                    </div>
                </div>
            </div>
            <!-- Grant Requests -->
            <div class="col-md-4">
                <div class="card text-white bg-success mb-3">
                    <div class="card-header">Grant Requests</div>
                    <div class="card-body">
                        <h5 class="card-title">{{ grantRequests }}</h5>
                    </div>
                </div>
            </div>
            <!-- E-books Issued -->
            <div class="col-md-4">
                <div class="card text-white bg-info mb-3">
                    <div class="card-header">E-books Issued</div>
                    <div class="card-body">
                        <h5 class="card-title">{{ booksIssued }}</h5>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <!-- E-books Revoked -->
            <div class="col-md-4">
                <div class="card text-white bg-danger mb-3">
                    <div class="card-header">E-books Revoked</div>
                    <div class="card-body">
                        <h5 class="card-title">{{ booksRevoked }}</h5>
                    </div>
                </div>
            </div>
            <!-- Feedbacks Received -->
            <div class="col-md-4">
                <div class="card text-white bg-warning mb-3">
                    <div class="card-header">Feedbacks Received</div>
                    <div class="card-body">
                        <h5 class="card-title">{{ feedbacksReceived }}</h5>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,
    data() {
        return {
            activeUsers: 0,
            grantRequests: 0,
            booksIssued: 0,
            booksRevoked: 0,
            feedbacksReceived: 0,
        };
    },
    mounted() {
        this.fetchStatistics();
    },
    methods: {
        fetchStatistics() {
            // Fetch statistics from the backend
            fetch('/api/admin/statistics', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            })
            .then(response => response.json())
            .then(data => {
                this.activeUsers = data.activeUsers;
                this.grantRequests = data.grantRequests;
                this.booksIssued = data.booksIssued;
                this.booksRevoked = data.booksRevoked;
                this.feedbacksReceived = data.feedbacksReceived;
            })
            .catch(error => {
                console.error('Error fetching statistics:', error);
            });
        }
    }
};
