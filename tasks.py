from celery import Celery
from datetime import datetime
from models import db, Book, Request, Section
import csv
import os
from flask import Flask

# Create a Celery instance
celery = Celery(__name__, broker='redis://localhost:6379/0')

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///library.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    db.init_app(app)
    return app

@celery.task(bind=True)
def export_books_csv(self, librarian_id):
    # Create a new Flask app instance
    app = create_app()

    with app.app_context():
        # Fetch issued, returned, and granted books
        books = db.session.query(
            Book.name.label('book_name'),
            Book.content.label('content'),
            Book.author.label('author'),
            Request.date_requested.label('date_issued'),
            Request.date_returned.label('return_date'),
            Section.name.label('section_name')
        ).join(Request, Request.book_id == Book.id).join(Section, Book.section_id == Section.id).filter(
            Request.status.in_(['approved', 'returned', 'revoked'])
        ).all()

        if not books:
            return 'No books found to export.'

        # Define the CSV file path
        file_path = os.path.join(app.root_path, 'exports', f'books_export_{librarian_id}_{datetime.now().strftime("%Y%m%d%H%M%S")}.csv')

        # Ensure the directory exists
        os.makedirs(os.path.dirname(file_path), exist_ok=True)

        # Write the data to the CSV file
        with open(file_path, mode='w', newline='', encoding='utf-8') as csv_file:
            writer = csv.writer(csv_file)
            writer.writerow(['Book Name', 'Content', 'Author', 'Date Issued', 'Return Date', 'Section Name'])
            for book in books:
                writer.writerow([book.book_name, book.content, book.author, book.date_issued, book.return_date, book.section_name])

        # Optionally send an email or alert about the export completion
        return file_path
