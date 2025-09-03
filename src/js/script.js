// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functions
    initNavbar();
    initScrollAnimations();
    initContactForm();
    initPlanButtons();
    initSmoothScrolling();
    initMobileMenu();
    addResponsiveFeatures();
    
    // Note: TestimonialsManager é inicializado pelo próprio testimonials.js
});

// Navbar functionality
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Active link highlighting
    window.addEventListener('scroll', function() {
        let current = '';
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });
}

// Mobile menu functionality
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');
    const body = document.body;

    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (navMenu.classList.contains('active')) {
            body.style.overflow = 'hidden';
        } else {
            body.style.overflow = '';
        }
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            body.style.overflow = '';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            body.style.overflow = '';
        }
    });

    // Close menu on window resize (if going from mobile to desktop)
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            body.style.overflow = '';
        }
    });
}

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationDelay = '0.2s';
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.section-title, .section-subtitle, .plan-card, .testimonial-card, .about-text, .about-image, .contact-info, .contact-form');
    
    animateElements.forEach(el => {
        observer.observe(el);
    });

    // Counter animation for stats
    const stats = document.querySelectorAll('.stat h3');
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
            }
        });
    }, observerOptions);

    stats.forEach(stat => {
        statsObserver.observe(stat);
    });
}

// Counter animation
function animateCounter(element) {
    const text = element.textContent;
    const number = parseInt(text.replace(/\D/g, ''));
    const suffix = text.replace(/[\d\s]/g, '');
    
    let current = 0;
    const increment = number / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= number) {
            current = number;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current) + suffix;
    }, 30);
}

// Contact form functionality
function initContactForm() {
    const form = document.getElementById('contactForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const name = formData.get('name');
        const email = formData.get('email');
        const phone = formData.get('phone');
        const goal = formData.get('goal');
        const message = formData.get('message');
        
        // Validate form
        if (!name || !email || !goal) {
            showNotification('Por favor, preencha todos os campos obrigatórios.', 'error');
            return;
        }
        
        // Create WhatsApp message
        const whatsappMessage = createWhatsAppMessage(name, email, phone, goal, message);
        
        // Open WhatsApp
        window.open(`https://wa.me/5549991960816?text=${encodeURIComponent(whatsappMessage)}`, '_blank');
        
        // Show success message
        showNotification('Redirecionando para o WhatsApp...', 'success');
        
        // Reset form
        form.reset();
    });
}

// Create WhatsApp message
function createWhatsAppMessage(name, email, phone, goal, message) {
    return `🏋️‍♂️ *Nova solicitação de contato - Treinado Lorenski*

👤 *Nome:* ${name}
📧 *E-mail:* ${email}
${phone ? `📱 *Telefone:* ${phone}` : ''}
🎯 *Objetivo:* ${goal}

💬 *Mensagem:*
${message || 'Gostaria de saber mais sobre os planos de treinamento e nutrição.'}

---
_Mensagem enviada através do site_`;
}

// Plan buttons functionality
function initPlanButtons() {
    const planButtons = document.querySelectorAll('.plan-button');
    
    planButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            const plans = ['Trimestral', 'Semestral', 'Anual'];
            const planName = plans[index] || 'Plano';
            
            const whatsappMessage = `🏋️‍♂️ Olá! Tenho interesse no *Plano ${planName}*.

Gostaria de saber mais detalhes sobre:
• Como funciona o acompanhamento
• Processo de avaliação
• Início do programa

Quando podemos conversar?`;
            
            window.open(`https://wa.me/5549991960816?text=${encodeURIComponent(whatsappMessage)}`, '_blank');
        });
    });
}

// Smooth scrolling
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 1.5rem',
        borderRadius: '10px',
        color: 'white',
        fontWeight: '500',
        zIndex: '10000',
        transform: 'translateX(400px)',
        transition: 'transform 0.3s ease',
        maxWidth: '300px',
        boxShadow: '0 5px 20px rgba(0,0,0,0.2)'
    });
    
    // Set background color based on type
    if (type === 'success') {
        notification.style.background = 'linear-gradient(45deg, #28a745, #20c997)';
    } else if (type === 'error') {
        notification.style.background = 'linear-gradient(45deg, #dc3545, #fd7e14)';
    } else {
        notification.style.background = 'linear-gradient(45deg, #2c5aa0, #28a745)';
    }
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 4000);
}

// Parallax effect for hero section
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const rate = scrolled * -0.5;
    
    if (hero) {
        hero.style.transform = `translateY(${rate}px)`;
    }
});

