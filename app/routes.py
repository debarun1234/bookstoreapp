from flask import Blueprint, render_template, redirect, url_for, request, flash
from .models import User, Book, Genre, Order, Cart, Wishlist
from . import db
from flask_login import login_user, login_required, logout_user, current_user

main = Blueprint('main', __name__)

@main.route('/')
def home():
    books = Book.query.limit(5).all()
    return render_template('index.html', books=books)

@main.route('/about')
def about():
    return render_template('about.html')

@main.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        user = User.query.filter_by(username=username).first()
        if user and user.check_password(password):
            login_user(user)
            if user.is_admin:
                return redirect(url_for('main.admin'))
            else:
                return redirect(url_for('main.home'))
        else:
            flash('Login failed. Check your credentials and try again.')
    return render_template('login.html')

@main.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        address = request.form.get('address')
        is_admin = request.form.get('role') == 'admin'
        new_user = User(username=username, address=address, is_admin=is_admin)
        new_user.set_password(password)
        db.session.add(new_user)
        db.session.commit()
        return redirect(url_for('main.login'))
    return render_template('register.html')

@main.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('main.home'))

@main.route('/account')
@login_required
def account():
    return render_template('account_user.html')

@main.route('/order_history')
@login_required
def order_history():
    orders = Order.query.filter_by(user_id=current_user.id).all()
    return render_template('order_history.html', orders=orders)

@main.route('/wishlist')
@login_required
def wishlist():
    wishlist_items = Wishlist.query.filter_by(user_id=current_user.id).all()
    return render_template('wishlist.html', wishlist_items=wishlist_items)

@main.route('/account_settings')
@login_required
def account_settings():
    return render_template('account_settings.html', user=current_user)

@main.route('/catalog')
def catalog():
    genres = Genre.query.all()
    books = Book.query.all()
    return render_template('catalog.html', genres=genres, books=books)

@main.route('/add_to_cart/<int:book_id>', methods=['POST'])
@login_required
def add_to_cart(book_id):
    quantity = request.form.get('quantity')
    cart_item = Cart.query.filter_by(user_id=current_user.id, book_id=book_id).first()
    if cart_item:
        cart_item.quantity += int(quantity)
    else:
        new_cart_item = Cart(user_id=current_user.id, book_id=book_id, quantity=quantity)
        db.session.add(new_cart_item)
    db.session.commit()
    return redirect(url_for('main.cart'))

@main.route('/cart')
@login_required
def cart():
    if not current_user.address:
        flash('Please update your address in account settings before proceeding to checkout.')
        return redirect(url_for('main.account_settings'))
    cart_items = Cart.query.filter_by(user_id=current_user.id).all()
    total_price = sum(item.book.price * item.quantity for item in cart_items)
    return render_template('cart.html', cart_items=cart_items, total_price=total_price)

@main.route('/checkout', methods=['POST'])
@login_required
def checkout():
    cart_items = Cart.query.filter_by(user_id=current_user.id).all()
    if not cart_items:
        flash('Your cart is empty.')
        return redirect(url_for('main.cart'))
    
    for item in cart_items:
        new_order = Order(user_id=current_user.id, book_id=item.book_id, quantity=item.quantity, status='Pending')
        db.session.add(new_order)
        db.session.delete(item)
    db.session.commit()
    flash('Order placed successfully!')
    return redirect(url_for('main.order_history'))

@main.route('/manage_books', methods=['GET', 'POST'])
@login_required
def manage_books():
    if not current_user.is_admin:
        return redirect(url_for('main.home'))
    
    if request.method == 'POST':
        title = request.form.get('title')
        author = request.form.get('author')
        price = request.form.get('price')
        genre_id = request.form.get('genre')
        image_url = request.form.get('image_url')
        new_book = Book(title=title, author=author, price=price, genre_id=genre_id, image_url=image_url)
        db.session.add(new_book)
        db.session.commit()
        return redirect(url_for('main.manage_books'))

    genres = Genre.query.all()
    books = Book.query.all()
    return render_template('manage_books.html', genres=genres, books=books)

@main.route('/add_to_wishlist/<int:book_id>', methods=['POST'])
@login_required
def add_to_wishlist(book_id):
    existing_item = Wishlist.query.filter_by(user_id=current_user.id, book_id=book_id).first()
    if not existing_item:
        wishlist_item = Wishlist(user_id=current_user.id, book_id=book_id)
        db.session.add(wishlist_item)
        db.session.commit()
    return redirect(url_for('main.wishlist'))

@main.route('/remove_from_wishlist/<int:item_id>', methods=['POST'])
@login_required
def remove_from_wishlist(item_id):
    item = Wishlist.query.get(item_id)
    if item and item.user_id == current_user.id:
        db.session.delete(item)
        db.session.commit()
    return redirect(url_for('main.wishlist'))
