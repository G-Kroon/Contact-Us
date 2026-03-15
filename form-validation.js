/**
 * GKroon — Form Validation
 * Real-time red/green glow validation for all required fields.
 */

document.addEventListener('DOMContentLoaded', function () {

    const form     = document.getElementById('contactForm');
    const nameEl   = document.getElementById('name');
    const emailEl  = document.getElementById('email');
    const serviceEl= document.getElementById('service');
    const enquiryEl= document.getElementById('enquiry');
    const messageEl= document.getElementById('message');
    const counter  = document.getElementById('messageCounter');
    const fillBar  = document.getElementById('progressFill');
    const fillPct  = document.getElementById('progressPercent');

    // ── Validation rules ──────────────────────────────────────
    const rules = {
        name:    { pattern: /^[a-zA-Z\s'\-]{2,80}$/,     msg: 'Enter your full name (letters only, 2–80 chars)' },
        email:   { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, msg: 'Enter a valid email address' },
        service: { msg: 'Please select a service' },
        enquiry: { msg: 'Please select an enquiry type' },
        quote:   { msg: 'Please choose a quote option' },
        message: { min: 10, max: 500, msg: 'Message must be 10–500 characters' }
    };

    // Track touched state so we don't show red before user interacts
    const touched = { name: false, email: false, service: false, enquiry: false, quote: false, message: false };
    const valid   = { name: false, email: false, service: false, enquiry: false, quote: false, message: false };

    // Total required fields for progress
    const totalFields = Object.keys(valid).length;

    // ── Helpers ───────────────────────────────────────────────

    function setFieldState(inputEl, groupId, feedbackId, isValid, msg) {
        inputEl.classList.toggle('field-valid',   isValid);
        inputEl.classList.toggle('field-invalid', !isValid);

        const fb = document.getElementById(feedbackId);
        if (fb) {
            fb.textContent   = isValid ? '✔ Looks good' : msg;
            fb.className     = 'field-feedback ' + (isValid ? 'fb-valid' : 'fb-invalid');
        }
    }

    function validateName(show) {
        const v = nameEl.value.trim();
        const ok = rules.name.pattern.test(v);
        valid.name = ok;
        if (show || touched.name) setFieldState(nameEl, 'group-name', 'feedback-name', ok, rules.name.msg);
        return ok;
    }

    function validateEmail(show) {
        const v = emailEl.value.trim();
        const ok = rules.email.pattern.test(v);
        valid.email = ok;
        if (show || touched.email) setFieldState(emailEl, 'group-email', 'feedback-email', ok, rules.email.msg);
        return ok;
    }

    function validateService(show) {
        const ok = serviceEl.value !== '';
        valid.service = ok;
        if (show || touched.service) setFieldState(serviceEl, 'group-service', 'feedback-service', ok, rules.service.msg);
        return ok;
    }

    function validateEnquiry(show) {
        const ok = enquiryEl.value !== '';
        valid.enquiry = ok;
        if (show || touched.enquiry) setFieldState(enquiryEl, 'group-enquiry', 'feedback-enquiry', ok, rules.enquiry.msg);
        return ok;
    }

    function validateQuote(show) {
        const checked = document.querySelector('input[name="quote"]:checked');
        const ok = checked !== null;
        valid.quote = ok;

        const opts = document.getElementById('quoteOptions');
        const fb   = document.getElementById('feedback-quote');

        if (show || touched.quote) {
            opts.classList.toggle('options-invalid', !ok);
            if (fb) {
                fb.textContent = ok ? '✔ Option selected' : rules.quote.msg;
                fb.className   = 'field-feedback ' + (ok ? 'fb-valid' : 'fb-invalid');
            }
        }
        return ok;
    }

    function validateMessage(show) {
        const len = messageEl.value.length;
        const ok  = len >= rules.message.min && len <= rules.message.max;
        valid.message = ok;

        // Update counter display
        counter.textContent = len + ' / ' + rules.message.max;
        counter.className = 'char-counter mono';
        if (len > 0 && len < rules.message.min) counter.classList.add('cnt-bad');
        else if (ok)                             counter.classList.add('cnt-ok');
        else if (len > rules.message.max * 0.8) counter.classList.add('cnt-warn');

        if (show || touched.message) setFieldState(messageEl, 'group-message', 'feedback-message', ok, rules.message.msg);
        return ok;
    }

    function validateAll(forceShow) {
        const results = [
            validateName(forceShow),
            validateEmail(forceShow),
            validateService(forceShow),
            validateEnquiry(forceShow),
            validateQuote(forceShow),
            validateMessage(forceShow)
        ];
        return results.every(Boolean);
    }

    // ── Progress bar ──────────────────────────────────────────
    function updateProgress() {
        const done = Object.values(valid).filter(Boolean).length;
        const pct  = Math.round((done / totalFields) * 100);
        fillBar.style.width = pct + '%';
        fillPct.textContent = pct + '%';
    }

    // ── Submit button ─────────────────────────────────────────
    function updateSubmit() {
        const btn = document.getElementById('submitBtn');
        const allOk = Object.values(valid).every(Boolean);
        btn.disabled = !allOk;
    }

    // ── Event listeners ───────────────────────────────────────

    nameEl.addEventListener('input', function () {
        touched.name = true;
        validateName(true);
        updateProgress();
        updateSubmit();
    });

    emailEl.addEventListener('input', function () {
        touched.email = true;
        validateEmail(true);
        updateProgress();
        updateSubmit();
    });

    serviceEl.addEventListener('change', function () {
        touched.service = true;
        validateService(true);
        updateProgress();
        updateSubmit();
    });

    enquiryEl.addEventListener('change', function () {
        touched.enquiry = true;
        validateEnquiry(true);
        updateProgress();
        updateSubmit();
    });

    document.querySelectorAll('input[name="quote"]').forEach(function (radio) {
        radio.addEventListener('change', function () {
            touched.quote = true;
            // Remove invalid styling from boxes on selection
            document.getElementById('quoteOptions').classList.remove('options-invalid');
            validateQuote(true);
            updateProgress();
            updateSubmit();
        });
    });

    messageEl.addEventListener('input', function () {
        touched.message = true;
        validateMessage(true);
        updateProgress();
        updateSubmit();
    });

    // ── Form submit ───────────────────────────────────────────
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        // Mark everything touched and validate
        Object.keys(touched).forEach(k => touched[k] = true);
        const allOk = validateAll(true);
        updateProgress();
        updateSubmit();
        if (!allOk) return;

        // Trigger EmailJS (handled in emailjs-integration.js)
        const submitBtn     = document.getElementById('submitBtn');
        const submitSpinner = document.getElementById('submitSpinner');
        const submitIcon    = document.getElementById('submitIcon');
        const submitText    = document.getElementById('submitText');
        submitBtn.disabled = true;
        submitSpinner.classList.remove('d-none');
        submitIcon.classList.add('d-none');
        submitText.textContent = 'TRANSMITTING...';
    });

    // ── Init ──────────────────────────────────────────────────
    validateAll(false);
    updateProgress();
    updateSubmit();
});
