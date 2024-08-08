# main.py
from flask import Flask, render_template, jsonify, request, Blueprint
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity, set_access_cookies, unset_jwt_cookies
from database import db
from models import User, Section, Book,Request, Feedback
from werkzeug.security import check_password_hash, generate_password_hash
from worker import celery_init_app
import flask_excel as excel

app = Flask(__name__)
app.secret_key = 'fefsdsdsfdsfr'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///library.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'your_jwt_secret_key'

jwt = JWTManager(app)
db.init_app(app)

celery_app = celery_init_app(app)
# Ensure the app context is pushed and tables are created
with app.app_context():
    db.create_all()
    adminexists = User.query.filter_by(username='admin').first()
    if not adminexists:
        admin = User(username="admin", email="admin@gmail.com", role="admin", password_hash=generate_password_hash("password", method='pbkdf2:sha256'))
        db.session.add(admin)
        db.session.commit()

@jwt.user_identity_loader
def user_identity_lookup(user):
    return user.id

@jwt.user_lookup_loader
def user_lookup_callback(_jwt_header, _jwt_data):
    identity = _jwt_data['sub']
    return User.query.get(identity)

auth = Blueprint('auth', __name__)

@app.route('/register', methods=['POST'])
def signup_post():
    data = request.get_json()
    user = User.query.filter_by(email=data["email"]).first()
    if user:
        return jsonify({'error': 'User already exists'}), 409
    else:
        new_user = User(email=data["email"], username=data["username"], role='user', password_hash=generate_password_hash(data["password"], method='pbkdf2:sha256'))
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'message': 'User created'}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    user = User.query.filter_by(username=username).first()
    if user and check_password_hash(user.password_hash, password):
        access_token = create_access_token(identity=user)
        response = jsonify({"msg": "login successful", "access_token": access_token, "role": user.role})
        set_access_cookies(response, access_token)
        return response
    return jsonify({"msg": "Invalid username or password"}), 401

@app.route('/logout', methods=['POST'])
def logout():
    response = jsonify({"msg": "logout successful"})
    unset_jwt_cookies(response)
    return response

@app.route('/auth/user-info', methods=['GET'])
@jwt_required()
def user_info():
    current_user = get_jwt_identity()
    user = User.query.get(current_user)
    if user:
        return jsonify({
            'username': user.username,
            'email': user.email
        }), 200
    else:
        return jsonify({'error': 'User not found'}), 404

# Section Management Routes
@app.route('/sections', methods=['POST'])
@jwt_required()
def create_section():
    data = request.get_json()
    new_section = Section(name=data['name'], description=data['description'])
    db.session.add(new_section)
    db.session.commit()
    return jsonify({'message': 'Section created'}), 201

@app.route('/sections', methods=['GET'])
@jwt_required()
def get_sections():
    sections = Section.query.all()
    return jsonify([{
        'id': section.id,
        'name': section.name,
        'date_created': section.date_created,
        'description': section.description
    } for section in sections]), 200

@app.route('/sections/<int:section_id>', methods=['PUT'])
@jwt_required()
def update_section(section_id):
    data = request.get_json()
    section = Section.query.get(section_id)
    if not section:
        return jsonify({'message': 'Section not found'}), 404
    section.name = data['name']
    section.description = data['description']
    db.session.commit()
    return jsonify({'message': 'Section updated'}), 200

@app.route('/sections/<int:section_id>', methods=['DELETE'])
@jwt_required()
def delete_section(section_id):
    section = Section.query.get(section_id)
    if not section:
        return jsonify({'message': 'Section not found'}), 404
    db.session.delete(section)
    db.session.commit()
    return jsonify({'message': 'Section deleted'}), 200

# eBook Management Routes
@app.route('/sections/<int:section_id>/books', methods=['GET'])
@jwt_required()
def get_books_by_section(section_id):
    books = Book.query.filter_by(section_id=section_id).all()
    return jsonify([{
        'id': book.id,
        'name': book.name,
        'content': book.content,
        'author': book.author,
        'date_issued': book.date_issued,
        'return_date': book.return_date,
        'section_id': book.section_id
    } for book in books]), 200

@app.route('/books', methods=['GET'])
@jwt_required()
def get_books():
    books = db.session.query(
        Book.id, Book.name, Book.content, Book.author, Book.date_issued, Book.return_date, Book.section_id, Section.name.label('section_name')
    ).join(Section, Book.section_id == Section.id).all()
    
    book_list = []
    for book in books:
        book_list.append({
            'id': book.id,
            'name': book.name,
            'content': book.content,
            'author': book.author,
            'date_issued': book.date_issued,
            'return_date': book.return_date,
            'section_id': book.section_id,
            'section_name': book.section_name
        })

    return jsonify(book_list), 200


from datetime import datetime,timedelta

