document.addEventListener('DOMContentLoaded', () => {
    // Form submission handling
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');
    const formError = document.getElementById('formError');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Show loading state
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            submitButton.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';
            submitButton.disabled = true;
            
            try {
                // Get form data
                const formData = new FormData(contactForm);
                
                // Send form data to server
                const response = await fetch('send_email.php', {
                    method: 'POST',
                    body: formData
                });
                
                const result = await response.json();
                
                if (result.success) {
                    // Show success message
                    contactForm.style.display = 'none';
                    formSuccess.classList.add('active');
                    formError.classList.remove('active');
                    
                    // Reset form after 5 seconds
                    setTimeout(() => {
                        contactForm.reset();
                        contactForm.style.display = 'block';
                        formSuccess.classList.remove('active');
                    }, 5000);
                } else {
                    // Show error message
                    formError.classList.add('active');
                    throw new Error(result.message || 'Failed to send message');
                }
            } catch (error) {
                console.error('Error:', error);
                formError.classList.add('active');
                
                // Hide error after 5 seconds
                setTimeout(() => {
                    formError.classList.remove('active');
                }, 5000);
            } finally {
                // Reset button state
                submitButton.innerHTML = originalButtonText;
                submitButton.disabled = false;
            }
        });
    }
    
    // Animate contact section elements on load
    const animateContactElements = () => {
        const contactMethods = document.querySelectorAll('.contact-method');
        const formGroups = document.querySelectorAll('.form-group');
        
        gsap.from(contactMethods, {
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2,
            delay: 0.5,
            ease: 'power3.out'
        });
        
        gsap.from(formGroups, {
            y: 30,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1,
            delay: 1,
            ease: 'back.out'
        });
    };
    
    // Wait for page to fully load before animating
    window.addEventListener('load', () => {
        setTimeout(animateContactElements, 500);
    });
    
    // Handle navigation active state
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
});