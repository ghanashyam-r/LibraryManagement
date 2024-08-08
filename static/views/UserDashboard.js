const UserDashboard = Vue.component('UserDashboard', {
    template: `
        <div class="container">
            <nav class="navbar navbar-light bg-light mb-4">
                <a class="navbar-brand" href="#">Library</a>
                <form class="form-inline d-flex w-50" @submit.prevent="search">
                    <input class="form-control mr-2 flex-grow-1" type="search" placeholder="Search books or sections" v-model="searchQuery" />
                    <button class="btn btn-outline-success" type="submit">Search</button>
                </form>
                <!-- Removed username and email from navbar -->
            </nav>
            <div class="row">
                <div class="col-12">
                    <h2 class="mt-5">Welcome, {{ user.username }}!</h2>
                    <p>Email: {{ user.email }}</p>
                    <div class="list-group mt-4">
                        <router-link to="/borrowed-books" class="list-group-item list-group-item-action">
                            View Borrowed Books
                        </router-link>
                        <router-link to="/" class="list-group-item list-group-item-action" @click.prevent="logout">
                            Logout
                        </router-link>
                    </div>
                    <div class="mt-4">
                        <h3>Available Books</h3>
                        <div v-for="book in filteredBooks" :key="book.id" class="card mb-2">
                            <div class="card-body">
                                <h5 class="card-title">{{ book.name }}</h5>
                                <p class="card-text">{{ book.author }}</p>
                                <p class="card-text"><strong>Section:</strong> {{ book.section_name }}</p>
                                <button @click="requestBook(book.id)" class="btn btn-primary" :disabled="book.requested">Request Book</button>
                                <button @click="returnBook(book.id)" class="btn btn-warning" :disabled="!book.requested">Return Book</button>
                                <div class="mt-3">
                                    <h6>Give Feedback</h6>
                                    <input v-model="feedback[book.id].rating" placeholder="Rating" type="number" min="1" max="5" class="form-control">
                                    <textarea v-model="feedback[book.id].comment" placeholder="Comment" class="form-control mt-2"></textarea>
                                    <button @click="giveFeedback(book.id)" class="btn btn-success mt-2">Submit Feedback</button>
                                </div>
                            </div>
                        </div>
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
            },
            books: [],
            feedback: {},
            searchQuery: ''
        };
    },
    computed: {
        filteredBooks() {
            if (!this.searchQuery) return this.books;
            const query = this.searchQuery.toLowerCase();
            return this.books.filter(book => 
                book.name.toLowerCase().includes(query) ||
                book.author.toLowerCase().includes(query) ||
                book.section_name.toLowerCase().includes(query)
            );
        }
    },
    created() {
        this.fetchUserData();
        this.fetchBooks();
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
        fetchBooks() {
            fetch('/books', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getToken()}`
                }
            })
            .then(response => response.json())
            .then(data => {
                this.books = data;
                this.books.forEach(book => {
                    this.$set(this.feedback, book.id, { rating: '', comment: '' });
                });
            })
            .catch(error => {
                console.error('Fetch Error:', error);
            });
        },
        requestBook(bookId) {
            fetch(`/books/${bookId}/request`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getToken()}`
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    alert(data.error);
                } else {
                    alert(data.message);
                    this.fetchBooks();
                }
            })
            .catch(error => {
                console.error('Request Error:', error);
            });
        },
        returnBook(bookId) {
            fetch(`/books/${bookId}/return`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getToken()}`
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    alert(data.error);
                } else {
                    alert(data.message);
                    this.fetchBooks();
                }
            })
            .catch(error => {
                console.error('Return Error:', error);
            });
        },
        giveFeedback(bookId) {
            const feedbackData = this.feedback[bookId];
            fetch(`/books/${bookId}/feedback`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getToken()}`
                },
                body: JSON.stringify(feedbackData)
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    alert(data.error);
                } else {
                    alert(data.message);
                    this.feedback[bookId] = { rating: '', comment: '' };
                }
            })
            .catch(error => {
                console.error('Feedback Error:', error);
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
    }
});

export default UserDashboard;
