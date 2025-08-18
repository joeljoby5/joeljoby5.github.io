document.addEventListener('DOMContentLoaded', () => {
    class Typewriter {
        constructor(element, strings, options = {}) {
            this.element = element;
            this.strings = strings;
            this.options = {
                typeSpeed: 80,
                deleteSpeed: 40,
                delayBetween: 1500,
                loop: true,
                ...options
            };
            
            this.currentString = '';
            this.currentIndex = 0;
            this.isDeleting = false;
            this.isPaused = false;
            this.timeout = null;
            this.init();
        }
        
        init() {
            this.type();
        }
        
        type() {
            clearTimeout(this.timeout);
            
            const currentStringIndex = this.currentIndex % this.strings.length;
            const fullString = this.strings[currentStringIndex];
            
            if (this.isDeleting) {
                this.currentString = fullString.substring(0, this.currentString.length - 1);
            } else {
                this.currentString = fullString.substring(0, this.currentString.length + 1);
            }
            
            this.element.textContent = this.currentString;
            
            let typeSpeed = this.options.typeSpeed;
            
            if (this.isDeleting) {
                typeSpeed = this.options.deleteSpeed;
            }
            
            if (!this.isDeleting && this.currentString === fullString) {
                typeSpeed = this.options.delayBetween;
                this.isDeleting = true;
            } else if (this.isDeleting && this.currentString === '') {
                this.isDeleting = false;
                this.currentIndex++;
                typeSpeed = 500;
            }
            
            if (!this.options.loop && !this.isDeleting && this.currentIndex === this.strings.length) {
                return;
            }
            
            this.timeout = setTimeout(() => this.type(), typeSpeed);
        }
        
        pause() {
            this.isPaused = true;
            clearTimeout(this.timeout);
        }
        
        resume() {
            this.isPaused = false;
            this.type();
        }
        
        destroy() {
            clearTimeout(this.timeout);
            this.element.textContent = '';
        }
    }
    
    // Initialize typewriter effect
    const typewriterElement = document.querySelector('.typewriter');
    if (typewriterElement) {
        const strings = JSON.parse(typewriterElement.getAttribute('data-strings'));
        new Typewriter(typewriterElement, strings, {
            typeSpeed: 100,
            deleteSpeed: 50,
            delayBetween: 2000,
            loop: true
        });
    }
    
    // Cursor blink animation
    const cursor = document.querySelector('.typewriter-cursor');
    if (cursor) {
        setInterval(() => {
            cursor.style.opacity = cursor.style.opacity === '0' ? '1' : '0';
        }, 500);
    }
});