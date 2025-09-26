// Basic property actions
function saveProperty(button) {
    button.classList.toggle('saved');
    const icon = button.querySelector('i');
    if (button.classList.contains('saved')) {
        icon.classList.replace('far', 'fas');
        icon.style.color = 'var(--primary-color)';
        showToast('Property saved to favorites!');
        
        // Store saved property in localStorage
        const propertyId = button.dataset.propertyId;
        const savedProperties = JSON.parse(localStorage.getItem('savedProperties') || '[]');
        if (!savedProperties.includes(propertyId)) {
            savedProperties.push(propertyId);
            localStorage.setItem('savedProperties', JSON.stringify(savedProperties));
        }
    } else {
        icon.classList.replace('fas', 'far');
        icon.style.color = '';
        showToast('Property removed from favorites');
        
        // Remove from localStorage
        const propertyId = button.dataset.propertyId;
        const savedProperties = JSON.parse(localStorage.getItem('savedProperties') || '[]');
        const updatedSaved = savedProperties.filter(id => id !== propertyId);
        localStorage.setItem('savedProperties', JSON.stringify(updatedSaved));
    }
}

function shareProperty(button) {
    const card = button.closest('.property-card');
    const propertyTitle = card.querySelector('h3').textContent;
    const propertyLocation = card.querySelector('.property-location span').textContent;
    
    if (navigator.share) {
        navigator.share({
            title: propertyTitle,
            text: `Check out this ${propertyTitle} in ${propertyLocation} on QIRS Housing Solutions`,
            url: window.location.href
        })
        .catch(console.error);
    } else {
        const dummy = document.createElement('input');
        document.body.appendChild(dummy);
        dummy.value = window.location.href;
        dummy.select();
        document.execCommand('copy');
        document.body.removeChild(dummy);
        showToast('Link copied to clipboard!');
    }
}

// Simple toast notification
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Mobile menu toggle
function toggleMobileMenu() {
    document.querySelector('nav ul').classList.toggle('active');
}

// Function to handle property detail links
function setupPropertyDetailLinks() {
    const detailButtons = document.querySelectorAll('.view-details-button');
    
    detailButtons.forEach(button => {
        const card = button.closest('.property-card');
        if (!card) return;
        
        // Get property information
        const propertyId = card.querySelector('.save-property')?.dataset.propertyId || '';
        const propertyType = card.dataset.type || '';
        const propertyBeds = card.dataset.beds || '';
        const propertyLocation = card.querySelector('.property-location span')?.textContent || '';
        const propertyTitle = card.querySelector('h3')?.textContent || '';
        const propertyPrice = card.querySelector('.price')?.textContent.replace(/[^0-9]/g, '') || '';
        
        // Build the URL with parameters
        const url = `property-detail.html?id=${propertyId}&type=${propertyType}&beds=${propertyBeds}&location=${encodeURIComponent(propertyLocation)}&title=${encodeURIComponent(propertyTitle)}&price=${propertyPrice}`;
        
        // Update the href attribute
        button.href = url;
        
        console.log(`Updated link for property ${propertyId} to: ${url}`);
    });
}

// Enhanced filter functionality
function applyFilters() {
    // Get all filter values
    const propertyType = document.getElementById('propertyType')?.value || '';
    const bedroomsSelect = document.getElementById('bedrooms')?.value || '';
    const priceRangeSelect = document.getElementById('priceRange')?.value || '';
    
    // Get min/max price from inputs if they exist
    const minPriceInput = document.querySelector('input[placeholder="Min"]')?.value || '';
    const maxPriceInput = document.querySelector('input[placeholder="Max"]')?.value || '';
    
    // Process price range from dropdown if selected
    let minPrice = minPriceInput;
    let maxPrice = maxPriceInput;
    
    if (priceRangeSelect) {
        if (priceRangeSelect.includes('-')) {
            const [min, max] = priceRangeSelect.split('-');
            minPrice = minPrice || min;
            maxPrice = maxPrice || max;
        } else if (priceRangeSelect.includes('+')) {
            minPrice = minPrice || priceRangeSelect.replace('+', '');
            maxPrice = '';
        }
    }
    
    console.log('Applying filters:', {
        propertyType,
        bedrooms: bedroomsSelect,
        minPrice,
        maxPrice
    });
    
    // Apply filters to property cards
    const properties = document.querySelectorAll('.property-card');
    let visibleCount = 0;
    
    properties.forEach(property => {
        let shouldShow = true;
        
        // Filter by property type
        if (propertyType && property.dataset.type !== propertyType.toLowerCase()) {
            shouldShow = false;
        }
        
        // Filter by bedrooms
        if (bedroomsSelect && property.dataset.beds) {
            const propertyBeds = parseInt(property.dataset.beds);
            const requiredBeds = parseInt(bedroomsSelect);
            if (propertyBeds < requiredBeds) {
                shouldShow = false;
            }
        }
        
        // Filter by price
        const priceText = property.querySelector('.price')?.textContent || '';
        const price = parseInt(priceText.replace(/[^0-9]/g, ''));
        
        if (minPrice && price < parseInt(minPrice)) {
            shouldShow = false;
        }
        
        if (maxPrice && price > parseInt(maxPrice)) {
            shouldShow = false;
        }
        
        // Update visibility
        if (shouldShow) {
            property.style.display = 'block';
            visibleCount++;
        } else {
            property.style.display = 'none';
        }
    });
    
    // Show/hide no results message
    const noResults = document.querySelector('.no-results');
    if (noResults) {
        if (visibleCount === 0 && (propertyType || bedroomsSelect || minPrice || maxPrice)) {
            noResults.style.display = 'flex';
        } else {
            noResults.style.display = 'none';
        }
    }
    
    showToast(`${visibleCount} properties match your criteria`);
}