// Card flip effect enhancement
document.querySelectorAll('.plan-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Testimonials carousel effect (comentado para usar o novo sistema)
function initTestimonialsCarousel() {
    // Sistema agora gerenciado por testimonials.js
    console.log('Sistema de depoimentos carregado via testimonials.js');
}

// Initialize testimonials carousel (desabilitado)
// initTestimonialsCarousel();

// Loading animation
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    
    // Animate hero elements with delay
    const heroElements = document.querySelectorAll('.hero-text, .hero-image, .hero-stats');
    heroElements.forEach((element, index) => {
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 200);
    });
});

// Form validation enhancement
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\d\s\-\(\)\+]+$/;
    return re.test(phone) && phone.length >= 10;
}

// Enhanced form validation
document.getElementById('contactForm').addEventListener('input', function(e) {
    const field = e.target;
    const value = field.value;
    
    // Remove previous validation classes
    field.classList.remove('valid', 'invalid');
    
    // Validate based on field type
    switch(field.type) {
        case 'email':
            if (value && validateEmail(value)) {
                field.classList.add('valid');
            } else if (value) {
                field.classList.add('invalid');
            }
            break;
        case 'tel':
            if (value && validatePhone(value)) {
                field.classList.add('valid');
            } else if (value) {
                field.classList.add('invalid');
            }
            break;
        default:
            if (value.length >= 2) {
                field.classList.add('valid');
            } else if (value) {
                field.classList.add('invalid');
            }
    }
});

// Add CSS for validation states
const style = document.createElement('style');
style.textContent = `
    .form-group input.valid,
    .form-group select.valid,
    .form-group textarea.valid {
        border-color: #28a745;
        box-shadow: 0 0 0 2px rgba(40, 167, 69, 0.2);
    }
    
    .form-group input.invalid,
    .form-group select.invalid,
    .form-group textarea.invalid {
        border-color: #dc3545;
        box-shadow: 0 0 0 2px rgba(220, 53, 69, 0.2);
    }
    
    .hero-text, .hero-image, .hero-stats {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.8s ease;
    }
    
    .loaded .hero-text,
    .loaded .hero-image,
    .loaded .hero-stats {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style);

// Intersection Observer for better performance
const observerCallback = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            observer.unobserve(entry.target);
        }
    });
};

const observer = new IntersectionObserver(observerCallback, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

// Observe all sections for animations
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// WhatsApp floating button pulse animation
setInterval(() => {
    const whatsappButton = document.querySelector('.whatsapp-float');
    if (whatsappButton) {
        whatsappButton.style.animation = 'none';
        setTimeout(() => {
            whatsappButton.style.animation = 'bounce 2s infinite';
        }, 10);
    }
}, 10000); // Pulse every 10 seconds

// Responsive utilities and improvements
function addResponsiveFeatures() {
    // Touch gesture support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    document.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const navMenu = document.querySelector('.nav-menu');
        
        if (touchEndX < touchStartX - swipeThreshold) {
            // Swipe left - close menu if open
            if (navMenu && navMenu.classList.contains('active')) {
                const hamburger = document.querySelector('.hamburger');
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    }
    
    // Detect device orientation change
    window.addEventListener('orientationchange', function() {
        setTimeout(function() {
            // Force a repaint on orientation change
            document.body.style.height = '100.1%';
            setTimeout(function() {
                document.body.style.height = '';
            }, 1);
        }, 100);
    });
    
    // Viewport height fix for mobile browsers
    function setVHProperty() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    setVHProperty();
    window.addEventListener('resize', setVHProperty);
    
    // Smooth scroll polyfill for older browsers
    function smoothScrollTo(target) {
        const element = document.querySelector(target);
        if (element) {
            const headerOffset = 80;
            const elementPosition = element.offsetTop;
            const offsetPosition = elementPosition - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }
    
    // Enhanced form validation for mobile
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            // Add better focus styles for mobile
            input.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
                
                // Scroll into view on mobile to avoid keyboard overlay
                if (window.innerWidth <= 768) {
                    setTimeout(() => {
                        this.scrollIntoView({
                            behavior: 'smooth',
                            block: 'center'
                        });
                    }, 300);
                }
            });
            
            input.addEventListener('blur', function() {
                this.parentElement.classList.remove('focused');
            });
        });
    });
    
    // Lazy loading for images
    function lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
    
    // Performance optimization for scroll events
    let ticking = false;
    
    function optimizedScroll() {
        if (!ticking) {
            requestAnimationFrame(function() {
                // Your scroll code here
                ticking = false;
            });
            ticking = true;
        }
    }
    
    // Initialize lazy loading
    lazyLoadImages();
    
    // Debounced resize handler
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            // Handle resize events after user stops resizing
            const event = new CustomEvent('resizeEnd');
            window.dispatchEvent(event);
        }, 250);
    });
}

// Service Worker registration for better mobile performance (optional)
if ('serviceWorker' in navigator && 'production' === 'production') {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}
