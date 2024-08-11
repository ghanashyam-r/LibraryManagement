from celery import Celery
from datetime import datetime, timedelta
from models import db, Book, Request, Section, User
import csv
import os
from flask import Flask
from smtplib import SMTP
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from celeryconfig import timezone
from celery.schedules import crontab

# Create a Celery instance
celery = Celery(__name__, broker='redis://localhost:6379/0')

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///library.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    db.init_app(app)
    return app
app = create_app()


@celery.task(bind=True)
def export_books_csv(self, librarian_id):
    app = create_app()

    with app.app_context():
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

        file_path = os.path.join(app.root_path, 'exports', f'books_export_{librarian_id}_{datetime.now().strftime("%Y%m%d%H%M%S")}.csv')
        os.makedirs(os.path.dirname(file_path), exist_ok=True)

        with open(file_path, mode='w', newline='', encoding='utf-8') as csv_file:
            writer = csv.writer(csv_file)
            writer.writerow(['Book Name', 'Content', 'Author', 'Date Issued', 'Return Date', 'Section Name'])
            for book in books:
                writer.writerow([book.book_name, book.content, book.author, book.date_issued, book.return_date, book.section_name])

        return file_path

# SMTP configuration
SMTP_HOST = "localhost"
SMTP_PORT = 1025
SENDER_EMAIL = '21f1003387@ds.study.iitm.ac.in'
SENDER_PASSWORD = ''

def send_message(to, subject, content_body):
    msg = MIMEMultipart()
    msg["To"] = to
    msg["Subject"] = subject
    msg["From"] = SENDER_EMAIL
    msg.attach(MIMEText(content_body, 'html'))
    
    with SMTP(host=SMTP_HOST, port=SMTP_PORT) as client:
        client.send_message(msg)

@celery.task
def send_daily_reminders():
    app = create_app()

    with app.app_context():
        now = datetime.now()
        reminder_time = now.replace(hour=12, minute=0, second=0, microsecond=0)
        if now > reminder_time:
            reminder_time += timedelta(days=1)
        
        users = db.session.query(User).all()
        for user in users:
            if user.role=='user':
                subject = 'Reminder to Visit Library'
                body = f'Hello {user.username},<br><br>Please visit the library to return or borrow books.<br><br>Best regards,<br>Library Management System'
                send_message(user.email, subject, body)
            
            books_due_soon = db.session.query(Request).join(Book).filter(
                Request.user_id == user.id,
                Request.status == 'approved',
                Book.return_date <= reminder_time
            ).all()
            
            if books_due_soon:
                subject = 'Reminder: Book Return Due Soon'
                body = f'Hello {user.username},<br><br>You have books that need to be returned soon. Please return them by the due date.<br><br>Best regards,<br>Library Management System'
                send_message(user.email, subject, body)



@celery.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    sender.add_periodic_task(
        crontab(minute='*/1'),  
        send_daily_reminders.s(),
        name='daily'
    )
