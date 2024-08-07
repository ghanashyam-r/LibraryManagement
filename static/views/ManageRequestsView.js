const ManageRequestsView = Vue.component('ManageRequestsView', {
    template: `
        <div class="container">
            <h2 class="mt-5">Manage User Requests</h2>
            <!-- Add your code to manage user requests here -->
            <ul class="list-group mt-4">
                <li v-for="request in requests" :key="request.id" class="list-group-item">
                    {{ request.details }}
                </li>
            </ul>
        </div>
    `,
    data() {
        return {
            requests: []
        };
    },
    created() {
        this.fetchRequests();
    },
    methods: {
        fetchRequests() {
            fetch('/requests', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getToken()}`
                }
            })
            .then(response => response.json())
            .then(data => {
                this.requests = Array.isArray(data) ? data : [];
            })
            .catch(error => console.error('Error:', error));
        },
        getToken() {
            return localStorage.getItem('access_token');
        }
    }
});

export default ManageRequestsView;

