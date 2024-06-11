ddocument.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('newsletter-form');
    const emailInput = document.getElementById('email');
    const errorMessage = document.getElementById('error-message');
    const testimonialsButton = document.getElementById('toggle-testimonials');
    const testimonialsContent = document.querySelector('.testimonial-content');
    const prevButton = document.getElementById('prev');
    const nextButton = document.getElementById('next');
    const carousel = document.querySelector('.carousel');
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const signInRegister = document.getElementById('sign-in-register');
    const modal = document.getElementById('modal');
    const closeButton = document.querySelector('.close-button');
    let carouselIndex = 0;

    if (form) {
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const emailValue = emailInput.value.trim();

            if (!validateEmail(emailValue)) {
                errorMessage.textContent = 'Please enter a valid email address.';
                return;
            }

            errorMessage.textContent = '';
            alert('Subscribed successfully!');
        });
    }

    if (testimonialsButton) {
        testimonialsButton.addEventListener('click', () => {
            if (testimonialsContent.style.display === 'none' || testimonialsContent.style.display === '') {
                testimonialsContent.style.display = 'block';
                testimonialsButton.textContent = 'Hide Testimonials';
            } else {
                testimonialsContent.style.display = 'none';
                testimonialsButton.textContent = 'Show Testimonials';
            }
        });
    }

    if (prevButton && nextButton) {
        prevButton.addEventListener('click', () => {
            if (carouselIndex > 0) {
                carouselIndex--;
                updateCarousel();
            }
        });

        nextButton.addEventListener('click', () => {
            if (carouselIndex < carousel.children.length - 1) {
                carouselIndex++;
                updateCarousel();
            }
        });

        function updateCarousel() {
            const offset = -carouselIndex * 100;
            carousel.style.transform = `translateX(${offset}%)`;
        }
    }

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('open');
        });
    }

    if (signInRegister) {
        signInRegister.addEventListener('click', (event) => {
            event.preventDefault();
            modal.style.display = 'block';
        });
    }

    if (closeButton) {
        closeButton.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }
});