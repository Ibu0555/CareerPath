// SkillSphere Authentication System
// Comprehensive authentication with JWT, social login, and security features

class AuthSystem {
    constructor() {
        this.baseURL = window.location.origin;
        this.sessionKey = 'skillsphere_session';
        this.rememberKey = 'skillsphere_remember';
        this.maxLoginAttempts = 5;
        this.lockoutTime = 15 * 60 * 1000; // 15 minutes
        this.init();
    }

    init() {
        this.bindEvents();
        this.checkExistingSession();
        this.setupCSRFProtection();
        this.initializeRateLimiting();
    }

    // Session Management
    checkExistingSession() {
        const session = this.getStoredSession();
        if (session && this.isValidToken(session.token)) {
            this.setAuthenticatedState(session.user);
        } else {
            this.clearSession();
        }
    }

    getStoredSession() {
        try {
            const sessionData = localStorage.getItem(this.sessionKey) || 
                               sessionStorage.getItem(this.sessionKey);
            return sessionData ? JSON.parse(sessionData) : null;
        } catch (error) {
            console.error('Error parsing session data:', error);
            return null;
        }
    }

    setSession(user, token, remember = false) {
        const sessionData = {
            user,
            token,
            timestamp: Date.now(),
            expiresAt: Date.now() + (remember ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000) // 30 days or 1 day
        };

        const storage = remember ? localStorage : sessionStorage;
        storage.setItem(this.sessionKey, JSON.stringify(sessionData));
        
        this.setAuthenticatedState(user);
    }

    clearSession() {
        localStorage.removeItem(this.sessionKey);
        sessionStorage.removeItem(this.sessionKey);
        localStorage.removeItem(this.rememberKey);
        this.setUnauthenticatedState();
    }

    isValidToken(token) {
        if (!token) return false;
        
        try {
            // Basic JWT validation (in production, verify signature on server)
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.exp > Date.now() / 1000;
        } catch (error) {
            return false;
        }
    }

    // Authentication State Management
    setAuthenticatedState(user) {
        this.currentUser = user;
        this.updateUI(true);
        this.dispatchAuthEvent('login', user);
    }

    setUnauthenticatedState() {
        this.currentUser = null;
        this.updateUI(false);
        this.dispatchAuthEvent('logout');
    }

    updateUI(isAuthenticated) {
        const signInBtn = document.querySelector('.btn-outline');
        const getStartedBtn = document.querySelector('.btn-primary');
        const navActions = document.querySelector('.nav-actions');

        if (isAuthenticated && this.currentUser) {
            navActions.innerHTML = `
                <div class="user-menu">
                    <button class="user-avatar" id="userMenuBtn">
                        <img src="${this.currentUser.avatar || '/default-avatar.png'}" alt="${this.currentUser.name}">
                        <span>${this.currentUser.name}</span>
                        <i class="fas fa-chevron-down"></i>
                    </button>
                    <div class="user-dropdown" id="userDropdown">
                        <a href="#profile" class="dropdown-item">
                            <i class="fas fa-user"></i> Profile
                        </a>
                        <a href="#settings" class="dropdown-item">
                            <i class="fas fa-cog"></i> Settings
                        </a>
                        <div class="dropdown-divider"></div>
                        <button class="dropdown-item" onclick="auth.logout()">
                            <i class="fas fa-sign-out-alt"></i> Logout
                        </button>
                    </div>
                </div>
            `;
            this.setupUserMenu();
        } else {
            navActions.innerHTML = `
                <a href="#" class="btn btn-outline" onclick="auth.showLoginModal()">Sign In</a>
                <a href="#" class="btn btn-primary" onclick="auth.showRegisterModal()">Get Started</a>
            `;
        }
    }

    setupUserMenu() {
        const userMenuBtn = document.getElementById('userMenuBtn');
        const userDropdown = document.getElementById('userDropdown');

        if (userMenuBtn && userDropdown) {
            userMenuBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                userDropdown.classList.toggle('show');
            });