// Search functionality
function performSearch() {
    const searchInput = document.querySelector('.search-bar input');
    if (!searchInput) return;
    
    const query = searchInput.value.toLowerCase().trim();
    const properties = document.querySelectorAll('.property-card');
    let visibleCount = 0;
    
    properties.forEach(property => {
        if (!query) {
            property.style.display = 'block';
            visibleCount++;
            return;
        }
        
        const searchableText = property.textContent.toLowerCase();
        if (searchableText.includes(query)) {
            property.style.display = 'block';
            visibleCount++;
        } else {
            property.style.display = 'none';
        }
    });
    
    // Show/hide no results message
    const noResults = document.querySelector('.no-results');
    if (noResults) {
        if (visibleCount === 0 && query) {
            noResults.style.display = 'flex';
        } else {
            noResults.style.display = 'none';
        }
    }
    
    if (query) {
        showToast(`Found ${visibleCount} properties matching "${query}"`);
    }
}

// Reset all filters
function resetFilters() {
    // Reset all select elements
    document.querySelectorAll('select').forEach(select => {
        select.selectedIndex = 0;
    });
    
    // Reset all input elements
    document.querySelectorAll('input[type="text"], input[type="number"]').forEach(input => {
        input.value = '';
    });
    
    // Show all properties
    document.querySelectorAll('.property-card').forEach(property => {
        property.style.display = 'block';
    });
    
    // Hide no results message
    const noResults = document.querySelector('.no-results');
    if (noResults) {
        noResults.style.display = 'none';
    }
    
    showToast('Filters reset');
}

// Load saved properties from localStorage
function loadSavedProperties() {
    const savedProperties = JSON.parse(localStorage.getItem('savedProperties') || '[]');
    
    document.querySelectorAll('.save-property').forEach(button => {
        const propertyId = button.dataset.propertyId;
        if (savedProperties.includes(propertyId)) {
            button.classList.add('saved');
            const icon = button.querySelector('i');
            if (icon) {
                icon.classList.replace('far', 'fas');
                icon.style.color = 'var(--primary-color)';
            }
        }
    });
}

// Handle pagination
function setupPagination() {
    const paginationButtons = document.querySelectorAll('.pagination .page-btn');
    if (paginationButtons.length === 0) return;
    
    paginationButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            paginationButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // In a real backend implementation, this would load the next page of results
            // For now, we'll just show a toast
            if (this.textContent === 'Next') {
                showToast('Loading next page...');
            } else {
                showToast(`Loading page ${this.textContent}...`);
            }
        });
    });
}

// Function to handle property detail button clicks
function viewPropertyDetails(event, element) {
    // Prevent the default link behavior
    event.preventDefault();
    
    // Get the href attribute
    const href = element.getAttribute('href');
    
    // Navigate to the property detail page
    if (href) {
        window.location.href = href;
    }
}

// Handle index hero CTA buttons and logo fallback
(function bindIndexPage() {
  const toListings = document.querySelector('.hero .cta-button.primary');
  const toContact = document.querySelector('.hero .cta-button.secondary');
  const viewAll = document.querySelector('.view-all-button .cta-button.primary');
  if (toListings) toListings.addEventListener('click', () => { window.location.href = 'listings.html'; });
  if (toContact) toContact.addEventListener('click', () => { window.location.href = 'contact.html'; });
  if (viewAll) viewAll.addEventListener('click', () => { window.location.href = 'listings.html'; });

  const logoImg = document.querySelector('.logo-img');
  if (logoImg) {
    logoImg.addEventListener('error', () => { logoImg.style.display = 'none'; });
  }
})();

// Initialize Swiper if available on pages that include it
(function initSwiperIfPresent() {
  const container = document.querySelector('.swiper-container');
  if (container && window.Swiper) {
    new Swiper('.swiper-container', {
      slidesPerView: 1,
      spaceBetween: 30,
      loop: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      breakpoints: {
        640: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
      },
    });
  }
})();

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded - initializing');
    
    // Mobile menu
    const navToggle = document.querySelector('.nav-toggle');
    if (navToggle) {
        navToggle.addEventListener('click', toggleMobileMenu);
    }
    
    // Make sure all property cards are visible
    document.querySelectorAll('.property-card').forEach(card => {
        card.style.display = 'block';
    });
    
    // Setup property detail links
    setupPropertyDetailLinks();
    
    // Load saved properties
    loadSavedProperties();
    
    // Setup pagination
    setupPagination();
    
    // Search functionality
    const searchInput = document.querySelector('.search-bar input');
    const searchBtn = document.querySelector('.search-btn');
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
    
    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }
    
    // Filter buttons
    const mainFilterButton = document.querySelector('.filter-button');
    const advancedFilterButton = document.querySelector('.filter-btn');
    const resetFilterButton = document.querySelector('.reset-filters');
    
    if (mainFilterButton) {
        mainFilterButton.addEventListener('click', applyFilters);
    }
    
    if (advancedFilterButton) {
        advancedFilterButton.addEventListener('click', applyFilters);
    }
    
    if (resetFilterButton) {
        resetFilterButton.addEventListener('click', resetFilters);
    }

    // Bind save buttons
    document.querySelectorAll('.save-property').forEach(btn => {
        btn.addEventListener('click', function() { saveProperty(this); });
    });

    // Bind share buttons
    document.querySelectorAll('.share-property').forEach(btn => {
        btn.addEventListener('click', function() { shareProperty(this); });
    });

    // Bind view details buttons
    document.querySelectorAll('.view-details-button').forEach(anchor => {
        anchor.addEventListener('click', function(e) { viewPropertyDetails(e, this); });
    });

    // Initialize AOS animation library
    if (window.AOS && typeof AOS.init === 'function') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true
        });
    }
}); 