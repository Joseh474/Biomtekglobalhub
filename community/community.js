document.addEventListener('DOMContentLoaded', function() {
    // Menu Toggle
    const menuIcon = document.getElementById('menu-icon');
    const navlist = document.querySelector('.navlist');

    menuIcon.addEventListener('click', () => {
        navlist.classList.toggle('active');
        menuIcon.classList.toggle('bx-x');
    });

    // Enhanced Image Gallery
    let currentSlide = 0;
    const slides = document.querySelectorAll('.gallery-image');
    const dots = document.querySelector('.gallery-dots');
    let autoScrollInterval;
    let touchStartX = 0;
    let touchEndX = 0;

    // Create dots
    slides.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        dot.addEventListener('click', () => showSlide(index));
        dots.appendChild(dot);
    });

    function showSlide(n) {
        // Reset auto-scroll timer
        clearInterval(autoScrollInterval);
        startAutoScroll();

        slides.forEach(slide => {
            slide.style.opacity = '0';
            slide.classList.remove('active');
        });
        const dots = document.querySelectorAll('.dot');
        dots.forEach(dot => dot.classList.remove('active'));

        currentSlide = (n + slides.length) % slides.length;
        slides[currentSlide].style.opacity = '1';
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    window.moveSlide = function(n) {
        showSlide(currentSlide + n);
    };

    function startAutoScroll() {
        autoScrollInterval = setInterval(() => moveSlide(1), 5000);
    }

    // Touch events for mobile swipe
    const galleryContainer = document.querySelector('.gallery-container');
    
    galleryContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    });

    galleryContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].clientX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50; // minimum distance for swipe
        const swipeDistance = touchEndX - touchStartX;
        
        if (Math.abs(swipeDistance) > swipeThreshold) {
            if (swipeDistance > 0) {
                // Swipe right
                moveSlide(-1);
            } else {
                // Swipe left
                moveSlide(1);
            }
        }
    }

    // Mouse drag functionality
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;

    galleryContainer.addEventListener('mousedown', (e) => {
        isDragging = true;
        startPos = e.clientX;
        galleryContainer.style.cursor = 'grabbing';
    });

    galleryContainer.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const currentPosition = e.clientX;
        const diff = currentPosition - startPos;
        
        if (Math.abs(diff) > 50) {
            isDragging = false;
            galleryContainer.style.cursor = 'grab';
            if (diff > 0) {
                moveSlide(-1);
            } else {
                moveSlide(1);
            }
        }
    });

    galleryContainer.addEventListener('mouseup', () => {
        isDragging = false;
        galleryContainer.style.cursor = 'grab';
    });

    galleryContainer.addEventListener('mouseleave', () => {
        isDragging = false;
        galleryContainer.style.cursor = 'grab';
    });

    // Prevent context menu on right click
    galleryContainer.addEventListener('contextmenu', (e) => e.preventDefault());

    // Initialize
    showSlide(0);
    startAutoScroll();

    // Scroll Reveal Animation
    const reveals = document.querySelectorAll('.reveal');
    
    function reveal() {
        reveals.forEach(element => {
            const windowHeight = window.innerHeight;
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;

            if (elementTop < windowHeight - elementVisible) {
                element.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', reveal);
    reveal();

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});
