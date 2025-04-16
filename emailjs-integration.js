/**
 * EmailJS Integration Script
 * Handles the sending of form data via EmailJS service
 */

document.addEventListener('DOMContentLoaded', function() {
    // EmailJS is already initialized in the HTML
    // This is just a check to confirm it's working
    if (typeof emailjs === 'undefined') {
        console.error('EmailJS SDK not loaded properly');
    }
    
    // Get the contact form element
    const contactForm = document.getElementById('contactForm');
    const successAlert = document.getElementById('successAlert');
    const errorAlert = document.getElementById('errorAlert');
    const errorMessage = document.getElementById('errorMessage');
    
    // Handle form submission
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Get form elements
        const submitBtn = document.getElementById('submitBtn');
        const submitSpinner = document.getElementById('submitSpinner');
        const submitText = document.getElementById('submitText');
        
        // Show loading state
        submitBtn.setAttribute('disabled', 'disabled');
        submitSpinner.classList.remove('d-none');
        submitText.textContent = 'Sending...';
        
        // Hide any previous alerts
        successAlert.classList.add('d-none');
        errorAlert.classList.add('d-none');
        
        // Prepare template parameters for EmailJS
        const templateParams = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value || 'Not provided',
            service: document.getElementById('service').value,
            message: document.getElementById('message').value
        };
        
        // Send the form using EmailJS with the provided credentials
        emailjs.send('service_jljjdep', 'template_gx9t8vk', templateParams)
            .then(function(response) {
                console.log('SUCCESS!', response.status, response.text);
                
                // Reset the form
                contactForm.reset();
                
                // Remove validation styles
                document.querySelectorAll('#contactForm .is-valid, #contactForm .is-invalid').forEach(element => {
                    element.classList.remove('is-valid');
                    element.classList.remove('is-invalid');
                });
                
                // Reset character counter
                document.getElementById('messageCounter').textContent = '0/500';
                document.getElementById('messageCounter').classList.remove('text-danger', 'text-success', 'text-warning');
                
                // Show success message
                successAlert.classList.remove('d-none');
                
                // Scroll to top of form to see success message
                contactForm.scrollIntoView({ behavior: 'smooth' });
                
                // Reset button state
                submitBtn.removeAttribute('disabled');
                submitSpinner.classList.add('d-none');
                submitText.textContent = 'Send Message';
            })
            .catch(function(error) {
                console.log('FAILED...', error);
                
                // Show error message
                errorMessage.textContent = 'There was a problem sending your message. Please try again later.';
                errorAlert.classList.remove('d-none');
                
                // Scroll to top of form to see error message
                contactForm.scrollIntoView({ behavior: 'smooth' });
                
                // Reset button state
                submitBtn.removeAttribute('disabled');
                submitSpinner.classList.add('d-none');
                submitText.textContent = 'Send Message';
            });
    });
    
    // Handle alert dismissals
    document.querySelectorAll('.alert .btn-close').forEach(button => {
        button.addEventListener('click', function() {
            this.closest('.alert').classList.add('d-none');
        });
    });
});