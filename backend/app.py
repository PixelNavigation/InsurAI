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
    CompanyName = db.Column(db.String(50), nullable=False)
    aadhaar = db.Column(db.String(12), db.ForeignKey('user.aadhaar'), nullable=False)
    Type = db.Column(db.String(50), nullable=False)
    Status = db.Column(db.String(50), nullable=False)
    Premium = db.Column(db.String(50), nullable=False)
    StartDate = db.Column(db.String(50), nullable=False)
    RenewalDate = db.Column(db.String(50), nullable=False)
    __tablename__ = 'policydata'

class RecentClaim(db.Model):
    clmID = db.Column(db.Integer, primary_key=True)
    CompanyName = db.Column(db.String(50), nullable=False)
    PolicyID = db.Column(db.Integer, db.ForeignKey('policydata.PolicyID'), nullable=False)
    status = db.Column(db.String(50), nullable=False)
    Type = db.Column(db.String(50), nullable=False)
    Amount = db.Column(db.String(50), nullable=False)
    FiledDate = db.Column(db.String(50), nullable=False)

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
    company_name = ['Acko','HDFC','ICICI','Bajaj','PolicyBazaar','LIC']
    policy_statuses = ['Active', 'Expired']
    for _ in range(random.randint(2, 4)):
        p_type = random.choice(policy_types)
        p_status = random.choice(policy_statuses)
        p_company_name = random.choice(company_name)
        p_premium = str(random.randint(1000, 25000))
        start_date = datetime.now() - timedelta(days=random.randint(0, 365))
        renewal_date = start_date + timedelta(days=365)
        policy = policyData(
            aadhaar=new_user.aadhaar,
            Type=p_type,
            CompanyName = p_company_name,
            Status=p_status,
            Premium=p_premium,
            StartDate=start_date.strftime('%Y-%m-%d'),
            RenewalDate=renewal_date.strftime('%Y-%m-%d')
        )
        db.session.add(policy)
    db.session.commit()

    # Create 2 to 3 random claims, at least one with status 'Rejected'
    policies = policyData.query.filter_by(aadhaar=new_user.aadhaar).all()
    claim_statuses = ['Approved', 'Pending', 'Rejected']
    num_claims = random.randint(2, 3)
    used_policy_ids = set()
    # Ensure at least one claim is 'Rejected'
    rejected_claim_idx = random.randint(0, num_claims - 1)
    for i in range(num_claims):
        if not policies:
            break
        policy = random.choice(policies)
        # Avoid duplicate claims for the same policy
        while policy.PolicyID in used_policy_ids and len(used_policy_ids) < len(policies):
            policy = random.choice(policies)
        used_policy_ids.add(policy.PolicyID)
        status = 'Rejected' if i == rejected_claim_idx else random.choice(['Approved', 'Pending'])
        claim = RecentClaim(
            CompanyName=policy.CompanyName,
            PolicyID=policy.PolicyID,
            status=status,
            Type=policy.Type,
            Amount=str(random.randint(500, 10000)),
            FiledDate=datetime.now().strftime('%Y-%m-%d')
        )
        db.session.add(claim)
    db.session.commit()
    return {'message': 'User created successfully', 'aadhaar': new_user.aadhaar}, 201

@app.route('/api/login', methods=['POST'])
def login_user():
    data = request.get_json()
    user = User.query.filter_by(email=data['email'], password=data['password']).first()
    if user:
        return {'message': 'Login successful', 'aadhaar': user.aadhaar}, 200
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
            'RenewalDate': p.RenewalDate,
            'CompanyName': p.CompanyName
        }
        for p in policies
    ]
    return {'policies': policies_list}, 200

@app.route('/api/claims', methods=['GET'])
def get_claims():
    aadhaar = request.args.get('aadhaar')
    if not aadhaar:
        return {'message': 'Aadhaar is required'}, 400
    user = User.query.filter_by(aadhaar=aadhaar).first()
    if not user:
        return {'message': 'User not found'}, 404
    # Get all policies for this user
    policies = policyData.query.filter_by(aadhaar=aadhaar).all()
    policy_ids = [p.PolicyID for p in policies]
    # Get all claims for these policies
    claims = RecentClaim.query.filter(RecentClaim.PolicyID.in_(policy_ids)).all()
    claims_list = [
        {
            'clmID': c.clmID,
            'PolicyID': c.PolicyID,
            'CompanyName': c.CompanyName,
            'status': c.status,
            'Type': c.Type,
            'Amount': c.Amount,
            'FiledDate': c.FiledDate
        }
        for c in claims
    ]
    return {'claims': claims_list}, 200

with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True, port=5000)
