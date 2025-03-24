// Utility Functions
const elementExists = (id) => document.getElementById(id) !== null;
const isMobile = () => window.innerWidth <= 768;

// Mobile Menu
const initMobileMenu = () => {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    const body = document.body;

    if (!mobileMenuBtn || !navLinks) return;

    const toggleMenu = (show) => {
        mobileMenuBtn.classList.toggle('active', show);
        navLinks.classList.toggle('active', show);
        body.style.overflow = show ? 'hidden' : '';
    };

    mobileMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isActive = navLinks.classList.contains('active');
        toggleMenu(!isActive);
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.navbar-content') && navLinks.classList.contains('active')) {
            toggleMenu(false);
        }
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => toggleMenu(false));
    });
};

// Testimonials Slider
class TestimonialSlider {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.slides = this.container.querySelectorAll('.testimonial');
        if (this.slides.length <= 1) return;

        this.currentSlide = 0;
        this.total = this.slides.length;
        this.interval = null;
        this.isHovered = false;

        this.init();
    }

    init() {
        this.createNavigation();
        this.showSlide(0);
        this.startAutoPlay();
        this.handleHover();
    }

    createNavigation() {
        const nav = document.createElement('div');
        nav.className = 'testimonial-nav';
        
        const dots = document.createElement('div');
        dots.className = 'testimonial-dots';
        
        for (let i = 0; i < this.total; i++) {
            const dot = document.createElement('button');
            dot.className = 'testimonial-dot';
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            dot.addEventListener('click', () => this.goToSlide(i));
            dots.appendChild(dot);
        }
        
        nav.appendChild(dots);
        this.container.appendChild(nav);
        this.dots = dots.children;
    }

    showSlide(index) {
        this.slides.forEach((slide, i) => {
            slide.style.display = i === index ? 'block' : 'none';
            if (this.dots) {
                this.dots[i].classList.toggle('active', i === index);
            }
        });
        this.currentSlide = index;
    }

    goToSlide(index) {
        this.showSlide(index);
        this.resetAutoPlay();
    }

    startAutoPlay() {
        this.interval = setInterval(() => {
            if (!this.isHovered) {
                this.showSlide((this.currentSlide + 1) % this.total);
            }
        }, 5000);
    }

    resetAutoPlay() {
        clearInterval(this.interval);
        this.startAutoPlay();
    }

    handleHover() {
        this.container.addEventListener('mouseenter', () => {
            this.isHovered = true;
        });

        this.container.addEventListener('mouseleave', () => {
            this.isHovered = false;
        });
    }
}

// Initialize FAQ Accordion
const initFaqAccordion = () => {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            // Close all other items
            faqQuestions.forEach(item => {
                if (item !== question) {
                    item.classList.remove('active');
                    const answer = item.nextElementSibling;
                    answer.style.maxHeight = null;
                }
            });
            
            // Toggle current item
            question.classList.toggle('active');
            const answer = question.nextElementSibling;
            
            if (question.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
            } else {
                answer.style.maxHeight = null;
            }
        });
    });
};

// Initialize scroll animations
const initScrollAnimations = () => {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                }
            });
        },
        {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        }
    );

    document.querySelectorAll('.fade-in-section').forEach(section => {
        observer.observe(section);
    });
};

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    new TestimonialSlider('testimonialSlider');
    initFaqAccordion();
    initScrollAnimations();

    // Update copyright year
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // Form submission handler
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            // In production, remove this preventDefault and let the form submit to the server
            // This is just for demo purposes
            e.preventDefault();
            alert('Thank you for your inquiry! We will contact you shortly.');
            this.reset();
        });
    }
});

// Handle window resize events
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        if (isMobile()) {
            document.body.style.overflow = '';
        }
    }, 250);
});
