const ManageSections = Vue.component('ManageSections', {
    template: `
        <div class="container">
            <div class="row">
                <div class="col-12">
                    <h2 class="mt-5">Manage Sections</h2>
                    <form @submit.prevent="createSection">
                        <div class="mb-3">
                            <label for="sectionName" class="form-label">Section Name</label>
                            <input type="text" v-model="newSection.name" class="form-control" id="sectionName" required>
                        </div>
                        <div class="mb-3">
                            <label for="sectionDescription" class="form-label">Description</label>
                            <textarea v-model="newSection.description" class="form-control" id="sectionDescription"></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary">Create Section</button>
                    </form>

                    <h3 class="mt-5">Existing Sections</h3>
                    <ul class="list-group">
                        <li v-for="section in sections" :key="section.id" class="list-group-item">
                            <h5>{{ section.name }}</h5>
                            <p>{{ section.description }}</p>
                            <button @click="startEditSection(section)" class="btn btn-warning btn-sm">Edit</button>
                            <button @click="deleteSection(section.id)" class="btn btn-danger btn-sm">Delete</button>
                        </li>
                    </ul>

                    <div v-if="editedSection" class="mt-5">
                        <h3>Edit Section</h3>
                        <form @submit.prevent="updateSection">
                            <div class="mb-3">
                                <label for="editSectionName" class="form-label">Section Name</label>
                                <input type="text" v-model="editedSection.name" class="form-control" id="editSectionName" required>
                            </div>
                            <div class="mb-3">
                                <label for="editSectionDescription" class="form-label">Description</label>
                                <textarea v-model="editedSection.description" class="form-control" id="editSectionDescription"></textarea>
                            </div>
                            <button type="submit" class="btn btn-primary">Update Section</button>
                            <button @click="cancelEdit" class="btn btn-secondary">Cancel</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            sections: [],
            newSection: {
                name: '',
                description: ''
            },
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
        createSection() {
            fetch('/sections', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getToken()}`
                },
                body: JSON.stringify(this.newSection)
            })
            .then(response => response.json())
            .then(data => {
                this.sections.push(data);
                this.newSection.name = '';
                this.newSection.description = '';
            })
            .catch(error => {
                console.error('Create Section Error:', error);
            });
        },
        startEditSection(section) {
            this.editedSection = { ...section };
        },
        updateSection() {
            fetch(`/sections/${this.editedSection.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getToken()}`
                },
                body: JSON.stringify(this.editedSection)
            })
            .then(response => response.json())
            .then(updatedSection => {
                const index = this.sections.findIndex(section => section.id === updatedSection.id);
                this.$set(this.sections, index, updatedSection);
                this.editedSection = null;
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
        cancelEdit() {
            this.editedSection = null;
        },
        getToken() {
            return localStorage.getItem('access_token');
        }
    }
});

export default ManageSections;
