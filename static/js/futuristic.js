/**
 * AI Slop - Futuristic Animations
 * Advanced sci-fi inspired animations and interactive effects
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all futuristic animations
    initDataStream();
    initHologramEffect();
    initScannerEffect();
    initTerminalText();
    initHexGrid();
    init3DParallax();
    initGlitchEffect();
    initTesseract();
});

/**
 * Creates a data stream animation with falling characters
 */
function initDataStream() {
    const dataStreamContainers = document.querySelectorAll('.data-stream');
    
    if (dataStreamContainers.length === 0) return;
    
    const characters = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const streamCount = 20;
    
    dataStreamContainers.forEach(container => {
        // Clear any existing spans
        container.innerHTML = '';
        
        // Create streams
        for (let i = 0; i < streamCount; i++) {
            const stream = document.createElement('span');
            
            // Random position
            const posX = Math.random() * 100;
            const delay = Math.random() * 5;
            const duration = Math.random() * 10 + 10;
            
            // Random text
            let text = '';
            const length = Math.floor(Math.random() * 20) + 5;
            for (let j = 0; j < length; j++) {
                text += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            
            // Set properties
            stream.textContent = text;
            stream.style.left = `${posX}%`;
            stream.style.animationDuration = `${duration}s`;
            stream.style.animationDelay = `${delay}s`;
            
            container.appendChild(stream);
        }
    });
}

/**
 * Adds hologram effect to elements
 */
function initHologramEffect() {
    const hologramElements = document.querySelectorAll('.hologram');
    
    if (hologramElements.length === 0) return;
    
    // Add flicker effect
    hologramElements.forEach(element => {
        // Random flicker timing
        const flickerDelay = Math.random() * 2;
        element.style.animationDelay = `${flickerDelay}s`;
        
        // Add scan line effect
        const scanLine = document.createElement('div');
        scanLine.classList.add('hologram-scan-line');
        element.appendChild(scanLine);
    });
}

/**
 * Adds scanner effect to elements
 */
function initScannerEffect() {
    const scannerElements = document.querySelectorAll('.scanner');
    
    if (scannerElements.length === 0) return;
    
    scannerElements.forEach(element => {
        // Random scan timing
        const scanDelay = Math.random() * 3;
        const scanDuration = Math.random() * 2 + 2;
        
        element.style.setProperty('--scan-delay', `${scanDelay}s`);
        element.style.setProperty('--scan-duration', `${scanDuration}s`);
    });
}

/**
 * Creates terminal text typing effect
 */
function initTerminalText() {
    const terminalElements = document.querySelectorAll('.terminal-text');
    
    if (terminalElements.length === 0) return;
    
    terminalElements.forEach(element => {
        const text = element.getAttribute('data-text') || element.textContent;
        element.textContent = '';
        element.setAttribute('data-text', text);
        
        let index = 0;
        const typeSpeed = 50; // ms per character
        
        function typeNextChar() {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                index++;
                setTimeout(typeNextChar, Math.random() * 100 + typeSpeed);
            } else {
                // Add blinking cursor
                const cursor = document.createElement('span');
                cursor.classList.add('terminal-cursor');
                cursor.textContent = '|';
                element.appendChild(cursor);
            }
        }
        
        // Start typing with a delay
        setTimeout(typeNextChar, 500);
    });
}

/**
 * Creates a hexagonal grid background
 */
function initHexGrid() {
    const hexGridContainers = document.querySelectorAll('.hex-grid');
    
    if (hexGridContainers.length === 0) return;
    
    // The grid is created using CSS background, but we can add some animation
    hexGridContainers.forEach(container => {
        // Add subtle pulse animation
        container.style.animation = 'hex-pulse 4s ease-in-out infinite';
    });
}

/**
 * Adds 3D parallax effect to elements
 * Modified to fix scrolling issues and enhance tesseract interaction
 */
