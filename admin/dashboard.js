// Handle sidebar navigation and dashboard functionality
document.addEventListener('DOMContentLoaded', function() {
    // Handle home navigation
    const homeLink = document.querySelector('.sidebar-nav a[href="../index.html"]');
    if (homeLink) {
        homeLink.addEventListener('click', function(e) {
            // Allow default behavior (navigation to index.html)
            // No need to prevent default since we want actual navigation
        });
    }

    // Get modal elements
    const modal = document.getElementById('add-property-modal');
    const addPropertyBtns = document.querySelectorAll('.add-property-btn');
    const closeModalBtn = modal.querySelector('.close-modal');
    const cancelBtn = modal.querySelector('.cancel-btn');
    const addPropertyForm = document.getElementById('add-property-form');

    // Function to show modal
    function showModal() {
        modal.classList.add('show');
    }

    // Function to hide modal
    function hideModal() {
        modal.classList.remove('show');
        addPropertyForm.reset(); // Reset form when closing
    }

    // Add click event listeners to all "Add Property" buttons
    addPropertyBtns.forEach(btn => {
        btn.addEventListener('click', showModal);
    });

    // Close modal when clicking close button
    closeModalBtn.addEventListener('click', hideModal);

    // Close modal when clicking cancel button
    cancelBtn.addEventListener('click', hideModal);

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            hideModal();
        }
    });

    // Handle form submission
    addPropertyForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const propertyName = document.getElementById('property-name').value;
        const location = document.getElementById('property-location').value;
        const price = document.getElementById('property-price').value;
        const status = document.getElementById('property-status').value;
        const imageFile = document.getElementById('property-image').files[0];

        // Create new table row
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>
                <div class="property-info">
                    <img src="${imageFile ? URL.createObjectURL(imageFile) : 'https://via.placeholder.com/50'}" alt="Property">
                    <span>${propertyName}</span>
                </div>
            </td>
            <td>${location}</td>
            <td>${price} Birr</td>
            <td><span class="status-badge ${status}">${status}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="edit-btn"><i class="fas fa-edit"></i></button>
                    <button class="delete-btn"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        `;

        // Add new row to both tables (dashboard and properties section)
        const tables = document.querySelectorAll('.properties-table tbody');
        tables.forEach(tbody => {
            // Insert at the beginning of the table
            tbody.insertBefore(newRow.cloneNode(true), tbody.firstChild);
        });

        // Update total properties count
        const totalProperties = document.querySelector('.stat-number');
        if (totalProperties) {
            const currentCount = parseInt(totalProperties.textContent);
            totalProperties.textContent = currentCount + 1;
        }

        // Show success message
        showToast('Property added successfully!');

        // Hide modal and reset form
        hideModal();

        // Add event listeners to new buttons
        const newEditBtns = newRow.querySelectorAll('.edit-btn');
        const newDeleteBtns = newRow.querySelectorAll('.delete-btn');
        
        newEditBtns.forEach(btn => {
            btn.addEventListener('click', handleEditProperty);
        });
        
        newDeleteBtns.forEach(btn => {
            btn.addEventListener('click', handleDeleteProperty);
        });
    });

    // Existing sidebar navigation code
    document.querySelectorAll('.sidebar-nav a').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            // Only handle internal navigation
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                
                document.querySelectorAll('.sidebar-nav li').forEach(item => {
                    item.classList.remove('active');
                });
                
                this.parentElement.classList.add('active');
                
                document.querySelectorAll('.content-section').forEach(section => {
                    section.classList.remove('active');
                });
                
                document.getElementById(targetId).classList.add('active');
            }
            // External links like "../index.html" will work normally
        });
    });

    // Function to handle edit property
    function handleEditProperty(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const row = e.target.closest('tr');
        const propertyName = row.querySelector('.property-info span').textContent;
        const location = row.querySelector('td:nth-child(2)').textContent;
        const price = row.querySelector('td:nth-child(3)').textContent;
        const status = row.querySelector('.status-badge').classList[1];
        
        // Switch to properties section
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById('properties').classList.add('active');
        
        // Update sidebar active state
        document.querySelectorAll('.sidebar-nav li').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector('.sidebar-nav a[href="#properties"]').parentElement.classList.add('active');
        
        // Find and highlight the property in the properties section
        const propertiesSection = document.getElementById('properties');
        const propertyRows = propertiesSection.querySelectorAll('.properties-table tbody tr');
        
        propertyRows.forEach(propertyRow => {
            const name = propertyRow.querySelector('.property-info span').textContent;
            if (name === propertyName) {
                // Highlight the row
                propertyRow.style.transition = 'background-color 0.3s ease';
                propertyRow.style.backgroundColor = '#e3f2fd';
                
                // Scroll the row into view
                propertyRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                // Remove highlight after 2 seconds
                setTimeout(() => {
                    propertyRow.style.backgroundColor = '';
                }, 2000);
            }
        });
        
        // Show edit modal
        const editModal = document.getElementById('edit-property-modal');
        const editForm = document.getElementById('edit-property-form');
        
        // Populate edit form
        document.getElementById('edit-property-name').value = propertyName;
        document.getElementById('edit-property-location').value = location.trim();
        document.getElementById('edit-property-price').value = price.replace(/[^0-9]/g, '');
        document.getElementById('edit-property-status').value = status;
        
        // Show modal
        editModal.classList.add('show');
        
        // Add event listeners for closing edit modal
        const closeEditBtn = editModal.querySelector('.close-modal');
        const cancelEditBtn = editModal.querySelector('.cancel-btn');
        
        function hideEditModal() {
            editModal.classList.remove('show');
            editForm.reset();
        }
        
        closeEditBtn.addEventListener('click', hideEditModal);
        cancelEditBtn.addEventListener('click', hideEditModal);
        
        // Close modal when clicking outside
        editModal.addEventListener('click', (e) => {
            if (e.target === editModal) {
                hideEditModal();
            }
        });
        
        showToast(`Editing property: ${propertyName}`);
    }

    // Function to handle delete property
    function handleDeleteProperty(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const row = e.target.closest('tr');
        const propertyName = row.querySelector('.property-info span').textContent;
        
        if (confirm(`Are you sure you want to delete ${propertyName}?`)) {
            // Find all instances of this property in both tables
            const allTables = document.querySelectorAll('.properties-table tbody');
            allTables.forEach(tbody => {
                const rows = tbody.querySelectorAll('tr');
                rows.forEach(r => {
                    const name = r.querySelector('.property-info span').textContent;
                    if (name === propertyName) {
                        // Add animation for smooth removal
                        r.style.transition = 'all 0.3s ease';
                        r.style.opacity = '0';
                        r.style.transform = 'translateX(20px)';
                        
                        setTimeout(() => {
                            r.remove();
                        }, 300);
                    }
                });
            });
            
            // Update total properties count
            const totalProperties = document.querySelector('.stat-number');
            if (totalProperties) {
                const currentCount = parseInt(totalProperties.textContent);
                totalProperties.textContent = Math.max(0, currentCount - 1);
            }
            
            showToast(`${propertyName} has been deleted`);
        }
    }

    // Add event listeners to all edit and delete buttons
    function addActionButtonListeners() {
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.removeEventListener('click', handleEditProperty);
            btn.addEventListener('click', handleEditProperty);
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.removeEventListener('click', handleDeleteProperty);
            btn.addEventListener('click', handleDeleteProperty);
        });
    }

    // Initialize action button listeners
    addActionButtonListeners();

    // Toast notification function
    function showToast(message) {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // Search functionality for properties
    const searchInput = document.querySelector('.search-bar input');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const propertyRows = document.querySelectorAll('.properties-table tbody tr');
            
            propertyRows.forEach(row => {
                const propertyName = row.querySelector('.property-info span').textContent.toLowerCase();
                const location = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
                
                if (propertyName.includes(searchTerm) || location.includes(searchTerm)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }

    // Reply to Inquiry Buttons
    document.querySelectorAll('.reply-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const card = e.target.closest('.inquiry-card');
            const userName = card.querySelector('.inquiry-user h4').textContent;
            const message = card.querySelector('.inquiry-message').textContent.trim();
            
            // You would typically show a reply form or modal
            alert(`Reply to ${userName}\nRegarding: ${message}`);
        });
    });

    // Archive Inquiry Buttons
    document.querySelectorAll('.archive-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const card = e.target.closest('.inquiry-card');
            const userName = card.querySelector('.inquiry-user h4').textContent;
            
            if (confirm(`Archive inquiry from ${userName}?`)) {
                // Add animation for smooth removal
                card.style.opacity = '0';
                card.style.height = '0';
                card.style.margin = '0';
                card.style.padding = '0';
                card.style.overflow = 'hidden';
                
                setTimeout(() => {
                    card.remove();
                }, 300);
            }
        });
    });

    // Notifications Functionality
    const notificationBtn = document.querySelector('.notifications');
    const notificationsPanel = document.querySelector('.notifications-panel');
    const clearAllBtn = document.querySelector('.clear-all');
    const markReadBtns = document.querySelectorAll('.mark-read');
    const badge = document.querySelector('.badge');
    let unreadCount = parseInt(badge.textContent) || 0;

    // Toggle notifications panel
    if (notificationBtn) {
        notificationBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            notificationsPanel.classList.toggle('show');
            
            // Position the panel correctly
            const btnRect = notificationBtn.getBoundingClientRect();
            notificationsPanel.style.top = `${btnRect.bottom + 10}px`;
            notificationsPanel.style.right = `${window.innerWidth - btnRect.right}px`;
        });
    }

    // Close notifications panel when clicking outside
    document.addEventListener('click', function(e) {
        if (notificationsPanel && !notificationsPanel.contains(e.target) && !notificationBtn.contains(e.target)) {
            notificationsPanel.classList.remove('show');
        }
    });

    // Clear all notifications
    if (clearAllBtn) {
        clearAllBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            const unreadItems = document.querySelectorAll('.notification-item.unread');
            unreadItems.forEach(item => {
                item.classList.remove('unread');
            });
            unreadCount = 0;
            updateBadge();
            showToast('All notifications marked as read');
        });
    }

    // Mark individual notifications as read
    markReadBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const notificationItem = this.closest('.notification-item');
            if (notificationItem.classList.contains('unread')) {
                notificationItem.classList.remove('unread');
                unreadCount = Math.max(0, unreadCount - 1);
                updateBadge();
                showToast('Notification marked as read');
            }
        });
    });

    // Update notification badge
    function updateBadge() {
        if (badge) {
            badge.textContent = unreadCount;
            badge.style.display = unreadCount > 0 ? 'block' : 'none';
        }
    }

    // Initialize badge
    updateBadge();

    // Handle window resize for notifications panel positioning
    window.addEventListener('resize', function() {
        if (notificationsPanel.classList.contains('show')) {
            const btnRect = notificationBtn.getBoundingClientRect();
            notificationsPanel.style.top = `${btnRect.bottom + 10}px`;
            notificationsPanel.style.right = `${window.innerWidth - btnRect.right}px`;
        }
    });

    // Settings Form Handling
    const profileForm = document.getElementById('profile-settings-form');
    const passwordForm = document.getElementById('password-settings-form');
    const notificationSettingsForm = document.getElementById('notification-settings-form');

    // Handle profile settings
    profileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('admin-name').value;
        const email = document.getElementById('admin-email').value;
        const phone = document.getElementById('admin-phone').value;

        // Here you would typically send this data to your backend
        showToast('Profile settings updated successfully');
    });

    // Handle password change
    passwordForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const currentPassword = document.getElementById('current-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        if (newPassword !== confirmPassword) {
            showToast('New passwords do not match', 'error');
            return;
        }

        if (newPassword.length < 8) {
            showToast('Password must be at least 8 characters long', 'error');
            return;
        }

        // Here you would typically send this data to your backend
        showToast('Password updated successfully');
        passwordForm.reset();
    });

    // Handle notification settings
    notificationSettingsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailNotifications = document.getElementById('email-notifications').checked;
        const propertyAlerts = document.getElementById('property-alerts').checked;
        const inquiryNotifications = document.getElementById('inquiry-notifications').checked;

        // Here you would typically send this data to your backend
        showToast('Notification preferences saved');
    });

    // Enhanced Toast Notification Function
    function showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = 'toast show';
        
        // Add color based on type
        if (type === 'error') {
            toast.style.backgroundColor = '#dc3545';
        } else if (type === 'success') {
            toast.style.backgroundColor = '#28a745';
        }

        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // Theme options
    document.querySelectorAll('.theme-option').forEach(option => {
        option.addEventListener('click', function() {
            // Remove active class from all options
            document.querySelectorAll('.theme-option').forEach(opt => {
                opt.classList.remove('active');
            });
            
            // Add active class to clicked option
            this.classList.add('active');
            
            // Get the theme color
            const themeColor = this.querySelector('.color-preview').style.backgroundColor;
            
            // Apply theme color to elements (this is just a placeholder)
            document.documentElement.style.setProperty('--theme-color', themeColor);
            
            showToast('Theme applied successfully!');
        });
    });

    // Mobile sidebar toggle
    function createMobileSidebarToggle() {
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'mobile-sidebar-toggle';
        toggleBtn.innerHTML = '<i class="fas fa-bars"></i>';
        
        const topBar = document.querySelector('.top-bar');
        topBar.insertBefore(toggleBtn, topBar.firstChild);
        
        const sidebar = document.querySelector('.sidebar');
        
        toggleBtn.addEventListener('click', function() {
            sidebar.classList.toggle('show');
        });
    }

    // Initialize mobile features if screen width is below 768px
    if (window.innerWidth < 768) {
        createMobileSidebarToggle();
    }
});