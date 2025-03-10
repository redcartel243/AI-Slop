/**
 * AI Slop - Main JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    // Ensure scrolling is enabled
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';
    document.body.style.height = 'auto';
    document.documentElement.style.height = 'auto';
    
    // Initialize tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Project filter functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Get filter value
                const filter = this.getAttribute('data-filter');
                
                // Filter projects
                const projects = document.querySelectorAll('.project-card');
                projects.forEach(project => {
                    if (filter === 'all') {
                        project.style.display = 'block';
                    } else {
                        if (project.classList.contains(filter)) {
                            project.style.display = 'block';
                        } else {
                            project.style.display = 'none';
                        }
                    }
                });
            });
        });
    }
    
    // Image gallery lightbox
    const galleryItems = document.querySelectorAll('.gallery-item img');
    if (galleryItems.length > 0) {
        galleryItems.forEach(item => {
            item.addEventListener('click', function() {
                const src = this.getAttribute('src');
                const alt = this.getAttribute('alt') || 'Project image';
                
                // Create lightbox elements
                const lightbox = document.createElement('div');
                lightbox.classList.add('lightbox');
                
                const lightboxContent = document.createElement('div');
                lightboxContent.classList.add('lightbox-content');
                
                const lightboxImg = document.createElement('img');
                lightboxImg.setAttribute('src', src);
                lightboxImg.setAttribute('alt', alt);
                
                const lightboxClose = document.createElement('span');
                lightboxClose.classList.add('lightbox-close');
                lightboxClose.innerHTML = '&times;';
                
                // Append elements
                lightboxContent.appendChild(lightboxImg);
                lightboxContent.appendChild(lightboxClose);
                lightbox.appendChild(lightboxContent);
                document.body.appendChild(lightbox);
                
                // Add lightbox styles
                lightbox.style.display = 'flex';
                lightbox.style.position = 'fixed';
                lightbox.style.top = '0';
                lightbox.style.left = '0';
                lightbox.style.width = '100%';
                lightbox.style.height = '100%';
                lightbox.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
                lightbox.style.zIndex = '1000';
                lightbox.style.justifyContent = 'center';
                lightbox.style.alignItems = 'center';
                
                lightboxContent.style.position = 'relative';
                lightboxContent.style.maxWidth = '90%';
                lightboxContent.style.maxHeight = '90%';
                
                lightboxImg.style.maxWidth = '100%';
                lightboxImg.style.maxHeight = '90vh';
                lightboxImg.style.display = 'block';
                lightboxImg.style.margin = '0 auto';
                
                lightboxClose.style.position = 'absolute';
                lightboxClose.style.top = '-40px';
                lightboxClose.style.right = '0';
                lightboxClose.style.color = '#fff';
                lightboxClose.style.fontSize = '30px';
                lightboxClose.style.fontWeight = 'bold';
                lightboxClose.style.cursor = 'pointer';
                
                // Close lightbox on click
                lightboxClose.addEventListener('click', function() {
                    document.body.removeChild(lightbox);
                });
                
                // Close lightbox on escape key
                document.addEventListener('keydown', function(e) {
                    if (e.key === 'Escape') {
                        if (document.body.contains(lightbox)) {
                            document.body.removeChild(lightbox);
                        }
                    }
                });
            });
        });
    }
    
    // Fix for any scrolling issues
    window.addEventListener('scroll', function() {
        // Ensure scrolling is always enabled
        if (document.body.style.overflow === 'hidden') {
            document.body.style.overflow = 'auto';
        }
        if (document.documentElement.style.overflow === 'hidden') {
            document.documentElement.style.overflow = 'auto';
        }
    });
    
    // Check for scrolling issues every second
    setInterval(function() {
        if (document.body.style.overflow === 'hidden' || 
            document.documentElement.style.overflow === 'hidden') {
            document.body.style.overflow = 'auto';
            document.documentElement.style.overflow = 'auto';
            console.log('Fixed scrolling issue');
        }
    }, 1000);
}); 