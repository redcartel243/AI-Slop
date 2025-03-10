/**
 * AI Slop - Animation JavaScript
 * Gaming-inspired animations for a futuristic AI experience
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize particle animation
    initParticles();
    
    // Initialize typing animation
    initTypingAnimation();
    
    // Initialize 3D tilt effect
    initTiltEffect();
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Initialize floating elements
    initFloatingElements();
});

/**
 * Particle animation for background
 */
function initParticles() {
    const particlesContainer = document.querySelector('.particles-container');
    if (!particlesContainer) return;
    
    const particleCount = 50;
    const colors = ['#4e6ef2', '#7a5af8', '#3a56d4'];
    
    for (let i = 0; i < particleCount; i++) {
        createParticle(particlesContainer, colors);
    }
}

function createParticle(container, colors) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    
    // Random position
    const posX = Math.random() * 100;
    const posY = Math.random() * 100;
    
    // Random size
    const size = Math.random() * 15 + 5;
    
    // Random color
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    // Random opacity
    const opacity = Math.random() * 0.5 + 0.1;
    
    // Set styles
    particle.style.left = `${posX}%`;
    particle.style.top = `${posY}%`;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.backgroundColor = color;
    particle.style.opacity = opacity;
    
    // Add to container
    container.appendChild(particle);
    
    // Animate
    animateParticle(particle);
}

function animateParticle(particle) {
    // Random duration
    const duration = Math.random() * 20 + 10;
    
    // Random direction
    const directionX = Math.random() > 0.5 ? 1 : -1;
    const directionY = Math.random() > 0.5 ? 1 : -1;
    
    // Random distance
    const distanceX = Math.random() * 20 + 10;
    const distanceY = Math.random() * 20 + 10;
    
    // Initial position
    const initialX = parseFloat(particle.style.left);
    const initialY = parseFloat(particle.style.top);
    
    // Animation
    let start = null;
    
    function step(timestamp) {
        if (!start) start = timestamp;
        const progress = (timestamp - start) / (duration * 1000);
        
        if (progress < 1) {
            const x = initialX + Math.sin(progress * 2 * Math.PI) * distanceX * directionX;
            const y = initialY + Math.sin(progress * 2 * Math.PI) * distanceY * directionY;
            
            particle.style.left = `${x}%`;
            particle.style.top = `${y}%`;
            
            requestAnimationFrame(step);
        } else {
            // Reset animation
            start = null;
            requestAnimationFrame(step);
        }
    }
    
    requestAnimationFrame(step);
}

/**
 * Typing animation for text
 */
function initTypingAnimation() {
    const typingElements = document.querySelectorAll('.typing-animation');
    
    typingElements.forEach(element => {
        const text = element.getAttribute('data-text');
        if (!text) return;
        
        element.innerHTML = '';
        let index = 0;
        
        function typeNextChar() {
            if (index < text.length) {
                element.innerHTML += text.charAt(index);
                index++;
                setTimeout(typeNextChar, Math.random() * 100 + 50);
            } else {
                setTimeout(() => {
                    element.innerHTML = '';
                    index = 0;
                    typeNextChar();
                }, 3000);
            }
        }
        
        typeNextChar();
    });
}

/**
 * 3D tilt effect for cards
 */
function initTiltEffect() {
    const cards = document.querySelectorAll('.tilt-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const angleX = (y - centerY) / 20;
            const angleY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    });
}

/**
 * Scroll animations
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.scroll-animation');
    
    function checkScroll() {
        const windowHeight = window.innerHeight;
        const windowTop = window.scrollY;
        const windowBottom = windowTop + windowHeight;
        
        animatedElements.forEach(element => {
            const elementTop = element.offsetTop;
            const elementBottom = elementTop + element.offsetHeight;
            
            // Check if element is in viewport
            if (elementBottom > windowTop && elementTop < windowBottom) {
                element.classList.add('animated');
            }
        });
    }
    
    // Initial check
    checkScroll();
    
    // Check on scroll
    window.addEventListener('scroll', checkScroll);
}

/**
 * Floating elements animation
 */
function initFloatingElements() {
    const floatingElements = document.querySelectorAll('.floating');
    
    floatingElements.forEach(element => {
        // Random delay
        const delay = Math.random() * 2;
        element.style.animationDelay = `${delay}s`;
    });
}

/**
 * Glitch text effect
 */
function initGlitchEffect() {
    const glitchElements = document.querySelectorAll('.glitch');
    
    glitchElements.forEach(element => {
        const text = element.textContent;
        element.setAttribute('data-text', text);
    });
}

/**
 * Cursor trail effect
 */
function initCursorTrail() {
    const trail = document.createElement('div');
    trail.classList.add('cursor-trail');
    document.body.appendChild(trail);
    
    const trailDots = [];
    const trailDotsCount = 20;
    
    for (let i = 0; i < trailDotsCount; i++) {
        const dot = document.createElement('div');
        dot.classList.add('trail-dot');
        trail.appendChild(dot);
        trailDots.push({
            element: dot,
            x: 0,
            y: 0
        });
    }
    
    document.addEventListener('mousemove', e => {
        // Update first dot position
        trailDots[0].x = e.clientX;
        trailDots[0].y = e.clientY;
        
        // Update trail dots
        for (let i = 1; i < trailDotsCount; i++) {
            const dx = trailDots[i].x - trailDots[i-1].x;
            const dy = trailDots[i].y - trailDots[i-1].y;
            
            trailDots[i].x -= dx * 0.3;
            trailDots[i].y -= dy * 0.3;
        }
        
        // Apply positions
        trailDots.forEach((dot, i) => {
            const size = 20 - i * 0.8;
            const opacity = 1 - (i / trailDotsCount);
            
            dot.element.style.left = `${dot.x}px`;
            dot.element.style.top = `${dot.y}px`;
            dot.element.style.width = `${size}px`;
            dot.element.style.height = `${size}px`;
            dot.element.style.opacity = opacity;
        });
    });
} 