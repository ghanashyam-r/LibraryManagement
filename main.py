from flask import Flask, render_template, session, jsonify, request,Blueprint
from flask_jwt_extended import JWTManager, create_access_token, jwt_required,get_jwt_identity
from database import db  # Ensure this is imported correctly
from models import User, Section, Book, Request, Feedback  # Import your models
from werkzeug.security import check_password_hash, generate_password_hash

app = Flask(__name__)
app.secret_key = 'fefsdsdsfdsfr'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///library.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  # Suppress the warning

jwt = JWTManager(app)
db.init_app(app)

# Ensure the app context is pushed and tables are created
with app.app_context():
    db.create_all()
    adminexists=User.query.filter_by(username='admin').first()
    if not adminexists:
        admin=User(username="admin",email="admin@gmail.com",role="admin",password_hash=generate_password_hash("password",method='pbkdf2:sha256'))
        db.session.add(admin)
        db.session.commit()

@jwt.user_identity_loader
def user_identity_lookup(user):
    return user.id

@jwt.user_lookup_loader
def user_lookup_callback(_jwt_header, _jwt_data):
    identity = _jwt_data['sub']
    return User.query.get(identity)  # Corrected to return a User instance

auth = Blueprint('auth', __name__)
@app.route('/register', methods=['POST'])
def signup_post():
    data = request.get_json()
    user = User.query.filter_by(email=data["email"]).first()
    if user:
        return jsonify({'error': 'User already exists'}), 409
    else:
        new_user = User(email=data["email"], username=data["username"],
                        role='user',
                        password_hash=generate_password_hash(data["password"],
                                                        method='pbkdf2:sha256'))
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'message': 'User created'}), 201

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
