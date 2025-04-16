/**
 * Form Validation Script
 * Provides advanced real-time validation for the contact form
 */

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const serviceInput = document.getElementById('service');
    const messageInput = document.getElementById('message');
    const messageCounter = document.getElementById('messageCounter');
    
    // Form fields validation patterns and constraints
    const validationRules = {
        name: {
            pattern: /^[a-zA-Z\s]{2,50}$/,
            message: 'Please enter a valid name (2-50 characters, letters only)'
        },
        email: {
            pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            message: 'Please enter a valid email address'
        },
        phone: {
            pattern: /^(\+\d{1,3}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
            message: 'Please enter a valid phone number'
        },
        message: {
            minLength: 10,
            maxLength: 500,
            message: 'Your message must be between 10 and 500 characters'
        }
    };
    
    // Initialize form validation state
    const validationState = {
        name: false,
        email: false,
        phone: true, // Phone is optional
        service: false,
        message: false,
    };
    
    /**
     * Validates a specific input field
     * @param {HTMLElement} input - The input element to validate
     * @param {boolean} showError - Whether to show visual error feedback
     * @returns {boolean} - Validation result
     */
    function validateField(input, showError = true) {
        let isValid = false;
        const field = input.id;
        const value = input.value.trim();
        
        // Reset validation state
        input.classList.remove('is-invalid');
        input.classList.remove('is-valid');
        
        // Skip validation for empty optional fields
        if (field === 'phone' && value === '') {
            validationState[field] = true;
            return true;
        }
        
        // Field-specific validation
        switch (field) {
            case 'name':
                isValid = validationRules.name.pattern.test(value);
                break;
                
            case 'email':
                isValid = validationRules.email.pattern.test(value);
                break;
                
            case 'phone':
                isValid = value === '' || validationRules.phone.pattern.test(value);
                break;
                
            case 'service':
                isValid = value !== "" && value !== null;
                break;
                
            case 'message':
                isValid = value.length >= validationRules.message.minLength && 
                          value.length <= validationRules.message.maxLength;
                break;
        }
        
        // Update validation state and visual feedback
        validationState[field] = isValid;
        
        if (showError) {
            if (isValid) {
                input.classList.add('is-valid');
            } else {
                input.classList.add('is-invalid');
            }
        }
        
        return isValid;
    }
    
    /**
     * Checks if the entire form is valid
     * @returns {boolean} - Whether the form is valid
     */
    function isFormValid() {
        return Object.values(validationState).every(state => state === true);
    }
    
    /**
     * Updates the submit button state based on form validity
     */
    function updateSubmitButtonState() {
        const submitBtn = document.getElementById('submitBtn');
        if (isFormValid()) {
            submitBtn.removeAttribute('disabled');
        } else {
            submitBtn.setAttribute('disabled', 'disabled');
        }
    }
    
    /**
     * Updates the character counter for the message field
     */
    function updateMessageCounter() {
        const currentLength = messageInput.value.length;
        const maxLength = validationRules.message.maxLength;
        messageCounter.textContent = `${currentLength}/${maxLength}`;
        
        // Visual feedback based on length
        if (currentLength > 0 && currentLength < validationRules.message.minLength) {
            messageCounter.classList.add('text-danger');
        } else if (currentLength >= validationRules.message.minLength && currentLength <= maxLength) {
            messageCounter.classList.remove('text-danger');
            messageCounter.classList.add('text-success');
        } else if (currentLength > maxLength * 0.8) {
            messageCounter.classList.remove('text-success');
            messageCounter.classList.add('text-warning');
        }
    }
    
    // ===== Event Listeners =====
    
    // Real-time validation on input
    nameInput.addEventListener('input', function() {
        validateField(this);
        updateSubmitButtonState();
    });
    
    emailInput.addEventListener('input', function() {
        validateField(this);
        updateSubmitButtonState();
    });
    
    phoneInput.addEventListener('input', function() {
        validateField(this);
        updateSubmitButtonState();
    });
    
    serviceInput.addEventListener('change', function() {
        validateField(this);
        updateSubmitButtonState();
    });
    
    messageInput.addEventListener('input', function() {
        validateField(this);
        updateMessageCounter();
        updateSubmitButtonState();
    });
    
    // Validate all fields on form submission
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        let isValid = true;
        
        // Validate all fields
        const fields = [nameInput, emailInput, phoneInput, serviceInput, messageInput];
        fields.forEach(field => {
            if (!validateField(field, true)) {
                isValid = false;
            }
        });
        
        // If form is valid, submit it
        if (isValid) {
            // Form submission is handled by emailjs-integration.js
            const submitBtn = document.getElementById('submitBtn');
            const submitSpinner = document.getElementById('submitSpinner');
            const submitText = document.getElementById('submitText');
            
            // Show loading state
            submitBtn.setAttribute('disabled', 'disabled');
            submitSpinner.classList.remove('d-none');
            submitText.textContent = 'Sending...';
            
            // The actual submission is handled by the emailjs-integration.js file
        }
    });
    
    // Initialize validation state
    document.querySelectorAll('#contactForm input, #contactForm select, #contactForm textarea').forEach(field => {
        // Initialize with empty validation (no visual feedback)
        validateField(field, false);
    });
    
    // Initialize character counter
    updateMessageCounter();
    
    // Initialize submit button state
    updateSubmitButtonState();
});