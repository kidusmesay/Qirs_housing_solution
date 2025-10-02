/**
 * QIRS Housing Solutions - Listings Page Backend Integration
 * 
 * This file handles the integration between the listings page and the backend.
 */

// Load properties from backend
async function loadProperties(filters = {}) {
    try {
        const properties = await window.backend.getProperties(filters);
        displayProperties(properties);
    } catch (error) {
        console.error('Error loading properties:', error);
        showToast('Error loading properties. Please try again.');
    }
}

// Display properties in the grid
function displayProperties(properties) {
    const grid = document.querySelector('.listings-grid');
    
    // Clear existing properties
    grid.innerHTML = '';
    
    if (properties.length === 0) {
        document.querySelector('.no-results').style.display = 'flex';
        return;
    }
    
    document.querySelector('.no-results').style.display = 'none';
    
    // Add properties to grid
    properties.forEach(property => {
        const card = createPropertyCard(property);
        grid.appendChild(card);
    });
    
    // Setup property detail links
    setupPropertyDetailLinks();
    
    // Load saved properties
    loadSavedProperties();
}

// Create a property card element
function createPropertyCard(property) {
    const card = document.createElement('div');
    card.className = 'property-card';
    card.dataset.type = property.type;
    card.dataset.beds = property.beds;
    
    card.innerHTML = `
        <div class="property-tag">${property.tag}</div>
        <div class="property-image">
            <img src="${property.images[0]}" alt="${property.title}">
        </div>
        <div class="property-info">
            <div class="property-location">
                <i class="fas fa-map-marker-alt"></i>
                <span>${property.location}</span>
            </div>
            <h3>${property.title}</h3>
            <div class="price">${new Intl.NumberFormat('en-ET').format(property.price)} Birr</div>
            <div class="property-features">
                <span><i class="fas fa-bed"></i> ${property.beds} beds</span>
                <span><i class="fas fa-bath"></i> ${property.baths} baths</span>
                <span><i class="fas fa-ruler-combined"></i> ${property.sqft} sqft</span>
            </div>
            <div class="property-actions">
                <button class="save-property" onclick="saveProperty(this)" data-property-id="${property.id}">
                    <i class="far fa-heart"></i>
                    <span>Save</span>
                </button>
                <button class="share-property" onclick="shareProperty(this)">
                    <i class="fas fa-share-alt"></i>
                    <span>Share</span>
                </button>
            </div>
            <a href="property-detail.html?id=${property.id}" class="view-details-button" style="display: block; width: 100%; padding: 12px; margin-top: 15px; background-color: var(--primary-color); color: white; text-align: center; text-decoration: none; border-radius: 5px; font-weight: 500; transition: all 0.3s ease;">View Details</a>
        </div>
    `;
    
    return card;
}

// Apply filters from UI and load properties
function applyFiltersAndLoad() {
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
    
    // Build filters object
    const filters = {};
    
    if (propertyType) filters.type = propertyType.toLowerCase();
    if (bedroomsSelect) filters.beds = parseInt(bedroomsSelect);
    if (minPrice) filters.minPrice = parseInt(minPrice);
    if (maxPrice) filters.maxPrice = parseInt(maxPrice);
    
    // Load properties with filters
    loadProperties(filters);
}

// Handle search
function performSearch() {
    const searchInput = document.querySelector('.search-bar input');
    if (!searchInput) return;
    
    const query = searchInput.value.toLowerCase().trim();
    
    if (query) {
        loadProperties({ search: query });
    } else {
        loadProperties();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Load all properties initially
    loadProperties();
    
    // Setup filter buttons
    const mainFilterButton = document.querySelector('.filter-button');
    const advancedFilterButton = document.querySelector('.filter-btn');
    const resetFilterButton = document.querySelector('.reset-filters');
    
    if (mainFilterButton) {
        mainFilterButton.addEventListener('click', applyFiltersAndLoad);
    }
    
    if (advancedFilterButton) {
        advancedFilterButton.addEventListener('click', applyFiltersAndLoad);
    }
    
    if (resetFilterButton) {
        resetFilterButton.addEventListener('click', function() {
            // Reset all select elements
            document.querySelectorAll('select').forEach(select => {
                select.selectedIndex = 0;
            });
            
            // Reset all input elements
            document.querySelectorAll('input[type="text"], input[type="number"]').forEach(input => {
                input.value = '';
            });
            
            // Load all properties
            loadProperties();
            
            showToast('Filters reset');
        });
    }
    
    // Setup search
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
    
    // Setup pagination
    setupPagination();
});