            document.addEventListener('click', () => {
                userDropdown.classList.remove('show');
            });
        }
    }

    dispatchAuthEvent(type, data = null) {
        const event = new CustomEvent(`auth:${type}`, { detail: data });
        document.dispatchEvent(event);
    }

    // Rate Limiting
    initializeRateLimiting() {
        this.loginAttempts = this.getLoginAttempts();
    }

    getLoginAttempts() {
        const attempts = localStorage.getItem('login_attempts');
        return attempts ? JSON.parse(attempts) : { count: 0, lastAttempt: 0 };
    }

    recordLoginAttempt(failed = false) {
        const now = Date.now();
        
        if (failed) {
            this.loginAttempts.count += 1;
            this.loginAttempts.lastAttempt = now;
        } else {
            this.loginAttempts = { count: 0, lastAttempt: 0 };
        }

        localStorage.setItem('login_attempts', JSON.stringify(this.loginAttempts));
    }

    isRateLimited() {
        const now = Date.now();
        if (this.loginAttempts.count >= this.maxLoginAttempts) {
            const timeSinceLastAttempt = now - this.loginAttempts.lastAttempt;
            return timeSinceLastAttempt < this.lockoutTime;
        }
        return false;
    }

    getRemainingLockoutTime() {
        const now = Date.now();
        const timeSinceLastAttempt = now - this.loginAttempts.lastAttempt;
        return Math.max(0, this.lockoutTime - timeSinceLastAttempt);
    }

    // CSRF Protection
    setupCSRFProtection() {
        this.csrfToken = this.generateCSRFToken();
        document.querySelector('meta[name="csrf-token"]')?.setAttribute('content', this.csrfToken);
    }

    generateCSRFToken() {
        return Array.from(crypto.getRandomValues(new Uint8Array(32)))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }

    // Modal Management
    showLoginModal() {
        if (this.isRateLimited()) {
            const remainingTime = Math.ceil(this.getRemainingLockoutTime() / 1000 / 60);
            this.showError(`Too many login attempts. Please try again in ${remainingTime} minutes.`);
            return;
        }
        this.createModal('login');
    }

    showRegisterModal() {
        this.createModal('register');
    }

    showForgotPasswordModal() {
        this.createModal('forgot-password');
    }

    createModal(type) {
        // Remove existing modals
        document.querySelectorAll('.auth-modal').forEach(modal => modal.remove());

        const modal = document.createElement('div');
        modal.className = 'auth-modal';
        modal.innerHTML = this.getModalContent(type);
        document.body.appendChild(modal);

        // Show modal with animation
        requestAnimationFrame(() => {
            modal.classList.add('show');
        });

        this.bindModalEvents(modal, type);
    }

    getModalContent(type) {
        const contents = {
            login: this.getLoginModalContent(),
            register: this.getRegisterModalContent(),
            'forgot-password': this.getForgotPasswordModalContent()
        };
        return contents[type] || '';
    }

    getLoginModalContent() {
        return `
            <div class="modal-overlay" onclick="this.parentElement.remove()">
                <div class="modal-content" onclick="event.stopPropagation()">
                    <div class="modal-header">
                        <h2><i class="fas fa-sign-in-alt"></i> Welcome Back</h2>
                        <button class="close-btn" onclick="this.closest('.auth-modal').remove()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form id="loginForm" class="auth-form">
                            <div class="form-group">
                                <label for="loginEmail">Email Address</label>
                                <input type="email" id="loginEmail" name="email" required 
                                       placeholder="Enter your email" autocomplete="username">
                                <div class="field-error" id="emailError"></div>
                            </div>
                            <div class="form-group">
                                <label for="loginPassword">Password</label>
                                <div class="password-input">
                                    <input type="password" id="loginPassword" name="password" required 
                                           placeholder="Enter your password" autocomplete="current-password">
                                    <button type="button" class="toggle-password" onclick="auth.togglePassword('loginPassword')">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                </div>
                                <div class="field-error" id="passwordError"></div>
                            </div>
                            <div class="form-options">
                                <label class="checkbox-label">
                                    <input type="checkbox" id="rememberMe" name="remember">
                                    <span class="checkmark"></span>
                                    Remember me for 30 days
                                </label>
                                <a href="#" onclick="auth.showForgotPasswordModal()" class="forgot-link">
                                    Forgot password?
                                </a>
                            </div>
                            <button type="submit" class="btn btn-primary btn-full">
                                <i class="fas fa-sign-in-alt"></i>
                                Sign In
                            </button>
                        </form>
                        <div class="divider">
                            <span>or continue with</span>
                        </div>
                        <div class="social-login">
                            <button class="btn btn-social google" onclick="auth.socialLogin('google')">
                                <i class="fab fa-google"></i>
                                Google
                            </button>
                            <button class="btn btn-social github" onclick="auth.socialLogin('github')">
                                <i class="fab fa-github"></i>
                                GitHub
                            </button>
                            <button class="btn btn-social linkedin" onclick="auth.socialLogin('linkedin')">
                                <i class="fab fa-linkedin"></i>
                                LinkedIn
                            </button>
                        </div>
                        <div class="modal-footer">
                            Don't have an account? 
                            <a href="#" onclick="auth.showRegisterModal()">Sign up here</a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getRegisterModalContent() {
        return `
            <div class="modal-overlay" onclick="this.parentElement.remove()">
                <div class="modal-content" onclick="event.stopPropagation()">
                    <div class="modal-header">
                        <h2><i class="fas fa-user-plus"></i> Create Account</h2>
                        <button class="close-btn" onclick="this.closest('.auth-modal').remove()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form id="registerForm" class="auth-form">
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="firstName">First Name</label>
                                    <input type="text" id="firstName" name="firstName" required 
                                           placeholder="John" autocomplete="given-name">
                                    <div class="field-error" id="firstNameError"></div>
                                </div>
                                <div class="form-group">
                                    <label for="lastName">Last Name</label>
                                    <input type="text" id="lastName" name="lastName" required 
                                           placeholder="Doe" autocomplete="family-name">
                                    <div class="field-error" id="lastNameError"></div>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="registerEmail">Email Address</label>
                                <input type="email" id="registerEmail" name="email" required 
                                       placeholder="john@example.com" autocomplete="username">
                                <div class="field-error" id="registerEmailError"></div>
                            </div>
                            <div class="form-group">
                                <label for="registerPassword">Password</label>
                                <div class="password-input">
                                    <input type="password" id="registerPassword" name="password" required 
                                           placeholder="Create a strong password" autocomplete="new-password">
                                    <button type="button" class="toggle-password" onclick="auth.togglePassword('registerPassword')">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                </div>
                                <div class="password-strength" id="passwordStrength"></div>
                                <div class="field-error" id="registerPasswordError"></div>
                            </div>
                            <div class="form-group">
                                <label for="confirmPassword">Confirm Password</label>
                                <div class="password-input">
                                    <input type="password" id="confirmPassword" name="confirmPassword" required 
                                           placeholder="Confirm your password" autocomplete="new-password">
                                    <button type="button" class="toggle-password" onclick="auth.togglePassword('confirmPassword')">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                </div>
                                <div class="field-error" id="confirmPasswordError"></div>
                            </div>
                            <div class="form-group">
                                <label class="checkbox-label">
                                    <input type="checkbox" id="agreeTerms" name="agreeTerms" required>
                                    <span class="checkmark"></span>
                                    I agree to the <a href="#terms" target="_blank">Terms of Service</a> 
                                    and <a href="#privacy" target="_blank">Privacy Policy</a>
                                </label>
                                <div class="field-error" id="agreeTermsError"></div>
                            </div>
                            <button type="submit" class="btn btn-primary btn-full">
                                <i class="fas fa-user-plus"></i>
                                Create Account
                            </button>
                        </form>
                        <div class="divider">
                            <span>or sign up with</span>
                        </div>
                        <div class="social-login">
                            <button class="btn btn-social google" onclick="auth.socialLogin('google')">
                                <i class="fab fa-google"></i>
                                Google
                            </button>
                            <button class="btn btn-social github" onclick="auth.socialLogin('github')">
                                <i class="fab fa-github"></i>
                                GitHub
                            </button>
                            <button class="btn btn-social linkedin" onclick="auth.socialLogin('linkedin')">
                                <i class="fab fa-linkedin"></i>
                                LinkedIn
                            </button>
                        </div>
                        <div class="modal-footer">
                            Already have an account? 
                            <a href="#" onclick="auth.showLoginModal()">Sign in here</a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getForgotPasswordModalContent() {
        return `
            <div class="modal-overlay" onclick="this.parentElement.remove()">
                <div class="modal-content" onclick="event.stopPropagation()">
                    <div class="modal-header">
                        <h2><i class="fas fa-key"></i> Reset Password</h2>
                        <button class="close-btn" onclick="this.closest('.auth-modal').remove()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div id="forgotPasswordStep1">
                            <p>Enter your email address and we'll send you a link to reset your password.</p>
                            <form id="forgotPasswordForm" class="auth-form">
                                <div class="form-group">
                                    <label for="forgotEmail">Email Address</label>
                                    <input type="email" id="forgotEmail" name="email" required 
                                           placeholder="Enter your email" autocomplete="username">
                                    <div class="field-error" id="forgotEmailError"></div>
                                </div>
                                <button type="submit" class="btn btn-primary btn-full">
                                    <i class="fas fa-paper-plane"></i>
                                    Send Reset Link
                                </button>
                            </form>
                        </div>
                        <div id="forgotPasswordStep2" style="display: none;">
                            <div class="success-message">
                                <i class="fas fa-check-circle"></i>
                                <h3>Check your email</h3>
                                <p>We've sent a password reset link to your email address.</p>
                            </div>
                        </div>
                        <div class="modal-footer">
                            Remember your password? 
                            <a href="#" onclick="auth.showLoginModal()">Sign in here</a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    bindModalEvents(modal, type) {
        const form = modal.querySelector('form');
        if (form) {
            form.addEventListener('submit', (e) => this.handleFormSubmit(e, type));
        }

        // Real-time validation for register form
        if (type === 'register') {
            const passwordInput = modal.querySelector('#registerPassword');
            const confirmPasswordInput = modal.querySelector('#confirmPassword');
            
            passwordInput?.addEventListener('input', (e) => this.validatePasswordStrength(e.target.value));
            confirmPasswordInput?.addEventListener('input', (e) => this.validatePasswordMatch());
        }

        // Close modal on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                modal.remove();
            }
        });
    }

    async handleFormSubmit(e, type) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        submitBtn.disabled = true;

        try {
            if (type === 'login') {
                await this.handleLogin(data);
            } else if (type === 'register') {
                await this.handleRegister(data);
            } else if (type === 'forgot-password') {
                await this.handleForgotPassword(data);
            }
        } catch (error) {
            this.showError(error.message);
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    async handleLogin(data) {
        // Validate input
        if (!this.validateLoginForm(data)) {
            return;
        }

        // Simulate API call (replace with actual API call)
        const response = await this.mockLogin(data);
        
        if (response.success) {
            this.recordLoginAttempt(false);
            this.setSession(response.user, response.token, data.remember);
            document.querySelector('.auth-modal').remove();
            this.showSuccess('Welcome back! You have been successfully logged in.');
        } else {
            this.recordLoginAttempt(true);
            throw new Error(response.message || 'Login failed');
        }
    }

    async handleRegister(data) {
        // Validate input
        if (!this.validateRegisterForm(data)) {
            return;
        }

        // Simulate API call (replace with actual API call)
        const response = await this.mockRegister(data);
        
        if (response.success) {
            this.setSession(response.user, response.token, false);
            document.querySelector('.auth-modal').remove();
            this.showSuccess('Account created successfully! Welcome to SkillSphere.');
        } else {
            throw new Error(response.message || 'Registration failed');
        }
    }

    async handleForgotPassword(data) {
        // Validate email
        if (!this.validateEmail(data.email)) {
            this.showFieldError('forgotEmailError', 'Please enter a valid email address');
            return;
        }

        // Simulate API call (replace with actual API call)
        const response = await this.mockForgotPassword(data);
        
        if (response.success) {
            document.getElementById('forgotPasswordStep1').style.display = 'none';
            document.getElementById('forgotPasswordStep2').style.display = 'block';
        } else {
            throw new Error(response.message || 'Failed to send reset email');
        }
    }

    // Validation Methods
    validateLoginForm(data) {
        let isValid = true;

        if (!this.validateEmail(data.email)) {
            this.showFieldError('emailError', 'Please enter a valid email address');
            isValid = false;
        }

        if (!data.password || data.password.length < 1) {
            this.showFieldError('passwordError', 'Please enter your password');
            isValid = false;
        }

        return isValid;
    }

    validateRegisterForm(data) {
        let isValid = true;

        if (!data.firstName || data.firstName.length < 2) {
            this.showFieldError('firstNameError', 'First name must be at least 2 characters');
            isValid = false;
        }

        if (!data.lastName || data.lastName.length < 2) {
            this.showFieldError('lastNameError', 'Last name must be at least 2 characters');
            isValid = false;
        }

        if (!this.validateEmail(data.email)) {
            this.showFieldError('registerEmailError', 'Please enter a valid email address');
            isValid = false;
        }

        if (!this.validatePassword(data.password)) {
            this.showFieldError('registerPasswordError', 'Password must be at least 8 characters with uppercase, lowercase, number, and special character');
            isValid = false;
        }

        if (data.password !== data.confirmPassword) {
            this.showFieldError('confirmPasswordError', 'Passwords do not match');
            isValid = false;
        }

        if (!data.agreeTerms) {
            this.showFieldError('agreeTermsError', 'You must agree to the terms and conditions');
            isValid = false;
        }

        return isValid;
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    validatePassword(password) {
        // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    }

    validatePasswordStrength(password) {
        const strengthIndicator = document.getElementById('passwordStrength');
        if (!strengthIndicator) return;

        const requirements = [
            { regex: /.{8,}/, text: 'At least 8 characters' },
            { regex: /[A-Z]/, text: 'One uppercase letter' },
            { regex: /[a-z]/, text: 'One lowercase letter' },
            { regex: /\d/, text: 'One number' },
            { regex: /[@$!%*?&]/, text: 'One special character' }
        ];

        let score = 0;
        let html = '<div class="password-requirements">';

        requirements.forEach(req => {
            const met = req.regex.test(password);
            if (met) score++;
            html += `<div class="requirement ${met ? 'met' : ''}">
                <i class="fas ${met ? 'fa-check' : 'fa-times'}"></i>
                ${req.text}
            </div>`;
        });

        html += '</div>';

        const strength = score < 3 ? 'weak' : score < 5 ? 'medium' : 'strong';
        html += `<div class="strength-bar">
            <div class="strength-fill ${strength}" style="width: ${(score / 5) * 100}%"></div>
        </div>`;

        strengthIndicator.innerHTML = html;
    }

    validatePasswordMatch() {
        const password = document.getElementById('registerPassword')?.value;
        const confirmPassword = document.getElementById('confirmPassword')?.value;
        
        if (confirmPassword && password !== confirmPassword) {
            this.showFieldError('confirmPasswordError', 'Passwords do not match');
        } else {
            this.clearFieldError('confirmPasswordError');
        }
    }

    showFieldError(fieldId, message) {
        const errorElement = document.getElementById(fieldId);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }

    clearFieldError(fieldId) {
        const errorElement = document.getElementById(fieldId);
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
    }

    // Utility Methods
    togglePassword(inputId) {
        const input = document.getElementById(inputId);
        const icon = input.nextElementSibling.querySelector('i');
        
        if (input.type === 'password') {
            input.type = 'text';
            icon.className = 'fas fa-eye-slash';
        } else {
            input.type = 'password';
            icon.className = 'fas fa-eye';
        }
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
                <span>${message}</span>
                <button class="close-notification" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        document.body.appendChild(notification);

        requestAnimationFrame(() => {
            notification.classList.add('show');
        });

        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    // Social Login
    async socialLogin(provider) {
        try {
            const authUrl = this.getSocialAuthUrl(provider);
            const popup = window.open(authUrl, `${provider}-login`, 'width=500,height=600');
            
            const result = await this.waitForSocialCallback(popup);
            
            if (result.success) {
                this.setSession(result.user, result.token, false);
                document.querySelector('.auth-modal')?.remove();
                this.showSuccess(`Successfully logged in with ${provider}!`);
            } else {
                throw new Error(result.message || `${provider} login failed`);
            }
        } catch (error) {
            this.showError(error.message);
        }
    }

    getSocialAuthUrl(provider) {
        const redirectUri = `${this.baseURL}/auth/callback/${provider}`;
        const urls = {
            google: `https://accounts.google.com/oauth/v2/auth?client_id=YOUR_GOOGLE_CLIENT_ID&redirect_uri=${redirectUri}&response_type=code&scope=profile email`,
            github: `https://github.com/login/oauth/authorize?client_id=YOUR_GITHUB_CLIENT_ID&redirect_uri=${redirectUri}&scope=user:email`,
            linkedin: `https://www.linkedin.com/oauth/v2/authorization?client_id=YOUR_LINKEDIN_CLIENT_ID&redirect_uri=${redirectUri}&response_type=code&scope=r_liteprofile r_emailaddress`
        };
        return urls[provider];
    }

    waitForSocialCallback(popup) {
        return new Promise((resolve, reject) => {
            const timer = setInterval(() => {
                if (popup.closed) {
                    clearInterval(timer);
                    reject(new Error('Social login was cancelled'));
                }
            }, 1000);

            window.addEventListener('message', (event) => {
                if (event.origin !== this.baseURL) return;
                
                clearInterval(timer);
                popup.close();
                
                if (event.data.success) {
                    resolve(event.data);
                } else {
                    reject(new Error(event.data.message || 'Social login failed'));
                }
            }, { once: true });
        });
    }

    // Mock API Methods (replace with actual API calls)
    async mockLogin(data) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock successful login
        if (data.email === 'demo@skillsphere.com' && data.password === 'password123') {
            return {
                success: true,
                user: {
                    id: '1',
                    name: 'Demo User',
                    email: 'demo@skillsphere.com',
                    avatar: 'https://via.placeholder.com/40x40/6366f1/ffffff?text=DU'
                },
                token: this.generateMockToken()
            };
        }
        
        return {
            success: false,
            message: 'Invalid email or password'
        };
    }

    async mockRegister(data) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return {
            success: true,
            user: {
                id: Date.now().toString(),
                name: `${data.firstName} ${data.lastName}`,
                email: data.email,
                avatar: `https://via.placeholder.com/40x40/6366f1/ffffff?text=${data.firstName[0]}${data.lastName[0]}`
            },
            token: this.generateMockToken()
        };
    }

    async mockForgotPassword(data) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return {
            success: true,
            message: 'Password reset email sent'
        };
    }

    generateMockToken() {
        const header = btoa(JSON.stringify({ typ: 'JWT', alg: 'HS256' }));
        const payload = btoa(JSON.stringify({
            sub: '1',
            email: 'demo@skillsphere.com',
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
        }));
        const signature = 'mock-signature';
        
        return `${header}.${payload}.${signature}`;
    }

    // Public Methods
    logout() {
        this.clearSession();
        this.showSuccess('You have been successfully logged out.');
    }

    getCurrentUser() {
        return this.currentUser;
    }

    isAuthenticated() {
        return !!this.currentUser;
    }

    bindEvents() {
        // Listen for auth events
        document.addEventListener('auth:login', (e) => {
            console.log('User logged in:', e.detail);
        });

        document.addEventListener('auth:logout', () => {
            console.log('User logged out');
        });
    }
}

// Initialize auth system
const auth = new AuthSystem();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthSystem;
}