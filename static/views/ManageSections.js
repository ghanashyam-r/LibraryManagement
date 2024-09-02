const ManageSections = Vue.component('ManageSections', {
    template: `
        <div class="container my-5">

            <!-- Navbar -->
            <nav class="navbar navbar-light bg-light mb-4">
                <a class="navbar-brand" href="#">Librarian Dashboard</a>
                <router-link to="/librariandashboard" class="btn btn-primary">Back to Dashboard</router-link>
            </nav>
            
            <!-- Section Management Header -->
            <div class="row">
                <div class="col-12">
                    <h2 class="text-center mb-4">Manage Sections</h2>
                    <button class="btn btn-primary mb-3" @click="showCreateSectionForm">Create Section</button>
                    
                    <!-- Section Form Start -->
                    <div v-if="showForm" class="card mb-4">
                        <div class="card-header">
                            <h5>{{ formMode }} Section</h5>
                        </div>
                        <div class="card-body">
                            <form @submit.prevent="handleSubmit">
                                <div class="mb-3">
                                    <label for="sectionName" class="form-label">Section Name</label>
                                    <input type="text" v-model="section.name" class="form-control" id="sectionName" required>
                                </div>
                                <div class="mb-3">
                                    <label for="sectionDescription" class="form-label">Description</label>
                                    <textarea v-model="section.description" class="form-control" id="sectionDescription"></textarea>
                                </div>
                                <div class="d-flex justify-content-between">
                                    <button type="submit" class="btn btn-success">{{ formMode }}</button>
                                    <button type="button" class="btn btn-secondary" @click="hideForm">Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                    <!-- Section Form End -->

                    <!-- Section List Start -->
                    <div class="list-group">
                        <li v-for="section in sections" :key="section.id" class="list-group-item d-flex justify-content-between align-items-center">
                            <div>
                                <h5 class="mb-1">{{ section.name }}</h5>
                                <p class="mb-0 text-muted">{{ section.description }}</p>
                            </div>
                            <div>
                                <button class="btn btn-warning btn-sm me-2" @click="startEditSection(section)">Edit</button>
                                <button class="btn btn-danger btn-sm" @click="deleteSection(section.id)">Delete</button>
                            </div>
                        </li>
                    </div>
                    <!-- Section List End -->
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            sections: [],
            section: {
                name: '',
                description: ''
            },
            showForm: false,
            formMode: 'Create',
            editedSection: null
        };
    },
    created() {
        this.fetchSections();
    },
    methods: {
        fetchSections() {
            fetch('/sections', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getToken()}`
                }
            })
            .then(response => response.json())
            .then(data => {
                this.sections = data;
            })
            .catch(error => {
                console.error('Fetch Sections Error:', error);
            });
        },
        showCreateSectionForm() {
            this.formMode = 'Create';
            this.section = { name: '', description: '' };
            this.showForm = true;
        },
        startEditSection(section) {
            this.formMode = 'Edit';
            this.section = { ...section };
            this.showForm = true;
        },
        handleSubmit() {
            if (this.formMode === 'Create') {
                this.createSection();
            } else {
                this.updateSection();
            }
        },
        createSection() {
            fetch('/sections', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getToken()}`
                },
                body: JSON.stringify(this.section)
            })
            .then(response => response.json())
            .then(data => {
                this.sections.push(data);
                this.showForm = false;
            })
            .catch(error => {
                console.error('Create Section Error:', error);
            });
        },
        updateSection() {
            fetch(`/sections/${this.section.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getToken()}`
                },
                body: JSON.stringify(this.section)
            })
            .then(response => response.json())
            .then(updatedSection => {
                const index = this.sections.findIndex(s => s.id === updatedSection.id);
                this.$set(this.sections, index, updatedSection);
                this.showForm = false;
            })
            .catch(error => {
                console.error('Update Section Error:', error);
            });
        },
        deleteSection(sectionId) {
            fetch(`/sections/${sectionId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getToken()}`
                }
            })
            .then(response => {
                if (response.ok) {
                    this.sections = this.sections.filter(section => section.id !== sectionId);
                }
            })
            .catch(error => {
                console.error('Delete Section Error:', error);
            });
        },
        hideForm() {
            this.showForm = false;
        },
        getToken() {
            return localStorage.getItem('access_token');
        }
    }
});

export default ManageSections;
