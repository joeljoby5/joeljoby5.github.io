// Quantum Portfolio - Main JavaScript File

document.addEventListener('DOMContentLoaded', () => {
    // Preloader
    const preloader = document.querySelector('.preloader');
    
    // Remove preloader when everything is loaded
    window.addEventListener('load', () => {
        gsap.to(preloader, {
            opacity: 0,
            duration: 0.8,
            ease: 'power3.inOut',
            onComplete: () => {
                preloader.style.display = 'none';
                animatePageIn();
            }
        });
    });
    
    // Animate page in after preloader
    function animatePageIn() {
        const tl = gsap.timeline();
        
        tl.from('.hero-title, .typewriter-container, .hero-subtitle', {
            y: 50,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: 'power3.out'
        })
        .from('.hero-cta', {
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: 'back.out'
        }, '-=0.5')
        .from('.profile-image-wrapper', {
            scale: 0.8,
            opacity: 0,
            duration: 1,
            ease: 'elastic.out(1, 0.5)'
        }, '-=0.8')
        .from('.bubble', {
            scale: 0,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'back.out'
        }, '-=0.5')
        
        
        // Animate skills bars
        const skillBars = document.querySelectorAll('.skill-progress');
        skillBars.forEach(bar => {
            const width = bar.getAttribute('data-width');
            gsap.to(bar, {
                width: `${width}%`,
                duration: 1.5,
                delay: 1,
                ease: 'power3.out'
            });
        });
        
        // Animate stats
        const stats = document.querySelectorAll('.stat-number');
        stats.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            const increment = target / 100;
            let current = 0;
            
            const timer = setInterval(() => {
                current += increment;
                stat.textContent = Math.floor(current);
                
                if (current >= target) {
                    stat.textContent = target;
                    clearInterval(timer);
                }
            }, 20);
        });

    }
    
    // Mobile Navigation
    const hamburger = document.querySelector('.nav-hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
    
    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
    
    // Theme Toggle
    const themeToggle = document.querySelector('.theme-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Check for saved theme preference or use system preference
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark' || (!currentTheme && prefersDarkScheme.matches)) {
        document.body.classList.add('dark');
    }
    
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark');
        const theme = document.body.classList.contains('dark') ? 'dark' : 'light';
        localStorage.setItem('theme', theme);
    });
    
    // Dynamic Greeting
    function updateGreeting() {
        const hour = new Date().getHours();
        const greeting = document.querySelector('.greeting');
        
        if (hour < 12) {
            greeting.textContent = 'Good Morning,';
        } else if (hour < 18) {
            greeting.textContent = 'Good Afternoon,';
        } else {
            greeting.textContent = 'Good Evening,';
        }
    }
    
    updateGreeting();
    setInterval(updateGreeting, 60000); // Update every minute
    
    // Live Clock
    function updateClock() {
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        document.querySelector('.greeting').textContent += ` ${timeString}`;
    }
    
    // Weather Widget
    const weatherWidget = document.querySelector('.weather-widget');
    const weatherToggleBtn = document.querySelector('.weather-toggle-btn');
    const weatherClose = document.querySelector('.weather-close');
    const weatherMain = document.querySelector('.weather-main');
    const weatherTemp = document.querySelector('.weather-temp');
    const weatherDesc = document.querySelector('.weather-desc');
    const weatherCity = document.querySelector('.weather-city');
    const weatherIcon = document.querySelector('.weather-icon i');

    // Toggle weather widget
    weatherToggleBtn.addEventListener('click', () => {
        weatherWidget.classList.toggle('active');
    });

    // Close weather widget
    weatherClose.addEventListener('click', () => {
        weatherWidget.classList.remove('active');
    });

    async function getWeather() {
        
        // REMINDER: Replace 'YOUR_API_KEY_HERE' with your actual key
        const apiKey = 'https://api.open-meteo.com/v1/forecast?latitude=9.9399&longitude=76.2602&current=temperature_2m,rain'; 
        
        try {
            const response = await fetch(apiKey);
            if (!response.ok) {
                throw new Error('City not found. Try adding a country code, e.g., "Kochi, IN".');
            }
            const data = await response.json();
            displayWeather(data);
            weatherMain.style.display = 'block';
        } catch (error) {
            weatherMain.style.display = 'none';
        }
    }

    function displayWeather(data) {
        weatherTemp.textContent = `${Math.round(data.current.temperature_2m)}°C`;
        weatherDesc.textContent = "";
        weatherCity.textContent = "Ernakulam";
        weatherMain.style.opacity = '1';
    }

    // Dev.to Articles
    async function fetchDevToArticles() {
        const articlesContainer = document.querySelector('.articles-grid');
        const articlesLoading = document.querySelector('.articles-loading');
        
        try {
            const response = await fetch('https://dev.to/api/articles?username=yourusername&per_page=5');
            
            if (!response.ok) {
                throw new Error('Failed to fetch articles');
            }
            
            const articles = await response.json();
            
            // Hide loading and display articles
            if (articlesLoading) articlesLoading.style.display = 'none';
            if (articlesContainer) articlesContainer.innerHTML = '';
            
            articles.forEach((article, index) => {
                const articleCard = document.createElement('div');
                articleCard.className = 'article-card';
                
                articleCard.innerHTML = `
                    <img src="${article.cover_image || 'https://via.placeholder.com/600x400?text=Dev.to+Article'}" alt="${article.title}" class="article-image">
                    <div class="article-content">
                        <h3 class="article-title">${article.title}</h3>
                        <div class="article-meta">
                            <span>${new Date(article.published_at).toLocaleDateString()}</span>
                            <span>${article.reading_time_minutes} min read</span>
                        </div>
                        <p class="article-excerpt">${article.description}</p>
                        <a href="${article.url}" target="_blank" class="article-link">
                            Read Article <i class="fas fa-external-link-alt"></i>
                        </a>
                    </div>
                `;
                
                if (articlesContainer) {
                    articlesContainer.appendChild(articleCard);
                
                    // Animate cards in
                    gsap.from(articleCard, {
                        y: 50,
                        opacity: 0,
                        duration: 0.6,
                        delay: 0.1 * index,
                        ease: 'power2.out'
                    });
                }
            });
        } catch (error) {
            if (articlesLoading) articlesLoading.innerHTML = '<p>Failed to load articles. Please try again later.</p>';
            console.error('Error fetching Dev.to articles:', error);
        }
    }
    
    // Fetch articles after page loads
    // setTimeout(fetchDevToArticles, 1500); // Comment out or remove as there's no articles section in index.html
    
    // Custom Cursor (for desktop)
    if (window.matchMedia('(min-width: 992px)').matches) {
        const cursor = document.querySelector('.custom-cursor');
        const follower = document.querySelector('.cursor-follower');
        
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            
            gsap.to(follower, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.6,
                ease: 'power2.out'
            });
        });
        
        // Cursor effects on interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .bubble, .nav-link, .cta-button, .article-card, .weather-geo, .weather-submit, .theme-toggle');
        
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.transform = 'scale(2)';
                cursor.style.backgroundColor = 'transparent';
                cursor.style.border = '1px solid var(--color-primary)';
                follower.style.transform = 'scale(1.5)';
                follower.style.opacity = '0.5';
            });
            
            el.addEventListener('mouseleave', () => {
                cursor.style.transform = 'scale(1)';
                cursor.style.backgroundColor = 'var(--color-primary)';
                cursor.style.border = 'none';
                follower.style.transform = 'scale(1)';
                follower.style.opacity = '1';
            });
        });
    }
    
    // Scroll animations
    const scrollElements = document.querySelectorAll('.section-title, .about-paragraph, .skill-category, .article-card');
    
    const elementInView = (el, dividend = 1) => {
        const elementTop = el.getBoundingClientRect().top;
        return (
            elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend
        );
    };
    
    const displayScrollElement = (element) => {
        element.classList.add('animated');
    };
    
    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el, 1.25)) {
                displayScrollElement(el);
            }
        });
    };
    
    window.addEventListener('scroll', () => {
        handleScrollAnimation();
    });
    
    // Initialize scroll animations
    handleScrollAnimation();
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Scroll indicator animation
    const scrollIndicator = document.querySelector('.hero-scroll-indicator');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            scrollIndicator.style.opacity = '0';
            scrollIndicator.style.pointerEvents = 'none';
        } else {
            scrollIndicator.style.opacity = '1';
            scrollIndicator.style.pointerEvents = 'auto';
        }
    });
    
    // Click handler for scroll indicator
    scrollIndicator.addEventListener('click', () => {
        window.scrollTo({
            top: window.innerHeight,
            behavior: 'smooth'
        });
    });

    getWeather();
    
    // Initialize weather with user's location
});