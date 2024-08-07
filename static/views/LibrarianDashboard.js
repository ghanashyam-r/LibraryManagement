
const LibrarianDashboard = Vue.component('LibrarianDashboard', {
    template: `
        <div class="container">
            <div class="row">
                <div class="col-12">
                    <h2 class="mt-5">Welcome Librarian</h2>
                    <p>Email: {{ user.email }}</p>
                    <div class="list-group mt-4">
                        <router-link to="/manage-sections" class="list-group-item list-group-item-action">
                            Manage Sections
                        </router-link>
                        <router-link to="/manage-books" class="list-group-item list-group-item-action">
                            Manage Books
                        </router-link>
                        <router-link to="/view-statistics" class="list-group-item list-group-item-action">
                            View Statistics
                        </router-link>
                        <router-link to="/manage-requests" class="list-group-item list-group-item-action">
                            View and Manage User Requests
                        </router-link>
                        <router-link to="/" class="list-group-item list-group-item-action" @click.prevent="logout">
                            Logout
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            user: {
                username: '',
                email: ''
            }
        };
    },
    created() {
        this.fetchUserData();
    },
    methods: {
        fetchUserData() {
            fetch('/auth/user-info', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getToken()}`
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    console.error('Error:', data.error);
                } else {
                    this.user.username = data.username;
                    this.user.email = data.email;
                }
            })
            .catch(error => {
                console.error('Fetch Error:', error);
            });
        },
        getToken() {
            // Retrieve token from localStorage or cookies
            return localStorage.getItem('access_token'); // Adjust if using cookies
        },
        logout() {
            fetch('/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                alert(data.msg);
                localStorage.removeItem('access_token'); // Remove token from localStorage
                this.$router.push('/login');
            })
            .catch(error => {
                console.error('Logout Error:', error);
            });
        }
    }
});

export default LibrarianDashboard;
