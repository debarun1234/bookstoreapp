from flask import render_template, Blueprint

main = Blueprint('main', __name__)

@main.route('/')
@main.route('/home')
def home():
    return render_template('home.html')

@main.route('/login/seller')
def login_seller():
    return render_template('login_seller.html')

@main.route('/login/customer')
def login_customer():
    return render_template('login_customer.html')

@main.route('/register/seller')
def register_seller():
    return render_template('register_seller.html')

@main.route('/register/customer')
def register_customer():
    return render_template('register_customer.html')

# Other routes...
