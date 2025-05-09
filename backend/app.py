from flask import Flask, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "*"}},
     methods=["GET", "POST", "PUT", "DELETE"],
     allow_headers=["Content-Type", "Authorization"],
     expose_headers=["Content-Type"])

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:Gautam%401@localhost:5432/InsureAI'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy()
db.init_app(app)

class User(db.Model):
    aadhaar = db.Column(db.String(12), nullable=False, primary_key=True)
    name= db.Column(db.String(50), nullable=False)
    email= db.Column(db.String(50), nullable=False, unique=True)
    password= db.Column(db.String(50), nullable=False)


class policyData(db.Model):
    email = db.Column(db.String(50), db.ForeignKey('user.email'), primary_key=True)
    PolicyID = db.Column(db.Integer, primary_key=True)
    Type = db.Column(db.String(50), nullable=False)
    Status = db.Column(db.String(50), nullable=False)
    Premium = db.Column(db.String(50), nullable=False)
    StartDate = db.Column(db.String(50), nullable=False)
    RenewalDate = db.Column(db.String(50), nullable=False)
    

@app.route('/api/signup', methods=['POST'])
def signup_user():
    data = request.get_json()
    if User.query.filter_by(email=data['email']).first():
        return {'message': 'User already exists'}, 400
    if User.query.filter_by(aadhaar=data['aadhaar']).first():
        return {'message': 'Aadhaar already registered'}, 400
    new_user = User(
        name=data['fullName'],
        email=data['email'],
        aadhaar=data['aadhaar'],
        password=data['password']
    )
    db.session.add(new_user)
    db.session.commit()
    return {'message': 'User created successfully'}, 201

@app.route('/api/login', methods=['POST'])
def login_user():
    data = request.get_json()
    user = User.query.filter_by(email=data['email'], password=data['password']).first()
    if user:
        return {'message': 'Login successful'}, 200
    else:
        return {'message': 'Invalid credentials'}, 401

@app.route('/api/logout', methods=['POST'])
def logout_user():
    return {'message': 'Logout successful'}, 200

with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True, port=5000)

