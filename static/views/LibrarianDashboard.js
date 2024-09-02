
const LibrarianDashboard = Vue.component('LibrarianDashboard', {
    template: `
      <div class="d-flex">
        <!-- Sidebar Start -->
        <div class="sidebar bg-light p-3">
          <h4 class="mb-4">{{ user.username }}</h4>
          <div class="list-group list-group-flush">
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
            <button @click="exportBooksCSV" class="list-group-item list-group-item-action btn btn-success">
              Export Books as CSV
            </button>
            <router-link to="/" class="list-group-item list-group-item-action btn btn-danger" @click.prevent="logout">
              Logout
            </router-link>
          </div>
        </div>
        <!-- Sidebar End -->
  
        <!-- Main Content Start -->
        <div class="main-content flex-grow-1">
          <nav class="navbar navbar-light bg-light mb-4">
            <a class="navbar-brand" href="#">Librarian Dashboard</a>
          </nav>
  
          <!-- Statistics Content -->
          <div class="container mt-5">
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
        </div>
        <!-- Main Content End -->
      </div>
    `,
    data() {
      return {
        user: {
          username: '',
          email: ''
        },
        activeUsers: 0,
        grantRequests: 0,
        booksIssued: 0,
        booksRevoked: 0,
        feedbacksReceived: 0,
      };
    },
    created() {
      this.fetchUserData();
      this.fetchStatistics();
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
      fetchStatistics() {
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
      },
      getToken() {
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
      },
      exportBooksCSV() {
        fetch('/export-books-csv', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.getToken()}`
          }
        })
        .then(response => {
          if (!response.ok) {
            return response.text().then(text => {
              throw new Error(text);
            });
          }
          return response.json();
        })
        .then(data => {
          alert('CSV export initiated successfully');
          console.log(data); // Debug information
        })
        .catch(error => {
          console.error('Failed to start CSV export:', error.message);
          alert('Failed to start CSV export. Please check the console for more details.');
        });
      }
    }
  });
  
  export default LibrarianDashboard;