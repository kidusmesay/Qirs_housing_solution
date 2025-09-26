/**
 * QIRS Housing Solutions - Backend Simulation
 * 
 * This file simulates backend functionality that would normally be handled by a server.
 * In a real implementation, these functions would make API calls to a backend server.
 */

// Simulated property database
const propertyDatabase = [
    {
        id: 1,
        title: "Luxury Villa",
        type: "villa",
        location: "Bole, Addis Ababa",
        price: 1200000,
        beds: 4,
        baths: 3,
        sqft: 3500,
        features: ["Modern Kitchen", "Swimming Pool", "Garden", "Security System", "Air Conditioning"],
        description: "This luxurious villa offers modern living at its finest. Featuring spacious rooms, high-end finishes, and stunning views. Perfect for families looking for comfort and elegance.",
        images: [
            "https://images.unsplash.com/photo-1580587771525-78b9dba3b914",
            "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9",
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
            "https://images.unsplash.com/photo-1600573472550-8090b5e0745e"
        ],
        featured: true,
        tag: "Featured"
    },
    {
        id: 2,
        title: "Modern Apartment",
        type: "apartment",
        location: "CMC, Addis Ababa",
        price: 850000,
        beds: 3,
        baths: 2,
        sqft: 1800,
        features: ["Modern Kitchen", "Balcony", "Security System", "Parking", "High-Speed Internet"],
        description: "A stylish modern apartment in the heart of CMC. This property features contemporary design, open-plan living, and all the amenities you need for comfortable city living.",
        images: [
            "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9",
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
            "https://images.unsplash.com/photo-1600573472550-8090b5e0745e",
            "https://images.unsplash.com/photo-1580587771525-78b9dba3b914"
        ],
        featured: false,
        tag: "New"
    },
    {
        id: 3,
        title: "Premium Villa",
        type: "villa",
        location: "Old Airport, Addis Ababa",
        price: 2500000,
        beds: 5,
        baths: 4,
        sqft: 4500,
        features: ["Luxury Kitchen", "Swimming Pool", "Garden", "Security System", "Home Theater", "Smart Home"],
        description: "An exceptional premium villa in the prestigious Old Airport area. This property offers the ultimate in luxury living with spacious rooms, high-end finishes, and premium amenities.",
        images: [
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
            "https://images.unsplash.com/photo-1600573472550-8090b5e0745e",
            "https://images.unsplash.com/photo-1580587771525-78b9dba3b914",
            "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9"
        ],
        featured: true,
        tag: "Premium"
    }
];

// Simulated API functions

/**
 * Get all properties with optional filtering
 * @param {Object} filters - Filter criteria
 * @returns {Promise} - Promise resolving to filtered properties
 */
function getProperties(filters = {}) {
    return new Promise((resolve) => {
        // Simulate network delay
        setTimeout(() => {
            let filteredProperties = [...propertyDatabase];
            
            // Apply filters
            if (filters.type) {
                filteredProperties = filteredProperties.filter(p => p.type === filters.type);
            }
            
            if (filters.minPrice) {
                filteredProperties = filteredProperties.filter(p => p.price >= filters.minPrice);
            }
            
            if (filters.maxPrice) {
                filteredProperties = filteredProperties.filter(p => p.price <= filters.maxPrice);
            }
            
            if (filters.beds) {
                filteredProperties = filteredProperties.filter(p => p.beds >= filters.beds);
            }
            
            if (filters.search) {
                const searchTerm = filters.search.toLowerCase();
                filteredProperties = filteredProperties.filter(p => 
                    p.title.toLowerCase().includes(searchTerm) || 
                    p.location.toLowerCase().includes(searchTerm) ||
                    p.type.toLowerCase().includes(searchTerm)
                );
            }
            
            resolve(filteredProperties);
        }, 500); // 500ms delay to simulate network request
    });
}

/**
 * Get a single property by ID
 * @param {number} id - Property ID
 * @returns {Promise} - Promise resolving to property object
 */
function getPropertyById(id) {
    return new Promise((resolve, reject) => {
        // Simulate network delay
        setTimeout(() => {
            const property = propertyDatabase.find(p => p.id === parseInt(id));
            
            if (property) {
                resolve(property);
            } else {
                reject(new Error('Property not found'));
            }
        }, 300);
    });
}

/**
 * Submit a property inquiry
 * @param {Object} inquiry - Inquiry data
 * @returns {Promise} - Promise resolving to success message
 */
function submitInquiry(inquiry) {
    return new Promise((resolve) => {
        // Simulate network delay
        setTimeout(() => {
            console.log('Inquiry submitted:', inquiry);
            resolve({ success: true, message: 'Your inquiry has been submitted successfully!' });
        }, 800);
    });
}

/**
 * Save a property to user favorites
 * @param {number} propertyId - Property ID
 * @param {boolean} isSaved - Whether to save or unsave
 * @returns {Promise} - Promise resolving to updated saved status
 */
function savePropertyToFavorites(propertyId, isSaved) {
    return new Promise((resolve) => {
        // Simulate network delay
        setTimeout(() => {
            console.log(`Property ${propertyId} ${isSaved ? 'saved to' : 'removed from'} favorites`);
            resolve({ success: true, saved: isSaved });
        }, 300);
    });
}

// Export functions for use in frontend
window.backend = {
    getProperties,
    getPropertyById,
    submitInquiry,
    savePropertyToFavorites
};