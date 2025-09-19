// SkillSphere Enhanced Utilities
// Loading states, error boundaries, form validation, UI/UX improvements

class SkillSphereUtils {
    constructor() {
        this.init();
    }

    init() {
        this.setupLoadingStates();
        this.setupErrorBoundaries();
        this.setupFormValidation();
        this.setupAnimations();
        this.setupAnalytics();
        this.setupCaching();
        this.setupAccessibility();
        this.bindEvents();
    }

    // Loading States Management
    setupLoadingStates() {
        this.loadingStates = new Map();
        this.createLoadingIndicators();
    }

    createLoadingIndicators() {
        const styles = `
            .loading-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                backdrop-filter: blur(5px);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
            }

            .loading-overlay.show {
                opacity: 1;
                visibility: visible;
            }

            .loading-spinner {
                width: 60px;
                height: 60px;
                border: 3px solid rgba(6, 182, 212, 0.3);
                border-top: 3px solid var(--accent);
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }

            .loading-text {
                color: white;
                margin-top: 1rem;
                font-size: 1.1rem;
                text-align: center;
            }

            .skeleton {
                background: linear-gradient(90deg, 
                    rgba(255, 255, 255, 0.1) 25%, 
                    rgba(255, 255, 255, 0.2) 50%, 
                    rgba(255, 255, 255, 0.1) 75%);
                background-size: 200% 100%;
                animation: skeleton-loading 1.5s infinite;
                border-radius: 8px;
            }

            .skeleton-text {
                height: 1rem;
                margin-bottom: 0.5rem;
            }

            .skeleton-title {
                height: 1.5rem;
                width: 60%;
                margin-bottom: 1rem;
            }

            .skeleton-avatar {
                width: 60px;
                height: 60px;
                border-radius: 50%;
            }

            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }

            @keyframes skeleton-loading {
                0% { background-position: -200% 0; }
                100% { background-position: 200% 0; }
            }
        `;

        this.injectStyles(styles);
    }

    showLoading(message = 'Loading...', key = 'default') {
        this.hideLoading(key); // Remove existing

        const overlay = document.createElement('div');
        overlay.className = 'loading-overlay';
        overlay.innerHTML = `
            <div class="loading-content">
                <div class="loading-spinner"></div>
                <div class="loading-text">${message}</div>
            </div>
        `;

        document.body.appendChild(overlay);
        this.loadingStates.set(key, overlay);

        requestAnimationFrame(() => {
            overlay.classList.add('show');
        });
    }

    hideLoading(key = 'default') {
        const overlay = this.loadingStates.get(key);
        if (overlay) {
            overlay.classList.remove('show');
            setTimeout(() => {
                overlay.remove();
                this.loadingStates.delete(key);
            }, 300);
        }
    }

    showSkeleton(container, type = 'default') {
        const skeletons = {
            default: `
                <div class="skeleton skeleton-title"></div>
                <div class="skeleton skeleton-text"></div>
                <div class="skeleton skeleton-text"></div>
                <div class="skeleton skeleton-text" style="width: 80%;"></div>
            `,
            job: `
                <div style="display: flex; gap: 1rem; align-items: center; margin-bottom: 1rem;">
                    <div class="skeleton skeleton-avatar"></div>
                    <div style="flex: 1;">
                        <div class="skeleton skeleton-title"></div>
                        <div class="skeleton skeleton-text" style="width: 70%;"></div>
                    </div>
                </div>
                <div class="skeleton skeleton-text"></div>
                <div class="skeleton skeleton-text"></div>
            `,
            skill: `
                <div class="skeleton skeleton-text" style="height: 2rem; width: 120px; border-radius: 50px;"></div>
            `
        };

        if (container) {
            container.innerHTML = skeletons[type] || skeletons.default;
        }
    }

    // Error Boundaries
    setupErrorBoundaries() {
        this.errorBoundaries = new Map();
        this.setupGlobalErrorHandling();
    }

    setupGlobalErrorHandling() {
        window.addEventListener('error', (event) => {
            this.handleError(event.error, 'JavaScript Error');
        });

        window.addEventListener('unhandledrejection', (event) => {
            this.handleError(event.reason, 'Promise Rejection');
        });

        // Network error handling
        window.addEventListener('online', () => {
            this.showToast('Connection restored', 'success');
            this.retryFailedRequests();
        });

        window.addEventListener('offline', () => {
            this.showToast('Connection lost. Please check your internet.', 'warning');
        });
    }

