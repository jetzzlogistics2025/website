// Main JavaScript for Jets Logistics

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
        
        // Close mobile menu when clicking on links
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.add('hidden');
            });
        });
    }
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navigation
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Navigation bar scroll effect
    const navbar = document.querySelector('nav');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add/remove background on scroll
        if (scrollTop > 50) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Form submission handling
    const quoteForm = document.getElementById('quote-form');
    if (quoteForm) {
        quoteForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const formObject = {};
            formData.forEach((value, key) => {
                formObject[key] = value;
            });
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Sending...';
            submitBtn.disabled = true;
            
            // Simulate form submission (replace with actual API call)
            setTimeout(() => {
                showNotification('Quote request submitted successfully! We\'ll contact you within 1 hour.', 'success');
                quoteForm.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fadeInUp');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.service-card, .stat-item, .feature-item');
    animateElements.forEach(el => {
        observer.observe(el);
    });
    
    // Counter animation for stats
    const counters = document.querySelectorAll('.stat-number');
    const countObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                countObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => {
        countObserver.observe(counter);
    });
    
    // Phone number formatting
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 6) {
                value = value.replace(/(\d{3})(\d{3})(\d{0,4})/, '($1) $2-$3');
            } else if (value.length >= 3) {
                value = value.replace(/(\d{3})(\d{0,3})/, '($1) $2');
            }
            e.target.value = value;
        });
    });
    
    // Image lazy loading
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('image-loading');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => {
        img.classList.add('image-loading');
        imageObserver.observe(img);
    });
    
    // Click-to-call functionality
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    phoneLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Track phone click for analytics (replace with actual tracking)
            console.log('Phone number clicked:', this.href);
        });
    });
    
    // Scroll to top button
    const scrollTopBtn = createScrollTopButton();
    document.body.appendChild(scrollTopBtn);
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollTopBtn.style.display = 'block';
        } else {
            scrollTopBtn.style.display = 'none';
        }
    });
    
    // Form validation enhancements
    const formInputs = document.querySelectorAll('input[required], select[required], textarea[required]');
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });
    
    // Emergency contact modal (if needed)
    const emergencyBtn = document.querySelector('.emergency-contact');
    if (emergencyBtn) {
        emergencyBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showEmergencyModal();
        });
    }
});

// Utility Functions

function animateCounter(element) {
    const target = parseInt(element.textContent);
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 16);
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg transform translate-x-full transition-transform duration-300 ${
        type === 'success' ? 'bg-green-500 text-white' : 
        type === 'error' ? 'bg-red-500 text-white' : 
        'bg-blue-500 text-white'
    }`;
    
    notification.innerHTML = `
        <div class="flex items-center">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'} mr-2"></i>
            <span>${message}</span>
            <button class="ml-4 text-white hover:text-gray-200" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 300);
    }, 5000);
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Check if required field is empty
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }
    
    // Phone validation
    if (field.type === 'tel' && value) {
        const phoneRegex = /^\(\d{3}\)\s\d{3}-\d{4}$/;
        if (!phoneRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }
    }
    
    // Update field styling
    if (isValid) {
        field.classList.remove('border-red-500', 'error');
        field.classList.add('border-green-500');
        removeErrorMessage(field);
    } else {
        field.classList.remove('border-green-500');
        field.classList.add('border-red-500', 'error');
        showErrorMessage(field, errorMessage);
    }
    
    return isValid;
}

function showErrorMessage(field, message) {
    removeErrorMessage(field);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message text-red-500 text-sm mt-1';
    errorDiv.textContent = message;
    
    field.parentNode.appendChild(errorDiv);
}

function removeErrorMessage(field) {
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
}

function createScrollTopButton() {
    const button = document.createElement('button');
    button.className = 'fixed bottom-6 right-6 bg-jet-red text-white w-12 h-12 rounded-full shadow-lg hover:bg-red-700 transition-all duration-300 z-40';
    button.style.display = 'none';
    button.innerHTML = '<i class="fas fa-arrow-up"></i>';
    
    button.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    return button;
}

function showEmergencyModal() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-lg p-8 max-w-md mx-4">
            <div class="text-center">
                <i class="fas fa-exclamation-triangle text-red-500 text-4xl mb-4"></i>
                <h3 class="text-xl font-bold text-gray-900 mb-4">Emergency Transport</h3>
                <p class="text-gray-600 mb-6">
                    For immediate emergency transport services, please call our 24/7 hotline:
                </p>
                <a href="tel:5551235387" class="inline-block bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors mb-4">
                    <i class="fas fa-phone mr-2"></i>(555) 123-JETS
                </a>
                <p class="text-sm text-gray-500 mb-4">Available 24 hours a day, 7 days a week</p>
                <button onclick="this.closest('.fixed').remove()" class="text-gray-500 hover:text-gray-700">
                    Close
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close on background click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimize scroll events
const optimizedScrollHandler = debounce(() => {
    // Handle scroll events here
}, 10);

window.addEventListener('scroll', optimizedScrollHandler);

// Service Worker registration (for future PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Uncomment when service worker is implemented
        // navigator.serviceWorker.register('/sw.js');
    });
}

// Google Analytics integration (placeholder)
function trackEvent(category, action, label) {
    // Replace with actual analytics tracking
    console.log('Analytics Event:', { category, action, label });
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    // Could send error reports to monitoring service
});

// Preload critical images
function preloadImages() {
    const criticalImages = [
        'images/hotshot_truck_hero.jpg',
        'images/logistics_truck.jpg'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Initialize preloading
preloadImages();