
const LibrarianNavbar = Vue.component('LibrarianNavbar', {
    template: `
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <a class="navbar-brand" href="#">Library Management</a>
            <button
                class="navbar-toggler"
                type="button"
                data-toggle="collapse"
                data-target="#navbarNav"
                aria-controls="navbarNav"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <router-link to="/manage-books" class="nav-link">Manage Books</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/manage-sections" class="nav-link">Manage Sections</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/view-statistics" class="nav-link">View Statistics</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/manage-requests" class="nav-link">Manage Requests</router-link>
                    </li>
                </ul>
            </div>
        </nav>
    `,
});

export default LibrarianNavbar;
