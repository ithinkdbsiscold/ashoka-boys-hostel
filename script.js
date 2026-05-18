document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    lucide.createIcons();

    // Track mouse position for card hover effects
    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Update mouse position for cards
        document.querySelectorAll('.facility-card, .pricing-card').forEach(card => {
            const rect = card.getBoundingClientRect();
            const x = mouseX - rect.left;
            const y = mouseY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // 1. Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Mobile Menu Toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navRight = document.querySelector('.nav-right');

    if (mobileMenuToggle && navRight) {
        mobileMenuToggle.addEventListener('click', () => {
            navRight.classList.toggle('active');
        });
    }

    // 3. Scroll Animations (Intersection Observer)
    const fadeElements = document.querySelectorAll('.section-fade-in');
    
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop observing once faded in
                // fadeObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });

    fadeElements.forEach(element => {
        fadeObserver.observe(element);
    });

    // Trigger visible class for elements already in viewport on load
    setTimeout(() => {
        fadeElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            if (rect.top < window.innerHeight) {
                element.classList.add('visible');
            }
        });
    }, 100);

    // 4. Image Carousel
    const track = document.getElementById('carouselTrack');
    const slides = Array.from(track.children);
    const nextButton = document.getElementById('nextBtn');
    const prevButton = document.getElementById('prevBtn');
    
    let currentIndex = 0;
    
    // Automatically transition to next slide every 5 seconds
    let autoSlideInterval = setInterval(moveToNextSlide, 5000);

    function updateCarouselPosition() {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    function moveToNextSlide() {
        currentIndex = (currentIndex + 1) % slides.length;
        updateCarouselPosition();
        resetAutoSlide();
    }

    function moveToPrevSlide() {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateCarouselPosition();
        resetAutoSlide();
    }

    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        autoSlideInterval = setInterval(moveToNextSlide, 5000);
    }

    if (nextButton && prevButton && track) {
        nextButton.addEventListener('click', moveToNextSlide);
        prevButton.addEventListener('click', moveToPrevSlide);
        
        // Pause auto-slide on hover
        track.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
        track.addEventListener('mouseleave', resetAutoSlide);
    }
    
    // 5. Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            // Close mobile menu if open
            if (navRight && navRight.classList.contains('active')) {
                navRight.classList.remove('active');
            }

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 6. Scroll indicator smooth scroll
    const scrollIndicator = document.querySelector('.hero-scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const nextSection = document.querySelector('.interior');
            if (nextSection) {
                nextSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // 7. Add subtle parallax to hero section
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        window.addEventListener('scroll', () => {
            const scrollPos = window.scrollY;
            if (scrollPos < window.innerHeight) {
                heroSection.style.backgroundPosition = `center ${scrollPos * 0.5}px`;
            }
        });
    }
});
