/* ============================================================
   ASHOKA BOYS HOSTEL — Visual Overhaul Script
   Dark Mode | Preloader | Parallax | Carousel | Counters
   Back-to-Top | Cursor Glow | Reveal Animations | 3D Tilt
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    lucide.createIcons();

    // ==========================================
    // 1. DARK MODE TOGGLE
    // ==========================================
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;

    function getPreferredTheme() {
        const saved = localStorage.getItem('theme');
        if (saved) return saved;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    function applyTheme(theme) {
        html.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }

    // Apply on load
    applyTheme(getPreferredTheme());

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const current = html.getAttribute('data-theme');
            const next = current === 'dark' ? 'light' : 'dark';
            applyTheme(next);
        });
    }

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            applyTheme(e.matches ? 'dark' : 'light');
        }
    });

    // ==========================================
    // 2. PRELOADER
    // ==========================================
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.classList.add('hidden');
            }, 500);
        });
        // Fallback: hide after 3s even if load event doesn't fire
        setTimeout(() => {
            preloader.classList.add('hidden');
        }, 3000);
    }

    // ==========================================
    // 3. NAVBAR SCROLL EFFECT
    // ==========================================
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ==========================================
    // 4. MOBILE MENU TOGGLE
    // ==========================================
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navRight = document.querySelector('.nav-right');

    if (mobileMenuToggle && navRight) {
        mobileMenuToggle.addEventListener('click', () => {
            navRight.classList.toggle('active');
        });
    }

    // ==========================================
    // 5. PARALLAX SCROLLING (Hero)
    // ==========================================
    const heroBgLayer = document.querySelector('.hero-bg-layer');
    const heroContent = document.querySelector('.hero-content');
    let parallaxTicking = false;

    function updateParallax() {
        const scrollY = window.scrollY;
        const hero = document.getElementById('hero');
        if (!hero) return;

        const heroHeight = hero.offsetHeight;
        const heroTop = hero.offsetTop;

        // Only apply when hero is visible
        if (scrollY < heroHeight) {
            if (heroBgLayer) {
                const offset = scrollY * 0.3;
                heroBgLayer.style.transform = `translateY(${offset}px)`;
            }
            if (heroContent) {
                const offset = scrollY * 0.1;
                heroContent.style.transform = `translateY(${offset}px)`;
            }
        }
        parallaxTicking = false;
    }

    window.addEventListener('scroll', () => {
        if (!parallaxTicking) {
            requestAnimationFrame(updateParallax);
            parallaxTicking = true;
        }
    });

    // ==========================================
    // 6. IMAGE CAROUSEL (Upgraded)
    // ==========================================
    const track = document.getElementById('carouselTrack');
    const nextButton = document.getElementById('nextBtn');
    const prevButton = document.getElementById('prevBtn');
    const carouselContainer = document.querySelector('.carousel-container');
    const dotsContainer = document.getElementById('carouselDots');
    const progressBar = document.getElementById('carouselProgressBar');

    let currentIndex = 0;
    let slides = [];
    let autoSlideInterval = null;
    let progressInterval = null;
    let progressStartTime = null;
    const autoSlideDuration = 5000;

    if (track) {
        slides = Array.from(track.children);

        function updateCarouselPosition() {
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
            updateDots();
            resetKenBurns();
            resetProgress();
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

        function goToSlide(index) {
            currentIndex = index;
            updateCarouselPosition();
            resetAutoSlide();
        }

        function resetKenBurns() {
            slides.forEach((slide, i) => {
                const img = slide.querySelector('img');
                if (img) {
                    if (i === currentIndex) {
                        img.style.animation = 'none';
                        img.offsetHeight; // trigger reflow
                        img.style.animation = 'kenBurns 5s ease-in-out forwards';
                    } else {
                        img.style.animation = 'none';
                    }
                }
            });
        }

        // Dots
        function createDots() {
            if (!dotsContainer) return;
            dotsContainer.innerHTML = '';
            slides.forEach((_, i) => {
                const dot = document.createElement('button');
                dot.classList.add('dot');
                if (i === currentIndex) dot.classList.add('active');
                dot.setAttribute('data-index', i);
                dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
                dot.addEventListener('click', () => goToSlide(i));
                dotsContainer.appendChild(dot);
            });
        }

        function updateDots() {
            if (!dotsContainer) return;
            const dots = dotsContainer.querySelectorAll('.dot');
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
        }

        // Progress Bar
        function resetProgress() {
            progressStartTime = Date.now();
            if (progressBar) {
                progressBar.style.transition = 'none';
                progressBar.style.width = '0%';
                progressBar.offsetHeight; // trigger reflow
                progressBar.style.transition = `width ${autoSlideDuration}ms linear`;
                progressBar.style.width = '100%';
            }
        }

        function resetAutoSlide() {
            clearInterval(autoSlideInterval);
            autoSlideInterval = setInterval(moveToNextSlide, autoSlideDuration);
            resetProgress();
        }

        // Pause on hover
        if (carouselContainer) {
            carouselContainer.addEventListener('mouseenter', () => {
                clearInterval(autoSlideInterval);
                if (progressBar) {
                    const elapsed = Date.now() - progressStartTime;
                    const remaining = Math.max(0, autoSlideDuration - elapsed);
                    const currentWidth = Math.min(100, (elapsed / autoSlideDuration) * 100);
                    progressBar.style.transition = 'none';
                    progressBar.style.width = currentWidth + '%';
                }
            });

            carouselContainer.addEventListener('mouseleave', () => {
                autoSlideInterval = setInterval(moveToNextSlide, autoSlideDuration);
                if (progressBar) {
                    const elapsed = Date.now() - progressStartTime;
                    const remaining = Math.max(0, autoSlideDuration - elapsed);
                    progressBar.style.transition = `width ${remaining}ms linear`;
                    progressBar.style.width = '100%';
                }
            });
        }

        // Swipe support
        let touchStartX = 0;
        let touchEndX = 0;

        if (track) {
            track.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });

            track.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                const diff = touchStartX - touchEndX;
                if (Math.abs(diff) > 50) {
                    if (diff > 0) {
                        moveToNextSlide();
                    } else {
                        moveToPrevSlide();
                    }
                }
            });
        }

        // Button listeners
        if (nextButton) nextButton.addEventListener('click', moveToNextSlide);
        if (prevButton) prevButton.addEventListener('click', moveToPrevSlide);

        // Initialize
        createDots();
        resetAutoSlide();
    }

    // ==========================================
    // 7. STATS COUNTER
    // ==========================================
    const statNumbers = document.querySelectorAll('.stat-number');
    const statsSection = document.querySelector('.stats-section');

    function animateCounter(el, target, duration) {
        const start = 0;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(start + (target - start) * eased);

            if (el.dataset.suffix) {
                el.textContent = current + el.dataset.suffix;
            } else if (el.dataset.prefix) {
                el.textContent = el.dataset.prefix + current;
            } else {
                el.textContent = current;
            }

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                // Final value
                if (el.dataset.suffix) {
                    el.textContent = target + el.dataset.suffix;
                } else if (el.dataset.prefix) {
                    el.textContent = el.dataset.prefix + target;
                } else {
                    el.textContent = target;
                }
            }
        }

        requestAnimationFrame(update);
    }

    if (statsSection && statNumbers.length > 0) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    statNumbers.forEach(el => {
                        const target = parseInt(el.dataset.target, 10);
                        if (target) {
                            animateCounter(el, target, 2000);
                        }
                    });
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statsObserver.observe(statsSection);
    }

    // ==========================================
    // 8. BACK-TO-TOP BUTTON
    // ==========================================
    const backToTop = document.getElementById('backToTop');
    const progressRingFill = document.querySelector('.progress-ring-fill');

    if (backToTop) {
        const ringCircumference = 2 * Math.PI * 25; // r=25

        if (progressRingFill) {
            progressRingFill.style.strokeDasharray = ringCircumference;
            progressRingFill.style.strokeDashoffset = ringCircumference;
        }

        function updateBackToTop() {
            const scrollY = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = docHeight > 0 ? scrollY / docHeight : 0;

            // Visibility
            if (scrollY > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }

            // Progress ring
            if (progressRingFill) {
                const offset = ringCircumference - (scrollPercent * ringCircumference);
                progressRingFill.style.strokeDashoffset = offset;
            }
        }

        window.addEventListener('scroll', updateBackToTop);

        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        // Initial check
        updateBackToTop();
    }

    // ==========================================
    // 9. CURSOR GLOW EFFECT (Desktop only)
    // ==========================================
    const cursorGlow = document.getElementById('cursorGlow');
    const isMobile = window.matchMedia('(max-width: 1024px)').matches;

    if (cursorGlow && !isMobile) {
        let cursorTimeout;

        document.addEventListener('mousemove', (e) => {
            cursorGlow.style.setProperty('--cursor-x', e.clientX + 'px');
            cursorGlow.style.setProperty('--cursor-y', e.clientY + 'px');
            cursorGlow.classList.add('active');

            clearTimeout(cursorTimeout);
            cursorTimeout = setTimeout(() => {
                cursorGlow.classList.remove('active');
            }, 2000);
        });

        document.addEventListener('mouseleave', () => {
            cursorGlow.classList.remove('active');
        });
    }

    // ==========================================
    // 10. SCROLL-TRIGGERED REVEAL ANIMATIONS
    // ==========================================
    const revealElements = document.querySelectorAll(
        '.reveal-fade-up, .reveal-scale-in, .reveal-slide-left, .reveal-slide-right, .section-fade-in'
    );

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // Stagger children
    const staggerContainers = document.querySelectorAll('.reveal-stagger');
    const staggerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const children = entry.target.children;
                Array.from(children).forEach((child, i) => {
                    child.style.setProperty('--stagger-index', i);
                    child.style.transitionDelay = `${i * 100}ms`;
                    child.classList.add('revealed');
                });
                staggerObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    staggerContainers.forEach(el => staggerObserver.observe(el));

    // Trigger visible for elements already in viewport on load
    setTimeout(() => {
        revealElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight) {
                el.classList.add('revealed');
                el.classList.add('visible');
            }
        });
    }, 100);

    // ==========================================
    // 11. 3D TILT EFFECT (Pricing Cards)
    // ==========================================
    const tiltCards = document.querySelectorAll('.pricing-card');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -5; // max 5deg
            const rotateY = ((x - centerX) / centerX) * 5;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });

        // Reset transform on touch devices
        card.addEventListener('touchstart', () => {
            card.style.transform = '';
        });
    });

    // ==========================================
    // 12. SMOOTH SCROLL FOR ANCHOR LINKS
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

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
});
