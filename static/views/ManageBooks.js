const ManageBooks = Vue.component('ManageBooks', {
    template: `
      <div class="container my-5">
      
          <nav class="navbar navbar-light bg-light mb-4">
            <a class="navbar-brand" href="#">Librarian Dashboard</a>
            <router-link to="/librariandashboard" class="btn btn-primary">Back to Dashboard</router-link>
          </nav>
        <div class="row">
          <div class="col-12">
            <h2 class="text-center mb-4">Manage Books</h2>
            <button class="btn btn-primary mb-3" @click="showCreateBookForm">Create Book</button>
  
            <!-- Book Form Start -->
            <div v-if="showForm" class="card mb-4">
              <div class="card-header">
                <h5>{{ formMode }} Book</h5>
              </div>
              <div class="card-body">
                <form @submit.prevent="handleSubmit">
                  <div class="mb-3">
                    <label for="bookName" class="form-label">Name</label>
                    <input type="text" v-model="book.name" class="form-control" id="bookName" required>
                  </div>
                  <div class="mb-3">
                    <label for="bookContent" class="form-label">Content</label>
                    <textarea v-model="book.content" class="form-control" id="bookContent" rows="3" required></textarea>
                  </div>
                  <div class="mb-3">
                    <label for="bookAuthor" class="form-label">Author</label>
                    <input type="text" v-model="book.author" class="form-control" id="bookAuthor" required>
                  </div>
                  <div class="mb-3">
                    <label for="dateIssued" class="form-label">Date Issued (optional)</label>
                    <input type="date" v-model="book.date_issued" class="form-control" id="dateIssued">
                  </div>
                  <div class="mb-3">
                    <label for="returnDate" class="form-label">Return Date (optional)</label>
                    <input type="date" v-model="book.return_date" class="form-control" id="returnDate">
                  </div>
                  <div class="mb-3">
                    <label for="sectionSelect" class="form-label">Section</label>
                    <select v-model="book.section_id" class="form-select" id="sectionSelect" required>
                      <option v-for="section in sections" :value="section.id" :key="section.id">{{ section.name }}</option>
                    </select>
                  </div>
                  <div class="d-flex justify-content-between">
                    <button type="submit" class="btn btn-success">{{ formMode }}</button>
                    <button type="button" class="btn btn-secondary" @click="hideForm">Cancel</button>
                  </div>
                </form>
              </div>
            </div>
            <!-- Book Form End -->
  
            <!-- Book List Start -->
            <div class="list-group">
              <li v-for="book in books" :key="book.id" class="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <h5 class="mb-1">{{ book.name }} by {{ book.author }}</h5>
                  <p class="mb-0 text-muted">Section: {{ getSectionName(book.section_id) }}</p>
                </div>
                <div>
                  <button class="btn btn-warning btn-sm me-2" @click="editBook(book)">Edit</button>
                  <button class="btn btn-danger btn-sm" @click="deleteBook(book.id)">Delete</button>
                </div>
              </li>
            </div>
            <!-- Book List End -->
          </div>
        
      </div>
    `,
    data() {
      return {
        books: [],
        sections: [],
        book: {
          id: null,
          name: '',
          content: '',
          author: '',
          date_issued: '',
          return_date: '',
          section_id: null
        },
        showForm: false,
        formMode: 'Create'
      };
    },
    created() {
      this.fetchSections();
      this.fetchBooks();
    },
    methods: {
      fetchBooks() {
        fetch(`/books`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.getToken()}`
          }
        })
        .then(response => response.json())
        .then(data => {
          this.books = Array.isArray(data) ? data : [];
        })
        .catch(error => console.error('Error:', error));
      },
      fetchSections() {
        fetch(`/sections`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.getToken()}`
          }
        })
        .then(response => response.json())
        .then(data => {
          this.sections = Array.isArray(data) ? data : [];
        })
        .catch(error => console.error('Error:', error));
      },
      showCreateBookForm() {
        this.book = { id: null, name: '', content: '', author: '', date_issued: '', return_date: '', section_id: null };
        this.formMode = 'Create';
        this.showForm = true;
      },
      editBook(book) {
        this.book = { ...book };
        this.formMode = 'Edit';
        this.showForm = true;
      },
      handleSubmit() {
        if (this.formMode === 'Create') {
          this.createBook();
        } else {
          this.updateBook();
        }
      },
      createBook() {
        const bookData = {
          name: this.book.name,
          content: this.book.content,
          author: this.book.author,
          date_issued: this.book.date_issued || null,
          return_date: this.book.return_date || null,
          section_id: this.book.section_id
        };
  
        fetch(`/sections/${this.book.section_id}/books`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.getToken()}`
          },
          body: JSON.stringify(bookData)
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          console.log('Book created successfully:', data);
          this.fetchBooks();
          this.hideForm();
        })
        .catch(error => {
          console.error('There was a problem with your fetch operation:', error);
        });
      },
      updateBook() {
        const bookData = {
          name: this.book.name,
          content: this.book.content,
          author: this.book.author,
          date_issued: this.book.date_issued || null,
          return_date: this.book.return_date || null,
          section_id: this.book.section_id
        };
  
        fetch(`/books/${this.book.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.getToken()}`
          },
          body: JSON.stringify(bookData)
        })
        .then(response => {
          if (!response.ok) {
            return response.text().then(text => { throw new Error(text); });
          }
          return response.json();
        })
        .then(data => {
          const index = this.books.findIndex(b => b.id === this.book.id);
          if (index !== -1) {
            this.books[index] = data;
          }
          this.hideForm();
        })
        .catch(error => {
          console.error('There was a problem with your fetch operation:', error);
          alert('Error: ' + error.message);
        });
      },
      deleteBook(id) {
        fetch(`/books/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.getToken()}`
          }
        })
        .then(response => response.json())
        .then(data => {
          this.books = this.books.filter(book => book.id !== id);
        })
        .catch(error => console.error('Error:', error));
      },
      hideForm() {
        this.showForm = false;
      },
      getSectionName(section_id) {
        const section = this.sections.find(s => s.id === section_id);
        return section ? section.name : 'Unknown';
      },
      getToken() {
        return localStorage.getItem('access_token');
      }
    }
  });
  
  export default ManageBooks;
  