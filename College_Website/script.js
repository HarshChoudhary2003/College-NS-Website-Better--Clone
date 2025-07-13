document.addEventListener('DOMContentLoaded', () => {
    // --- Image Slider ---
    const sliderImages = document.querySelectorAll('.slider-img');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    let slideInterval;

    function showSlide(index) {
        sliderImages.forEach((img, i) => {
            img.classList.remove('active');
            dots[i].classList.remove('active');
        });
        sliderImages[index].classList.add('active');
        dots[index].classList.add('active');
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % sliderImages.length;
        showSlide(currentSlide);
    }

    function startSlider() {
        // Show the first slide immediately on load
        showSlide(currentSlide);
        slideInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
    }

    function stopSlider() {
        clearInterval(slideInterval);
    }

    // Dot navigation
    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            stopSlider(); // Stop auto-slide when manual navigation
            currentSlide = parseInt(e.target.dataset.dotId) - 1;
            showSlide(currentSlide);
            startSlider(); // Restart auto-slide after a brief pause (optional)
        });
    });

    // Start the slider when the page loads
    startSlider();


    // --- Mobile Menu Toggle ---
    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.querySelector('.nav-list');

    menuToggle.addEventListener('click', () => {
        navList.classList.toggle('active');
        // Change icon based on state
        const icon = menuToggle.querySelector('i');
        if (navList.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times'); // 'X' icon
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars'); // Hamburger icon
        }
    });

    // Close mobile menu when a link is clicked (optional)
    navList.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (navList.classList.contains('active')) {
                navList.classList.remove('active');
                menuToggle.querySelector('i').classList.remove('fa-times');
                menuToggle.querySelector('i').classList.add('fa-bars');
            }
        });
    });

    // Optional: Close menu if user clicks outside of it
    document.addEventListener('click', (event) => {
        if (!navList.contains(event.target) && !menuToggle.contains(event.target) && navList.classList.contains('active')) {
            navList.classList.remove('active');
            menuToggle.querySelector('i').classList.remove('fa-times');
            menuToggle.querySelector('i').classList.add('fa-bars');
        }
    });

    // --- Dynamic Year in Footer (Bonus) ---
    const footerYear = document.querySelector('.footer-bottom p');
    if (footerYear) {
        const currentYear = new Date().getFullYear();
        footerYear.innerHTML = `&copy; ${currentYear} Govt. Degree College Nagrota Surian. All rights reserved.`;
    }
});
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.querySelector('.nav-list');

    if (menuToggle && navList) {
        menuToggle.addEventListener('click', function() {
            navList.classList.toggle('active');
            menuToggle.querySelector('i').classList.toggle('fa-bars');
            menuToggle.querySelector('i').classList.toggle('fa-times');
        });
    }

    // Hero Section Slider (New JavaScript)
    const slides = document.querySelectorAll('.slider-item');
    const dots = document.querySelectorAll('.slider-dots .dot');
    const prevBtn = document.querySelector('.slider-nav .prev');
    const nextBtn = document.querySelector('.slider-nav .next');
    let currentSlide = 0;
    let slideInterval;

    function showSlide(index) {
        // Hide all slides and remove active class from dots
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        // Show the current slide and activate the corresponding dot
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        currentSlide = index;
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }

    function startSlider() {
        slideInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
    }

    function stopSlider() {
        clearInterval(slideInterval);
    }

    // Event Listeners for navigation buttons
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            stopSlider();
            nextSlide();
            startSlider(); // Restart timer
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            stopSlider();
            prevSlide();
            startSlider(); // Restart timer
        });
    }

    // Event Listeners for dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            stopSlider();
            showSlide(index);
            startSlider(); // Restart timer
        });
    });

    // Initialize slider
    if (slides.length > 0) {
        showSlide(currentSlide);
        startSlider();
    }

    // Pause slider on hover
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        heroSection.addEventListener('mouseenter', stopSlider);
        heroSection.addEventListener('mouseleave', startSlider);
    }
});