function init3DParallax() {
    const parallaxContainers = document.querySelectorAll('.parallax-container');
    
    if (parallaxContainers.length === 0) return;
    
    parallaxContainers.forEach(container => {
        const parallaxElements = container.querySelectorAll('.parallax-element');
        
        // Track mouse movement only within the container
        container.addEventListener('mousemove', e => {
            // Only apply effect if we have parallax elements
            if (parallaxElements.length === 0) return;
            
            const rect = container.getBoundingClientRect();
            
            // Check if mouse is within the container bounds
            if (e.clientX < rect.left || e.clientX > rect.right || 
                e.clientY < rect.top || e.clientY > rect.bottom) {
                return;
            }
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            
            const offsetX = (mouseX - centerX) / centerX;
            const offsetY = (mouseY - centerY) / centerY;
            
            // Apply parallax to each element with limited movement
            parallaxElements.forEach(element => {
                const depth = parseFloat(element.getAttribute('data-depth')) || 10;
                // Limit the maximum movement to prevent excessive translation
                const maxMovement = 20;
                const translateX = Math.max(Math.min(offsetX * depth, maxMovement), -maxMovement);
                const translateY = Math.max(Math.min(offsetY * depth, maxMovement), -maxMovement);
                
                // Use transform without affecting layout
                element.style.transform = `translate3d(${translateX}px, ${translateY}px, 0) rotate3d(${-offsetY}, ${offsetX}, 0, 5deg)`;
            });
        });
        
        // Reset on mouse leave
        container.addEventListener('mouseleave', () => {
            parallaxElements.forEach(element => {
                // Smoothly reset to original position
                element.style.transition = 'transform 0.5s ease-out';
                element.style.transform = 'translate3d(0, 0, 0) rotate3d(0, 0, 0, 0deg)';
                
                // Remove transition after animation completes
                setTimeout(() => {
                    element.style.transition = '';
                }, 500);
            });
        });
    });
    
    // Ensure the effect doesn't interfere with scrolling
    document.addEventListener('scroll', () => {
        // Allow normal scrolling behavior
        document.body.style.overflow = 'auto';
    });
}

/**
 * Initialize tesseract animation and interaction
 */
function initTesseract() {
    const tesseractContainers = document.querySelectorAll('.ar-frame.scanner');
    
    if (tesseractContainers.length === 0) return;
    
    tesseractContainers.forEach(container => {
        // Add interactive rotation to tesseract
        container.addEventListener('mousemove', e => {
            const rect = container.getBoundingClientRect();
            
            // Check if mouse is within the container bounds
            if (e.clientX < rect.left || e.clientX > rect.right || 
                e.clientY < rect.top || e.clientY > rect.bottom) {
                return;
            }
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            
            const rotateX = ((mouseY - centerY) / centerY) * 15;
            const rotateY = ((mouseX - centerX) / centerX) * 15;
            
            // Apply rotation to the image
            const image = container.querySelector('img');
            if (image) {
                image.style.transition = 'transform 0.1s ease-out';
                image.style.transform = `rotateX(${-rotateX}deg) rotateY(${rotateY}deg)`;
            }
        });
        
        // Reset on mouse leave
        container.addEventListener('mouseleave', () => {
            const image = container.querySelector('img');
            if (image) {
                image.style.transition = 'transform 0.5s ease-out';
                image.style.transform = 'rotateX(0deg) rotateY(0deg)';
            }
        });
        
        // Add glow effect on hover
        container.addEventListener('mouseenter', () => {
            container.classList.add('tesseract-hover');
        });
        
        container.addEventListener('mouseleave', () => {
            container.classList.remove('tesseract-hover');
        });
    });
}

/**
 * Adds glitch effect to elements
 */
function initGlitchEffect() {
    const glitchElements = document.querySelectorAll('.cyber-glitch');
    
    if (glitchElements.length === 0) return;
    
    glitchElements.forEach(element => {
        const text = element.textContent;
        element.setAttribute('data-text', text);
        
        // Create glitch layers
        const before = document.createElement('span');
        before.classList.add('glitch-before');
        before.textContent = text;
        
        const after = document.createElement('span');
        after.classList.add('glitch-after');
        after.textContent = text;
        
        // Clear and append
        element.innerHTML = '';
        element.appendChild(before);
        element.appendChild(document.createTextNode(text));
        element.appendChild(after);
        
        // Random glitch timing
        setInterval(() => {
            if (Math.random() > 0.9) {
                before.style.transform = `translate(${Math.random() * 5 - 2.5}px, ${Math.random() * 5 - 2.5}px)`;
                after.style.transform = `translate(${Math.random() * 5 - 2.5}px, ${Math.random() * 5 - 2.5}px)`;
                
                setTimeout(() => {
                    before.style.transform = 'translate(0, 0)';
                    after.style.transform = 'translate(0, 0)';
                }, 100);
            }
        }, 1000);
    });
}

