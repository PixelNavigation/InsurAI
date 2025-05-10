from flask import Flask, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import random
from datetime import datetime, timedelta
import requests

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

    num_policies = random.randint(2, 4)
    used_types = set()
    for _ in range(num_policies):
        available_types = [t for t in policy_types if t not in used_types]
        if not available_types:
            available_types = policy_types
        p_type = random.choice(available_types)
        used_types.add(p_type)
        p_status = 'Active' if random.random() < 0.8 else 'Expired'
        p_company_name = random.choice(company_name)
        p_premium = str(random.randint(1000, 25000))
        start_date = datetime.now() - timedelta(days=random.randint(0, 730))
        if p_status == 'Active':
            renewal_date = datetime.now() + timedelta(days=random.randint(1, 365))
        else:
            renewal_date = datetime.now() - timedelta(days=random.randint(1, 365))
        policy = policyData(
            aadhaar=new_user.aadhaar,
            Type=p_type,
            CompanyName=p_company_name,
            Status=p_status,
            Premium=p_premium,
            StartDate=start_date.strftime('%Y-%m-%d'),
            RenewalDate=renewal_date.strftime('%Y-%m-%d')
        )
        db.session.add(policy)
    db.session.commit()

    # Create 2 to 3 random claims, at least one with status 'Rejected'
    policies = policyData.query.filter_by(aadhaar=new_user.aadhaar).all()
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
        status = 'Rejected' if i == rejected_claim_idx else random.choice(['Approved', 'Processing'])
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

GEMINI_API_KEY = "AIzaSyBmbsUDW72lFLU3AybeTZg5c1bwTtPquvs"

@app.route('/api/ai-assistant', methods=['POST'])
def ai_assistant():
    data = request.get_json()
    user_message = data.get('message', '')
    insurance_keywords = [
        'insurance', 'policy', 'premium', 'claim', 'coverage', 'risk', 'renewal',
        'agent', 'company', 'plan', 'benefit', 'deductible', 'sum assured', 'life', 'health', 'auto', 'home'
    ]
    if not any(word in user_message.lower() for word in insurance_keywords):
        return {'reply': "I'm here to help with insurance-related questions only. Please ask something about insurance."}, 200

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={GEMINI_API_KEY}"
    payload = {
        "contents": [
            {"parts": [{"text": user_message}]}
        ]
    }
    try:
        response = requests.post(url, json=payload)
        response.raise_for_status()
        gemini_data = response.json()
        print('Gemini API response:', gemini_data)
        reply = ""
        candidates = gemini_data.get("candidates", [])
        if candidates:
            content = candidates[0].get("content", {})
            parts = content.get("parts", [])
            if parts and isinstance(parts, list):
                reply = parts[0].get("text", "")
        if not reply:
            reply = gemini_data.get('text', "") or gemini_data.get('reply', "")
        if not reply:
            reply = "I'm sorry, I am unable to reach the server at this time."
    except Exception as e:
        print('Gemini API error:', e)
        reply = "Sorry, there was an error connecting to the AI service."

    return {'reply': reply}, 200

@app.route('/api/risk-scores', methods=['GET'])
def get_risk_scores():
    risk_scores = {
        'auto': random.randint(60, 95),
        'home': random.randint(60, 95),
        'life': random.randint(60, 95),
        'health': random.randint(60, 95)
    }
    return {'riskScores': risk_scores}, 200

with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True, port=5000)
