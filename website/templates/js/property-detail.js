document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true
    });

    // Mobile menu toggle for property detail page
    const navTogglePd = document.querySelector('.nav-toggle');
    if (navTogglePd) {
        navTogglePd.addEventListener('click', function() {
            document.querySelector('nav ul').classList.toggle('active');
        });
    }

    // Image gallery functionality
    const mainImage = document.getElementById('main-property-image');
    const thumbnails = document.querySelectorAll('.thumbnail-grid img');
    const prevBtn = document.querySelector('.gallery-btn.prev');
    const nextBtn = document.querySelector('.gallery-btn.next');
    let currentImageIndex = 0;

    // Change main image when thumbnail is clicked
    thumbnails.forEach((thumb, index) => {
        thumb.addEventListener('click', () => {
            mainImage.src = thumb.src;
            updateActiveThumbnail(index);
            currentImageIndex = index;
        });
    });

    // Previous image button
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentImageIndex = (currentImageIndex - 1 + thumbnails.length) % thumbnails.length;
            mainImage.src = thumbnails[currentImageIndex].src;
            updateActiveThumbnail(currentImageIndex);
        });
    }

    // Next image button
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentImageIndex = (currentImageIndex + 1) % thumbnails.length;
            mainImage.src = thumbnails[currentImageIndex].src;
            updateActiveThumbnail(currentImageIndex);
        });
    }

    // Update active thumbnail
    function updateActiveThumbnail(index) {
        thumbnails.forEach(thumb => thumb.classList.remove('active'));
        thumbnails[index].classList.add('active');
    }

    // Quick info bar visibility
    const quickInfo = document.querySelector('.property-quick-info');
    const propertyContent = document.querySelector('.property-content');
    
    if (quickInfo && propertyContent) {
        const showQuickInfoAt = propertyContent.offsetTop;
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > showQuickInfoAt) {
                quickInfo.classList.add('visible');
            } else {
                quickInfo.classList.remove('visible');
            }
        });
    }

    // Smooth scroll to contact form when inquiry button is clicked
    const inquiryBtn = document.querySelector('.inquiry-btn');
    const contactForm = document.querySelector('.contact-section');

    if (inquiryBtn && contactForm) {
        inquiryBtn.addEventListener('click', () => {
            contactForm.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Handle form submission
    const propertyForm = document.getElementById('property-inquiry-form');
    if (propertyForm) {
        propertyForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show success message
            const successMessage = document.createElement('div');
            successMessage.className = 'form-success';
            successMessage.innerHTML = `
                <i class="fas fa-check-circle"></i>
                <h3>Thank you for your inquiry!</h3>
                <p>We'll get back to you as soon as possible.</p>
            `;
            
            propertyForm.innerHTML = '';
            propertyForm.appendChild(successMessage);
        });
    }

    // Get URL params and update details
    function getUrlParamsPd() {
        const params = {};
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        for (const [key, value] of urlParams.entries()) {
            params[key] = value;
        }
        return params;
    }

    function updatePropertyDetailsPd() {
        const params = getUrlParamsPd();
        if (params.id) {
            if (params.type) {
                document.getElementById('property-type').textContent = params.type.charAt(0).toUpperCase() + params.type.slice(1);
            }
            if (params.location) {
                document.getElementById('property-location').textContent = params.location;
            }
            if (params.price) {
                const formattedPrice = new Intl.NumberFormat().format(params.price);
                document.getElementById('property-price').textContent = `${formattedPrice} Birr`;
            }
            const propertyTitle = document.getElementById('property-title').textContent;
            document.getElementById('inquiry-subject').value = 'Inquiry about ' + propertyTitle;
        }
    }

    window.addEventListener('load', updatePropertyDetailsPd);
});