/**
 * Creates a digital rain effect in the specified container
 */
function createDigitalRain(container) {
    if (!container) return;
    
    const canvas = document.createElement('canvas');
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.zIndex = '0';
    canvas.style.opacity = '0.3';
    canvas.style.pointerEvents = 'none';
    
    container.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    
    // Characters to display
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    
    // Column settings
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    
    // Drops - one per column
    const drops = [];
    for (let i = 0; i < columns; i++) {
        drops[i] = Math.floor(Math.random() * -canvas.height / fontSize);
    }
    
    // Draw the characters
    function draw() {
        // Black semi-transparent background to create fade effect
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Set text color and font
        ctx.fillStyle = '#0ff';
        ctx.font = `${fontSize}px monospace`;
        
        // Draw characters
        for (let i = 0; i < drops.length; i++) {
            // Random character
            const char = chars[Math.floor(Math.random() * chars.length)];
            
            // Draw character
            ctx.fillText(char, i * fontSize, drops[i] * fontSize);
            
            // Move drop down
            drops[i]++;
            
            // Reset drop to top with random delay
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = Math.floor(Math.random() * -10);
            }
        }
        
        requestAnimationFrame(draw);
    }
    
    draw();
}

/**
 * Initialize cyber button hover effects
 */
function initCyberButtons() {
    const cyberButtons = document.querySelectorAll('.cyber-button');
    
    if (cyberButtons.length === 0) return;
    
    cyberButtons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.classList.add('cyber-button-hover');
        });
        
        button.addEventListener('mouseleave', () => {
            button.classList.remove('cyber-button-hover');
        });
    });
}

/**
 * Initialize augmented reality frames
 */
function initARFrames() {
    const arFrames = document.querySelectorAll('.ar-frame');
    
    if (arFrames.length === 0) return;
    
    arFrames.forEach(frame => {
        // Add corner elements if they don't exist
        if (!frame.querySelector('.ar-corner-tl')) {
            const corners = ['tl', 'tr', 'bl', 'br'];
            corners.forEach(corner => {
                if (!frame.querySelector(`.ar-corner-${corner}`)) {
                    const cornerElement = document.createElement('div');
                    cornerElement.classList.add(`ar-corner-${corner}`);
                    frame.appendChild(cornerElement);
                }
            });
        }
    });
}

/**
 * Creates a cyber loader animation
 */
function createCyberLoader(container) {
    if (!container) return;
    
    const loader = document.createElement('div');
    loader.classList.add('cyber-loader');
    
    // Create spinner elements
    for (let i = 0; i < 3; i++) {
        const span = document.createElement('span');
        loader.appendChild(span);
    }
    
    container.appendChild(loader);
    
    return loader;
}

/**
 * Creates a data visualization with animated bars
 */
function createDataVisualization(container, data) {
    if (!container || !data || !data.length) return;
    
    const canvas = document.createElement('canvas');
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.zIndex = '1';
    
    container.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    
    // Normalize data
    const maxValue = Math.max(...data);
    const normalizedData = data.map(value => value / maxValue);
    
    // Bar settings
    const barWidth = canvas.width / data.length;
    const barMargin = barWidth * 0.1;
    
    // Draw the bars
    function draw() {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw each bar
        normalizedData.forEach((value, index) => {
            // Calculate bar height with animation
            const time = Date.now() / 1000;
            const animatedValue = value * (0.8 + Math.sin(time + index) * 0.2);
            const barHeight = animatedValue * canvas.height * 0.8;
            
            // Calculate position
            const x = index * barWidth + barMargin;
            const y = canvas.height - barHeight;
            
            // Create gradient
            const gradient = ctx.createLinearGradient(x, y, x, canvas.height);
            gradient.addColorStop(0, 'rgba(0, 240, 255, 0.8)');
            gradient.addColorStop(1, 'rgba(0, 240, 255, 0.2)');
            
            // Draw bar
            ctx.fillStyle = gradient;
            ctx.fillRect(x, y, barWidth - barMargin * 2, barHeight);
            
            // Draw glow
            ctx.shadowColor = 'rgba(0, 240, 255, 0.5)';
            ctx.shadowBlur = 10;
            ctx.fillRect(x, y, barWidth - barMargin * 2, 2);
            ctx.shadowBlur = 0;
        });
        
        requestAnimationFrame(draw);
    }
    
    draw();
} 