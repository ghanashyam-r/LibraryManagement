// BorrowedBooks.js
const BorrowedBooks = Vue.component('BorrowedBooks', {
    template: `
        <div class="container">
            <nav class="navbar navbar-light bg-light mb-4">
                <a class="navbar-brand" href="#">Library</a>
                <router-link to="/userdashboard" class="btn btn-primary">Back to Dashboard</router-link>
                <!-- Optional: Add more navigation links if needed -->
            </nav>
            <div class="row">
                <div class="col-12">
                    <h2 class="mt-5">Your Borrowed Books</h2>
                    <div v-if="borrowedBooks.length === 0">
                        <p>You have not borrowed any books.</p>
                    </div>
                    <div v-else>
                        <ul class="list-group">
                            <li v-for="book in borrowedBooks" :key="book.id" class="list-group-item">
                                <h5 class="mb-1">{{ book.name }}</h5>
                                <p><strong>Author:</strong> {{ book.author }}</p>
                                <p><strong>Date Issued:</strong> {{ book.date_issued }}</p>
                                <p><strong>Return Date:</strong> {{ book.return_date }}</p>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            borrowedBooks: []
        };
    },
    created() {
        this.fetchBorrowedBooks();
    },
    methods: {
        fetchBorrowedBooks() {
            fetch('/users/borrowed-books', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getToken()}`
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    console.error('Error fetching borrowed books:', data.error);
                } else {
                    this.borrowedBooks = data;
                }
            })
            .catch(error => {
                console.error('Fetch Error:', error);
            });
        },
        getToken() {
            return localStorage.getItem('access_token'); // Adjust if using cookies
        }
    }
});

export default BorrowedBooks;
