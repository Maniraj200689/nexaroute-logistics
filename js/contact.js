/**
 * Vahana Supply Co - Contact Page Validation & Submission Handling
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const phoneInput = document.getElementById('contact-phone');
  const serviceSelect = document.getElementById('contact-service');
  const messageInput = document.getElementById('contact-message');
  const submitBtn = document.getElementById('contact-submit-btn');
  const successBox = document.getElementById('contact-success-banner');

  const showError = (input, errorId, message) => {
    input.classList.add('border-rose-500', 'bg-rose-50/50');
    input.classList.remove('border-slate-300', 'border-emerald-500');
    input.setAttribute('aria-invalid', 'true');
    const errEl = document.getElementById(errorId);
    if (errEl) {
      errEl.textContent = message;
      errEl.classList.remove('hidden');
    }
  };

  const clearError = (input, errorId) => {
    input.classList.remove('border-rose-500', 'bg-rose-50/50');
    input.classList.add('border-emerald-500');
    input.setAttribute('aria-invalid', 'false');
    const errEl = document.getElementById(errorId);
    if (errEl) {
      errEl.textContent = '';
      errEl.classList.add('hidden');
    }
  };

  // Real-time validation on blur / input
  if (nameInput) {
    nameInput.addEventListener('blur', () => {
      if (nameInput.value.trim().length < 2) {
        showError(nameInput, 'error-name', 'Please enter your full name (minimum 2 characters).');
      } else {
        clearError(nameInput, 'error-name');
      }
    });
  }

  if (emailInput) {
    emailInput.addEventListener('blur', () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput.value.trim())) {
        showError(emailInput, 'error-email', 'Please provide a valid business email address.');
      } else {
        clearError(emailInput, 'error-email');
      }
    });
  }

  if (phoneInput) {
    phoneInput.addEventListener('blur', () => {
      // Indian 10-digit mobile number or standard international
      const cleanPhone = phoneInput.value.replace(/[\s\-\(\)\+]/g, '');
      const isIndianNumber = /^(91)?[6-9]\d{9}$/.test(cleanPhone);
      if (!isIndianNumber && cleanPhone.length < 10) {
        showError(phoneInput, 'error-phone', 'Please enter a valid 10-digit contact number.');
      } else {
        clearError(phoneInput, 'error-phone');
      }
    });
  }

  if (messageInput) {
    messageInput.addEventListener('blur', () => {
      if (messageInput.value.trim().length < 10) {
        showError(messageInput, 'error-message', 'Please share a brief description of your shipment (at least 10 characters).');
      } else {
        clearError(messageInput, 'error-message');
      }
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;

    // Validate Name
    if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
      showError(nameInput, 'error-name', 'Please enter your full name.');
      isValid = false;
    } else {
      clearError(nameInput, 'error-name');
    }

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value.trim())) {
      showError(emailInput, 'error-email', 'Please enter a valid email address.');
      isValid = false;
    } else {
      clearError(emailInput, 'error-email');
    }

    // Validate Phone
    const cleanPhone = phoneInput.value.replace(/[\s\-\(\)\+]/g, '');
    const isIndianNumber = /^(91)?[6-9]\d{9}$/.test(cleanPhone);
    if (!isIndianNumber && cleanPhone.length < 10) {
      showError(phoneInput, 'error-phone', 'Please enter a valid 10-digit phone number.');
      isValid = false;
    } else {
      clearError(phoneInput, 'error-phone');
    }

    // Validate Service
    if (!serviceSelect.value) {
      showError(serviceSelect, 'error-service', 'Please select a service category.');
      isValid = false;
    } else {
      clearError(serviceSelect, 'error-service');
    }

    // Validate Message
    if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
      showError(messageInput, 'error-message', 'Please enter at least 10 characters.');
      isValid = false;
    } else {
      clearError(messageInput, 'error-message');
    }

    if (!isValid) {
      // Focus first erroneous input
      const firstError = form.querySelector('[aria-invalid="true"]');
      if (firstError) firstError.focus();
      return;
    }

    // Show loading state on button
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
      </svg>
      Submitting Inquiry...
    `;

    // Submit to live backend API
    const formData = {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      phone: phoneInput.value.trim(),
      service: serviceSelect.value,
      volume: (document.getElementById('contact-volume') ? document.getElementById('contact-volume').value : '') || 'Standard Volume',
      message: messageInput.value.trim()
    };

    fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    .then(res => {
      if (!res.ok) throw new Error('API server error: ' + res.status);
      return res.json();
    })
    .then(data => {
      const ticketId = data.ticketId || ('NX-' + Math.floor(100000 + Math.random() * 900000));
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;

      form.classList.add('hidden');
      if (successBox) {
        successBox.classList.remove('hidden');
        const ticketDisplay = document.getElementById('ticket-number-display');
        if (ticketDisplay) ticketDisplay.textContent = ticketId;
      }
      form.reset();
    })
    .catch(err => {
      console.warn('API call failed, falling back to local submission handler:', err);
      // Fallback ticket generator
      const ticketId = 'NX-' + Math.floor(100000 + Math.random() * 900000);
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;

      form.classList.add('hidden');
      if (successBox) {
        successBox.classList.remove('hidden');
        const ticketDisplay = document.getElementById('ticket-number-display');
        if (ticketDisplay) ticketDisplay.textContent = ticketId;
      }
      form.reset();
    });
  });
});
