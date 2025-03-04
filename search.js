// Search functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get all necessary elements
    const searchInput = document.querySelector('.search-bar input');
    const propertyCards = document.querySelectorAll('.property-card');
    const noResults = document.querySelector('.no-results');
    const propertyTypeSelect = document.getElementById('propertyType');
    const priceRangeSelect = document.getElementById('priceRange');
    const bedroomsSelect = document.getElementById('bedrooms');
    const minPriceInput = document.querySelector('.range-inputs input[placeholder="Min"]');
    const maxPriceInput = document.querySelector('.range-inputs input[placeholder="Max"]');

    // Function to convert price string to number
    function extractPrice(priceString) {
        return parseInt(priceString.replace(/[^0-9]/g, ''));
    }

    // Function to check if a property matches the search criteria
    function matchesSearchCriteria(card, searchTerm, filters) {
        const searchContent = [
            card.querySelector('h3').textContent,
            card.querySelector('.property-location span').textContent,
            card.getAttribute('data-type'),
            card.querySelector('.price').textContent
        ].join(' ').toLowerCase();

        // Text search
        if (searchTerm && !searchContent.includes(searchTerm.toLowerCase())) {
            return false;
        }

        // Property type filter
        if (filters.propertyType && card.getAttribute('data-type') !== filters.propertyType) {
            return false;
        }

        // Bedrooms filter
        const beds = parseInt(card.getAttribute('data-beds'));
        if (filters.bedrooms && beds < parseInt(filters.bedrooms)) {
            return false;
        }

        // Price range filter
        const price = extractPrice(card.querySelector('.price').textContent);
        if (filters.minPrice && price < filters.minPrice) {
            return false;
        }
        if (filters.maxPrice && price > filters.maxPrice) {
            return false;
        }

        return true;
    }

    // Function to update the display of property cards
    function updatePropertyDisplay(searchTerm = '') {
        const filters = {
            propertyType: propertyTypeSelect.value,
            bedrooms: bedroomsSelect.value,
            minPrice: parseInt(minPriceInput.value) || 0,
            maxPrice: parseInt(maxPriceInput.value) || Infinity
        };

        let hasVisibleCards = false;

        propertyCards.forEach(card => {
            if (matchesSearchCriteria(card, searchTerm, filters)) {
                card.style.display = 'block';
                hasVisibleCards = true;
                // Add fade-in animation
                card.classList.add('fade-in');
            } else {
                card.style.display = 'none';
                card.classList.remove('fade-in');
            }
        });

        // Show/hide no results message
        noResults.style.display = hasVisibleCards ? 'none' : 'flex';
    }

    // Real-time search event listener
    searchInput.addEventListener('input', (e) => {
        updatePropertyDisplay(e.target.value);
    });

    // Filter change event listeners
    propertyTypeSelect.addEventListener('change', () => updatePropertyDisplay(searchInput.value));
    bedroomsSelect.addEventListener('change', () => updatePropertyDisplay(searchInput.value));
    minPriceInput.addEventListener('input', () => updatePropertyDisplay(searchInput.value));
    maxPriceInput.addEventListener('input', () => updatePropertyDisplay(searchInput.value));

    // Reset filters
    document.querySelector('.reset-filters').addEventListener('click', () => {
        searchInput.value = '';
        propertyTypeSelect.value = '';
        priceRangeSelect.value = '';
    // Function to check if a property matches the filters
    function matchesFilters(card) {
        const type = propertyTypeSelect.value;
        const priceRange = priceRangeSelect.value;
        const beds = bedroomsSelect.value;
        
        // Check property type
        if (type && card.dataset.type !== type) return false;
        
        // Check number of beds
        if (beds) {
            const cardBeds = parseInt(card.dataset.beds);
            if (cardBeds < parseInt(beds)) return false;
        }
        
        // Check price range
        if (priceRange) {
            const price = extractPrice(card.querySelector('.price').textContent);
            const [min, max] = priceRange.split('-').map(p => p === '+' ? Infinity : parseInt(p));
            if (price < min || price > max) return false;
        }
        
        return true;
    }

    // Function to update property visibility
    function updatePropertyVisibility() {
        const searchTerm = searchInput.value.trim();
        let visibleCount = 0;

        propertyCards.forEach(card => {
            const matchesSearchTerm = !searchTerm || matchesSearch(card, searchTerm);
            const matchesFilterCriteria = matchesFilters(card);
            const shouldBeVisible = matchesSearchTerm && matchesFilterCriteria;

            card.style.display = shouldBeVisible ? 'block' : 'none';
            if (shouldBeVisible) visibleCount++;

            // Highlight matching text if it's a search match
            if (shouldBeVisible && searchTerm) {
                highlightMatchingText(card, searchTerm);
            } else {
                removeHighlights(card);
            }
        });

        // Show/hide no results message
        noResults.style.display = visibleCount === 0 ? 'flex' : 'none';
        listingsGrid.classList.toggle('empty', visibleCount === 0);
    }

    // Function to highlight matching text
    function highlightMatchingText(card, searchTerm) {
        const textElements = card.querySelectorAll('h3, .property-location span, .property-features span');
        textElements.forEach(element => {
            const originalText = element.textContent;
            const searchTerms = searchTerm.toLowerCase().split(' ').filter(term => term.length > 0);
            
            let newText = originalText;
            searchTerms.forEach(term => {
                const regex = new RegExp(`(${term})`, 'gi');
                newText = newText.replace(regex, '<mark>$1</mark>');
            });
            
            if (newText !== originalText) {
                element.innerHTML = newText;
            }
        });
    }

    // Function to remove highlights
    function removeHighlights(card) {
        const marks = card.querySelectorAll('mark');
        marks.forEach(mark => {
            mark.outerHTML = mark.innerHTML;
        });
    }

    // Add event listeners
    searchInput.addEventListener('input', debounce(updatePropertyVisibility, 300));
    filterButton.addEventListener('click', updatePropertyVisibility);
    
    resetButton.addEventListener('click', () => {
        searchInput.value = '';
        propertyTypeSelect.value = '';
        priceRangeSelect.value = '';
        bedroomsSelect.value = '';
        propertyCards.forEach(card => removeHighlights(card));
        updatePropertyVisibility();
    });

    // Debounce function to limit how often the search updates
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Initialize
    updatePropertyVisibility();
});