    handleError(error, type = 'Error') {
        console.error(`${type}:`, error);
        
        // Log error for analytics
        this.logError(error, type);

        // Show user-friendly error message
        const message = this.getUserFriendlyMessage(error);
        this.showToast(message, 'error');
    }

    getUserFriendlyMessage(error) {
        const errorMessages = {
            'NetworkError': 'Network connection problem. Please check your internet.',
            'TypeError': 'Something went wrong. Please try again.',
            'SyntaxError': 'Data format error. Please refresh the page.',
            'ReferenceError': 'Feature temporarily unavailable.',
            'default': 'An unexpected error occurred. Please try again.'
        };

        const errorType = error.constructor.name;
        return errorMessages[errorType] || errorMessages.default;
    }

    createErrorBoundary(container, fallbackContent = null) {
        const boundary = {
            container,
            originalContent: container.innerHTML,
            fallbackContent: fallbackContent || this.getDefaultErrorContent()
        };

        this.errorBoundaries.set(container, boundary);
        return boundary;
    }

    getDefaultErrorContent() {
        return `
            <div class="error-boundary">
                <div class="error-icon">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <h3>Something went wrong</h3>
                <p>We're sorry, but this section couldn't load properly.</p>
                <button class="btn btn-primary" onclick="skillsphereUtils.retryErrorBoundary(this)">
                    <i class="fas fa-redo"></i>
                    Try Again
                </button>
            </div>
        `;
    }

    triggerErrorBoundary(container, error) {
        const boundary = this.errorBoundaries.get(container);
        if (boundary) {
            container.innerHTML = boundary.fallbackContent;
            this.handleError(error, 'Component Error');
        }
    }

    retryErrorBoundary(button) {
        const errorBoundary = button.closest('.error-boundary');
        const container = errorBoundary.parentElement;
        const boundary = this.errorBoundaries.get(container);
        
        if (boundary) {
            container.innerHTML = boundary.originalContent;
            // Trigger re-initialization of the component
            this.dispatchEvent('component:retry', { container });
        }
    }

    // Form Validation
    setupFormValidation() {
        this.validators = {
            email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
            password: (value) => value.length >= 8 && /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(value),
            required: (value) => value.trim().length > 0,
            minLength: (length) => (value) => value.length >= length,
            maxLength: (length) => (value) => value.length <= length,
            phone: (value) => /^[\+]?[1-9][\d]{0,15}$/.test(value.replace(/[\s\-\(\)]/g, '')),
            url: (value) => {
                try {
                    new URL(value);
                    return true;
                } catch {
                    return false;
                }
            }
        };

        this.setupRealTimeValidation();
    }

    setupRealTimeValidation() {
        document.addEventListener('input', (e) => {
            if (e.target.hasAttribute('data-validate')) {
                this.validateField(e.target);
            }
        });

        document.addEventListener('blur', (e) => {
            if (e.target.hasAttribute('data-validate')) {
                this.validateField(e.target, true);
            }
        });
    }

    validateField(field, showErrors = false) {
        const rules = field.getAttribute('data-validate').split(' ');
        const value = field.value;
        const errors = [];

        rules.forEach(rule => {
            const [validatorName, param] = rule.split(':');
            const validator = this.validators[validatorName];
            
            if (validator) {
                const isValid = param ? validator(param)(value) : validator(value);
                if (!isValid) {
                    errors.push(this.getValidationMessage(validatorName, param));
                }
            }
        });

        this.updateFieldValidation(field, errors, showErrors);
        return errors.length === 0;
    }

    getValidationMessage(rule, param) {
        const messages = {
            required: 'This field is required',
            email: 'Please enter a valid email address',
            password: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character',
            minLength: `Minimum ${param} characters required`,
            maxLength: `Maximum ${param} characters allowed`,
            phone: 'Please enter a valid phone number',
            url: 'Please enter a valid URL'
        };

        return messages[rule] || 'Invalid input';
    }

    updateFieldValidation(field, errors, showErrors) {
        const container = field.closest('.form-group');
        if (!container) return;

        let errorElement = container.querySelector('.field-error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            container.appendChild(errorElement);
        }

        if (errors.length > 0) {
            field.classList.add('error');
            if (showErrors) {
                errorElement.textContent = errors[0];
                errorElement.style.display = 'block';
            }
        } else {
            field.classList.remove('error');
            errorElement.style.display = 'none';
            field.classList.add('valid');
        }
    }

