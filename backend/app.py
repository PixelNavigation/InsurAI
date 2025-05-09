from flask import Flask, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import random
from datetime import datetime, timedelta

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
    policies = db.relationship('policyData', backref='user', lazy=True)


class policyData(db.Model):
    PolicyID = db.Column(db.Integer, primary_key=True)
    aadhaar = db.Column(db.String(12), db.ForeignKey('user.aadhaar'), nullable=False)
    Type = db.Column(db.String(50), nullable=False)
    Status = db.Column(db.String(50), nullable=False)
    Premium = db.Column(db.String(50), nullable=False)
    StartDate = db.Column(db.String(50), nullable=False)
    RenewalDate = db.Column(db.String(50), nullable=False)
    __tablename__ = 'policydata'
    

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

    policy_types = ['Health', 'Life', 'Auto', 'Home', 'Travel']
    policy_statuses = ['Active', 'Expired']
    for _ in range(random.randint(2, 4)):
        p_type = random.choice(policy_types)
        p_status = random.choice(policy_statuses)
        p_premium = str(random.randint(1000, 25000))
        start_date = datetime.now() - timedelta(days=random.randint(0, 365))
        renewal_date = start_date + timedelta(days=365)
        policy = policyData(
            aadhaar=new_user.aadhaar,
            Type=p_type,
            Status=p_status,
            Premium=p_premium,
            StartDate=start_date.strftime('%Y-%m-%d'),
            RenewalDate=renewal_date.strftime('%Y-%m-%d')
        )
        db.session.add(policy)
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

@app.route('/api/policies', methods=['GET'])
def get_policies():
    aadhaar = request.args.get('aadhaar')
    if not aadhaar:
        return {'message': 'Aadhaar is required'}, 400
    user = User.query.filter_by(aadhaar=aadhaar).first()
    if not user:
        return {'message': 'User not found'}, 404
    policies = policyData.query.filter_by(aadhaar=aadhaar).all()
    policies_list = [
        {
            'PolicyID': p.PolicyID,
            'Type': p.Type,
            'Status': p.Status,
            'Premium': p.Premium,
            'StartDate': p.StartDate,
            'RenewalDate': p.RenewalDate
        }
        for p in policies
    ]
    return {'policies': policies_list}, 200

with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True, port=5000)
