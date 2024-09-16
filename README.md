# Library Management System 
A comprehensive multi-user application designed to manage e-books across various sections in an online library. This system allows librarians to manage sections and e-books while enabling general users to access and request e-books. The project is built using Flask for the backend, VueJS for the frontend, SQLite for data storage, Redis for caching, and Celery for batch jobs.

## Features
**1. Role-Based Access Control (RBAC)**

-Librarian: Manages sections, e-books, user requests, and reviews user statistics.

-General User: Accesses and requests e-books, views sections, and provides feedback on e-books.

**2. Core Functionalities**

-Admin and User Login: Role-based login with a registration page.

-Librarian Dashboard: View statistics on active users, grant requests, issued e-books, etc.

-Section and e-Book Management: Librarians can create, edit, delete sections and e-books.

-Search Functionality: Users can search for e-books based on section, author, title, and other parameters.

-e-Book Requests: Users can request/return a maximum of 5 e-books at a time and leave feedback.

-Grant/Revoke e-Books: Librarians can approve or revoke user access to e-books.

**3. Backend Jobs**

-Daily Reminders: Automatic reminders for users with approaching return dates.

-Monthly Activity Report: Automatically generate and email a report summarizing e-book activities.

-CSV Export: Librarians can trigger the export of e-book records as a CSV file.

**4. Performance Optimization**

-Caching: Redis is used to cache frequently accessed data and optimize performance.

-Scheduled Jobs: Celery handles background tasks such as sending reminders and generating reports.

### Application Stack

**Backend:** Flask (Python), SQLite (Database), Redis (Caching), Celery (Background Jobs)

**Frontend:** Vue.js, Bootstrap (for UI styling)

**Other Technologies:** Jinja2 (for server-side rendering of monthly report), Mailhog (for email simulation)

## Screenshots
### User Dashboard
![Library](https://github.com/user-attachments/assets/3a947ed0-edce-4625-bc48-670c5dae5cc0)
### Search Functionality
![Library · 5 29pm · 09-16](https://github.com/user-attachments/assets/e55d4082-3a10-444a-baa1-6c88ae63d738)
### Borrowed Books
![Library · 5 29pm · 09-16 (1)](https://github.com/user-attachments/assets/304e19e7-0ad4-4bd6-bf70-3c75d255a65a)
### Admin Dashboard
![Library · 5 21pm · 09-16](https://github.com/user-attachments/assets/bf04decb-9ba0-45ab-ac84-de5c4326926a)
### Sections CRUD
![Library · 5 21pm · 09-16 (1)](https://github.com/user-attachments/assets/fef55bca-4a1f-4975-b5c4-c1fc9a2c7457)
### E-Books CRUD
![Library · 5 22pm · 09-16](https://github.com/user-attachments/assets/ec235b62-813c-4127-9687-6deaac83e8cd)
### Monthly report via email client
![MailHog](https://github.com/user-attachments/assets/698ee1d6-0aa9-4066-a4f8-e53bce6af183)
### Mailhog interface with the Celery Tasks executed
![MailHog · 5 24pm · 09-16](https://github.com/user-attachments/assets/ff3583fc-09d8-457b-bae2-0bf21d2d41c5)