    validateForm(form) {
        const fields = form.querySelectorAll('[data-validate]');
        let isValid = true;

        fields.forEach(field => {
            if (!this.validateField(field, true)) {
                isValid = false;
            }
        });

        return isValid;
    }

    // Enhanced Animations
    setupAnimations() {
        this.setupScrollAnimations();
        this.setupHoverAnimations();
        this.setupTransitions();
    }

    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        }, observerOptions);

        // Observe elements with animation classes
        document.querySelectorAll('.card, .feature-card, .tech-category, .testimonial-card, .roadmap-item, .team-member').forEach(el => {
            observer.observe(el);
        });
    }

    setupHoverAnimations() {
        const style = `
            .hover-lift {
                transition: transform 0.3s ease, box-shadow 0.3s ease;
            }

            .hover-lift:hover {
                transform: translateY(-5px);
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            }

            .hover-glow {
                transition: box-shadow 0.3s ease;
            }

            .hover-glow:hover {
                box-shadow: 0 0 20px rgba(6, 182, 212, 0.3);
            }

            .hover-scale {
                transition: transform 0.3s ease;
            }

            .hover-scale:hover {
                transform: scale(1.05);
            }

            @media (prefers-reduced-motion: reduce) {
                .hover-lift:hover,
                .hover-scale:hover {
                    transform: none;
                }
            }
        `;

        this.injectStyles(style);
    }

    setupTransitions() {
        // Add smooth transitions for dynamic content
        const style = `
            .fade-in {
                opacity: 0;
                transform: translateY(20px);
                transition: opacity 0.5s ease, transform 0.5s ease;
            }

            .fade-in.show {
                opacity: 1;
                transform: translateY(0);
            }

            .slide-in-left {
                opacity: 0;
                transform: translateX(-20px);
                transition: opacity 0.5s ease, transform 0.5s ease;
            }

            .slide-in-left.show {
                opacity: 1;
                transform: translateX(0);
            }

            .slide-in-right {
                opacity: 0;
                transform: translateX(20px);
                transition: opacity 0.5s ease, transform 0.5s ease;
            }

            .slide-in-right.show {
                opacity: 1;
                transform: translateX(0);
            }
        `;

        this.injectStyles(style);
    }

    // Toast Notifications
    showToast(message, type = 'info', duration = 5000) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas ${this.getToastIcon(type)}"></i>
                <span>${message}</span>
                <button class="toast-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        this.getToastContainer().appendChild(toast);

        requestAnimationFrame(() => {
            toast.classList.add('show');
        });

        if (duration > 0) {
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 300);
            }, duration);
        }

        return toast;
    }

    getToastIcon(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        return icons[type] || icons.info;
    }

    getToastContainer() {
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);

            const style = `
                .toast-container {
                    position: fixed;
                    top: 2rem;
                    right: 2rem;
                    z-index: 10000;
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .toast {
                    background: var(--dark);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
                    opacity: 0;
                    visibility: hidden;
                    transform: translateX(100%);
                    transition: all 0.3s ease;
                    max-width: 400px;
                    min-width: 300px;
                }

                .toast.show {
                    opacity: 1;
                    visibility: visible;
                    transform: translateX(0);
                }

                .toast-success { border-left: 4px solid #10b981; }
                .toast-error { border-left: 4px solid #ef4444; }
                .toast-warning { border-left: 4px solid #f59e0b; }
                .toast-info { border-left: 4px solid var(--accent); }

                .toast-content {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 1rem 1.5rem;
                    color: white;
                }

                .toast-success .toast-content i { color: #10b981; }
                .toast-error .toast-content i { color: #ef4444; }
                .toast-warning .toast-content i { color: #f59e0b; }
                .toast-info .toast-content i { color: var(--accent); }

                .toast-close {
                    background: none;
                    border: none;
                    color: rgba(255, 255, 255, 0.5);
                    cursor: pointer;
                    padding: 0.25rem;
                    border-radius: 4px;
                    transition: all 0.3s ease;
                    margin-left: auto;
                }

                .toast-close:hover {
                    background: rgba(255, 255, 255, 0.1);
                    color: rgba(255, 255, 255, 0.8);
                }

                @media (max-width: 768px) {
                    .toast-container {
                        top: 1rem;
                        right: 1rem;
                        left: 1rem;
                    }

                    .toast {
                        max-width: none;
                        min-width: auto;
                    }
                }
            `;

            this.injectStyles(style);
        }
        return container;
    }

    // Analytics Integration
    setupAnalytics() {
        this.analytics = {
            events: [],
            sessionId: this.generateSessionId(),
            userId: null
        };

        this.trackPageView();
        this.setupUserInteractionTracking();
    }

    generateSessionId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    trackEvent(category, action, label = null, value = null) {
        const event = {
            category,
            action,
            label,
            value,
            timestamp: Date.now(),
            sessionId: this.analytics.sessionId,
            userId: this.analytics.userId,
            url: window.location.href,
            userAgent: navigator.userAgent
        };

        this.analytics.events.push(event);
        
        // Send to analytics service (replace with actual implementation)
        this.sendAnalyticsEvent(event);
    }

    trackPageView() {
        this.trackEvent('Page', 'View', window.location.pathname);
    }

    setupUserInteractionTracking() {
        // Track button clicks
        document.addEventListener('click', (e) => {
            if (e.target.matches('button, .btn, a[href]')) {
                const text = e.target.textContent.trim() || e.target.getAttribute('aria-label') || 'Unknown';
                this.trackEvent('Interaction', 'Click', text);
            }
        });

        // Track form submissions
        document.addEventListener('submit', (e) => {
            const formId = e.target.id || 'Unknown Form';
            this.trackEvent('Form', 'Submit', formId);
        });

        // Track time on page
        let startTime = Date.now();
        window.addEventListener('beforeunload', () => {
            const timeSpent = Date.now() - startTime;
            this.trackEvent('Engagement', 'Time on Page', window.location.pathname, timeSpent);
        });
    }

    sendAnalyticsEvent(event) {
        // Mock implementation - replace with actual analytics service
        if (window.gtag) {
            window.gtag('event', event.action, {
                event_category: event.category,
                event_label: event.label,
                value: event.value
            });
        }

        // Store events locally for batch sending
        this.storeEventLocally(event);
    }

    storeEventLocally(event) {
        try {
            const events = JSON.parse(localStorage.getItem('skillsphere_analytics') || '[]');
            events.push(event);
            
            // Keep only last 100 events
            if (events.length > 100) {
                events.splice(0, events.length - 100);
            }
            
            localStorage.setItem('skillsphere_analytics', JSON.stringify(events));
        } catch (error) {
            console.warn('Failed to store analytics event:', error);
        }
    }

    // Data Caching
    setupCaching() {
        this.cache = new Map();
        this.cacheExpiry = new Map();
    }

    setCache(key, data, ttl = 300000) { // 5 minutes default
        this.cache.set(key, data);
        this.cacheExpiry.set(key, Date.now() + ttl);
        
        // Also store in localStorage for persistence
        try {
            localStorage.setItem(`cache_${key}`, JSON.stringify({
                data,
                expiry: Date.now() + ttl
            }));
        } catch (error) {
            console.warn('Failed to cache data:', error);
        }
    }

    getCache(key) {
        // Check memory cache first
        if (this.cache.has(key)) {
            const expiry = this.cacheExpiry.get(key);
            if (Date.now() < expiry) {
                return this.cache.get(key);
            } else {
                this.cache.delete(key);
                this.cacheExpiry.delete(key);
            }
        }

        // Check localStorage cache
        try {
            const cached = localStorage.getItem(`cache_${key}`);
            if (cached) {
                const { data, expiry } = JSON.parse(cached);
                if (Date.now() < expiry) {
                    this.cache.set(key, data);
                    this.cacheExpiry.set(key, expiry);
                    return data;
                } else {
                    localStorage.removeItem(`cache_${key}`);
                }
            }
        } catch (error) {
            console.warn('Failed to retrieve cached data:', error);
        }

        return null;
    }

    clearCache(key = null) {
        if (key) {
            this.cache.delete(key);
            this.cacheExpiry.delete(key);
            localStorage.removeItem(`cache_${key}`);
        } else {
            this.cache.clear();
            this.cacheExpiry.clear();
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith('cache_')) {
                    localStorage.removeItem(key);
                }
            });
        }
    }

    // Accessibility Improvements
    setupAccessibility() {
        this.setupKeyboardNavigation();
        this.setupFocusManagement();
        this.setupScreenReaderSupport();
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Escape key to close modals
            if (e.key === 'Escape') {
                const modal = document.querySelector('.auth-modal, .modal');
                if (modal) {
                    modal.remove();
                }
            }

            // Tab trapping in modals
            if (e.key === 'Tab') {
                const modal = document.querySelector('.auth-modal');
                if (modal) {
                    this.trapFocus(e, modal);
                }
            }
        });
    }

    trapFocus(e, container) {
        const focusableElements = container.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                lastElement.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === lastElement) {
                firstElement.focus();
                e.preventDefault();
            }
        }
    }

    setupFocusManagement() {
        // Add focus indicators
        const style = `
            .focus-visible {
                outline: 2px solid var(--accent);
                outline-offset: 2px;
            }

            button:focus-visible,
            a:focus-visible,
            input:focus-visible,
            select:focus-visible,
            textarea:focus-visible {
                outline: 2px solid var(--accent);
                outline-offset: 2px;
            }
        `;

        this.injectStyles(style);
    }

    setupScreenReaderSupport() {
        // Add ARIA labels to interactive elements without them
        document.querySelectorAll('button, a').forEach(element => {
            if (!element.hasAttribute('aria-label') && !element.textContent.trim()) {
                const icon = element.querySelector('i');
                if (icon) {
                    const iconClass = icon.className;
                    element.setAttribute('aria-label', this.getAriaLabelFromIcon(iconClass));
                }
            }
        });
    }

    getAriaLabelFromIcon(iconClass) {
        const iconLabels = {
            'fa-user': 'User profile',
            'fa-cog': 'Settings',
            'fa-sign-out-alt': 'Logout',
            'fa-times': 'Close',
            'fa-menu': 'Menu',
            'fa-search': 'Search',
            'fa-upload': 'Upload file',
            'fa-download': 'Download',
            'fa-edit': 'Edit',
            'fa-delete': 'Delete',
            'fa-save': 'Save',
            'fa-cancel': 'Cancel'
        };

        for (const [className, label] of Object.entries(iconLabels)) {
            if (iconClass.includes(className)) {
                return label;
            }
        }

        return 'Interactive element';
    }

    // Error Logging
    logError(error, type) {
        const errorLog = {
            type,
            message: error.message,
            stack: error.stack,
            timestamp: Date.now(),
            url: window.location.href,
            userAgent: navigator.userAgent,
            sessionId: this.analytics.sessionId
        };

        // Store locally
        try {
            const logs = JSON.parse(localStorage.getItem('skillsphere_errors') || '[]');
            logs.push(errorLog);
            
            // Keep only last 50 errors
            if (logs.length > 50) {
                logs.splice(0, logs.length - 50);
            }
            
            localStorage.setItem('skillsphere_errors', JSON.stringify(logs));
        } catch (e) {
            console.warn('Failed to log error locally:', e);
        }

        // Send to error tracking service (implement as needed)
        this.sendErrorLog(errorLog);
    }

    sendErrorLog(errorLog) {
        // Mock implementation - replace with actual error tracking service
        console.warn('Error logged:', errorLog);
    }

    // Utility Methods
    injectStyles(css) {
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    }

    dispatchEvent(type, data = {}) {
        const event = new CustomEvent(type, { detail: data });
        document.dispatchEvent(event);
    }

    debounce(func, wait) {
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

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    retryFailedRequests() {
        // Implement retry logic for failed network requests
        console.log('Retrying failed requests...');
    }

    bindEvents() {
        // Listen for component retry events
        document.addEventListener('component:retry', (e) => {
            console.log('Component retry requested for:', e.detail.container);
        });

        // Listen for auth events to update analytics
        document.addEventListener('auth:login', (e) => {
            this.analytics.userId = e.detail.id;
            this.trackEvent('Auth', 'Login', 'Success');
        });

        document.addEventListener('auth:logout', () => {
            this.analytics.userId = null;
            this.trackEvent('Auth', 'Logout', 'Success');
        });
    }
}

// Initialize utilities
const skillsphereUtils = new SkillSphereUtils();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SkillSphereUtils;
}