@app.route('/sections/<int:section_id>/books', methods=['POST'])
@jwt_required()
def create_book(section_id):
    data = request.get_json()

    # Convert date strings to datetime objects
    try:
        date_issued = datetime.strptime(data.get('date_issued'), '%Y-%m-%d') if data.get('date_issued') else None
        return_date = datetime.strptime(data.get('return_date'), '%Y-%m-%d') if data.get('return_date') else None
    except ValueError:
        return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD.'}), 400

    new_book = Book(
        name=data['name'],
        content=data['content'],
        author=data['author'],
        date_issued=date_issued,
        return_date=return_date,
        section_id=section_id
    )
    
    try:
        db.session.add(new_book)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

    return jsonify({
        'id': new_book.id,
        'name': new_book.name,
        'content': new_book.content,
        'author': new_book.author,
        'date_issued': new_book.date_issued.isoformat() if new_book.date_issued else None,
        'return_date': new_book.return_date.isoformat() if new_book.return_date else None,
        'section_id': new_book.section_id
    }), 201
@app.route('/books/<int:id>', methods=['PUT'])
@jwt_required()
def update_book(id):
    book = Book.query.get(id)
    if not book:
        abort(404, description="Book not found")
    
    data = request.get_json()
    
    try:
        # Convert date strings to datetime objects
        book.name = data.get('name', book.name)
        book.content = data.get('content', book.content)
        book.author = data.get('author', book.author)
        book.date_issued = datetime.strptime(data.get('date_issued'), '%Y-%m-%d') if data.get('date_issued') else book.date_issued
        book.return_date = datetime.strptime(data.get('return_date'), '%Y-%m-%d') if data.get('return_date') else book.return_date
        book.section_id = data.get('section_id', book.section_id)
        
        db.session.commit()
        
        # Return updated book details as JSON response
        return jsonify({
            'id': book.id,
            'name': book.name,
            'content': book.content,
            'author': book.author,
            'date_issued': book.date_issued.isoformat() if book.date_issued else None,
            'return_date': book.return_date.isoformat() if book.return_date else None,
            'section_id': book.section_id
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/books/<int:book_id>', methods=['DELETE'])
@jwt_required()
def delete_book(book_id):
    book = Book.query.get(book_id)
    if not book:
        return jsonify({'message': 'Book not found'}), 404
    db.session.delete(book)
    db.session.commit()
    return jsonify({'message': 'Book deleted'}), 200
@app.route('/books/<int:book_id>/request', methods=['POST'])
@jwt_required()
def request_book(book_id):
    current_user = get_jwt_identity()
    user = User.query.get(current_user)
    
    # Check if user has already requested 5 books
    if Request.query.filter_by(user_id=user.id, date_returned=None).count() >= 5:
        return jsonify({'error': 'You can only request a maximum of 5 books at a time.'}), 403

    new_request = Request(user_id=user.id, book_id=book_id, status='requested')
    db.session.add(new_request)
    db.session.commit()
    return jsonify({'message': 'Book requested successfully.'}), 201

@app.route('/books/<int:book_id>/return', methods=['POST'])
@jwt_required()
def return_book(book_id):
    current_user = get_jwt_identity()
    user = User.query.get(current_user)
    
    # Find the request record
    request_record = Request.query.filter_by(user_id=user.id, book_id=book_id, date_returned=None).first()
    if not request_record:
        return jsonify({'error': 'No record of this book being borrowed.'}), 404

    request_record.date_returned = datetime.utcnow()
    db.session.commit()
    return jsonify({'message': 'Book returned successfully.'}), 200
@app.route('/books/<int:book_id>/feedback', methods=['POST'])
@jwt_required()
def give_feedback(book_id):
    data = request.get_json()
    current_user = get_jwt_identity()
    user = User.query.get(current_user)
    
    new_feedback = Feedback(
        user_id=user.id,
        book_id=book_id,
        rating=data['rating'],
        comment=data['comment']
    )
    db.session.add(new_feedback)
    db.session.commit()
    return jsonify({'message': 'Feedback submitted successfully.'}), 201


# Librarian functionalities
@app.route('/requests', methods=['GET'])
@jwt_required()
def get_requests():
    requests = db.session.query(
        Request.id, 
        User.username.label('user'), 
        Book.name.label('book'), 
        Request.status
    ).join(User, Request.user_id == User.id).join(Book, Request.book_id == Book.id).all()
    
    return jsonify([{
        'id': req.id,
        'user': req.user,
        'book': req.book,
        'status': req.status
    } for req in requests]), 200

@app.route('/requests/<int:request_id>/approve', methods=['POST'])
@jwt_required()
def approve_request(request_id):
    request_record = Request.query.get(request_id)
    if not request_record:
        return jsonify({'error': 'Request not found'}), 404

    request_record.status = 'approved'
    request_record.date_approved = datetime.utcnow()
    db.session.commit()
    return jsonify({'message': 'Request approved successfully.'}), 200

@app.route('/requests/<int:request_id>/revoke', methods=['POST'])
@jwt_required()
def revoke_request(request_id):
    request_record = Request.query.get(request_id)
    if not request_record:
        return jsonify({'error': 'Request not found'}), 404

    request_record.status = 'revoked'
    request_record.date_returned = datetime.utcnow()
    db.session.commit()
    return jsonify({'message': 'Request revoked successfully.'}), 200
@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
