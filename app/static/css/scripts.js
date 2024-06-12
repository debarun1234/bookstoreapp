document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const addToCartForm = document.getElementById('add-to-cart-form');
    const paymentForm = document.getElementById('payment-form');
    const addBookForm = document.getElementById('add-book-form');
    const accountSettingsForm = document.getElementById('account-settings-form');

    // Handle login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const username = event.target.username.value;
            const password = event.target.password.value;

            fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    window.location.href = '/';
                } else {
                    alert('Login failed: ' + data.message);
                }
            })
            .catch(error => console.error('Error:', error));
        });
    }

    // Handle registration form submission
    if (registerForm) {
        registerForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const username = event.target['new-username'].value;
            const password = event.target['new-password'].value;
            const address = event.target['address'].value;
            const role = event.target.role.value;

            fetch('/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password, address, role })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    window.location.href = '/login';
                } else {
                    alert('Registration failed: ' + data.message);
                }
            })
            .catch(error => console.error('Error:', error));
        });
    }

    // Handle add to cart form submission
    if (addToCartForm) {
        addToCartForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const bookId = addToCartForm.dataset.bookId;
            const quantity = event.target.quantity.value;

            fetch(`/add_to_cart/${bookId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ quantity })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Added to cart');
                } else {
                    alert('Failed to add to cart: ' + data.message);
                }
            })
            .catch(error => console.error('Error:', error));
        });
    }

    // Handle payment form submission
    if (paymentForm) {
        paymentForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const paymentMethod = event.target['payment-method'].value;

            fetch('/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ paymentMethod })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    window.location.href = '/account';
                } else {
                    alert('Checkout failed: ' + data.message);
                }
            })
            .catch(error => console.error('Error:', error));
        });
    }

    // Handle add book form submission (admin)
    if (addBookForm) {
        addBookForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const title = event.target.title.value;
            const author = event.target.author.value;
            const price = event.target.price.value;
            const genre = event.target.genre.value;
            const imageUrl = event.target.image_url.value;

            fetch('/manage_books', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title, author, price, genre, imageUrl })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Book added successfully');
                    window.location.reload();
                } else {
                    alert('Failed to add book: ' + data.message);
                }
            })
            .catch(error => console.error('Error:', error));
        });
    }

    // Handle account settings form submission
    if (accountSettingsForm) {
        accountSettingsForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const username = event.target.username.value;
            const address = event.target.address.value;

            fetch('/update_account', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, address })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Account updated successfully');
                    window.location.reload();
                } else {
                    alert('Account update failed: ' + data.message);
                }
            })
            .catch(error => console.error('Error:', error));
        });
    }

    // Handle remove from wishlist form submission
    document.querySelectorAll('.remove-from-wishlist-form').forEach(form => {
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            const itemId = form.dataset.itemId;

            fetch(`/remove_from_wishlist/${itemId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Item removed from wishlist');
                    window.location.reload();
                } else {
                    alert('Failed to remove item from wishlist: ' + data.message);
                }
            })
            .catch(error => console.error('Error:', error));
        });
    });
});
