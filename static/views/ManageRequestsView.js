const ManageRequestsView = Vue.component('ManageRequestsView', {
    template: `
        <div class="container">
            <h2 class="mt-5">Manage Requests</h2>
            <div v-if="requests.length">
                <table class="table">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Book</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="request in requests" :key="request.id">
                            <td>{{ request.user }}</td>
                            <td>{{ request.book }}</td>
                            <td>{{ request.status }}</td>
                            <td>
                                <button v-if="request.status === 'requested'" @click="approveRequest(request.id)" class="btn btn-success">Approve</button>
                                <button v-if="request.status === 'approved'" @click="revokeRequest(request.id)" class="btn btn-danger">Revoke</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div v-else>
                <p>No requests found.</p>
            </div>
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
                this.requests = data;
            })
            .catch(error => {
                console.error('Fetch Error:', error);
            });
        },
        approveRequest(requestId) {
            fetch(`/requests/${requestId}/approve`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getToken()}`
                }
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                this.fetchRequests();
            })
            .catch(error => {
                console.error('Approve Error:', error);
            });
        },
        revokeRequest(requestId) {
            fetch(`/requests/${requestId}/revoke`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getToken()}`
                }
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                this.fetchRequests();
            })
            .catch(error => {
                console.error('Revoke Error:', error);
            });
        },
        getToken() {
            return localStorage.getItem('access_token'); // Adjust if using cookies
        }
    }
});

export default ManageRequestsView;
