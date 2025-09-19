// Simple Demo Authentication System
// Working authentication for demonstration purposes

function showLoginModal() {
    // Remove existing modals
    const existingModal = document.querySelector('.auth-modal');
    if (existingModal) {
        existingModal.remove();
    }

    const modal = document.createElement('div');
    modal.className = 'auth-modal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="this.parentElement.remove()">
            <div class="modal-content" onclick="event.stopPropagation()">
                <div class="modal-header">
                    <h2><i class="fas fa-sign-in-alt"></i> Welcome Back</h2>
                    <button class="close-btn" onclick="this.closest('.auth-modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <form id="loginForm" class="auth-form" onsubmit="handleLogin(event)">
                        <div class="form-group">
                            <label for="loginEmail">Email Address</label>
                            <input type="email" id="loginEmail" name="email" required 
                                   placeholder="Enter your email (demo@skillsphere.com)" value="demo@skillsphere.com">
                        </div>
                        <div class="form-group">
                            <label for="loginPassword">Password</label>
                            <div class="password-input">
                                <input type="password" id="loginPassword" name="password" required 
                                       placeholder="Enter your password (password123)" value="password123">
                                <button type="button" class="toggle-password" onclick="togglePassword('loginPassword')">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </div>
                        </div>
                        <div class="form-options">
                            <label class="checkbox-label">
                                <input type="checkbox" id="rememberMe" name="remember">
                                <span class="checkmark"></span>
                                Remember me for 30 days
                            </label>
                            <a href="#" onclick="showForgotPasswordModal()" class="forgot-link">
                                Forgot password?
                            </a>
                        </div>
                        <button type="submit" class="btn btn-primary btn-full">
                            <i class="fas fa-sign-in-alt"></i>
                            Sign In
                        </button>
                        <div class="demo-info">
                            <small>Demo credentials: demo@skillsphere.com / password123</small>
                        </div>
                    </form>
                    <div class="divider">
                        <span>or continue with</span>
                    </div>
                    <div class="social-login">
                        <button class="btn btn-social google" onclick="handleSocialLogin('google')">
                            <i class="fab fa-google"></i>
                            Google
                        </button>
                        <button class="btn btn-social github" onclick="handleSocialLogin('github')">
                            <i class="fab fa-github"></i>
                            GitHub
                        </button>
                        <button class="btn btn-social linkedin" onclick="handleSocialLogin('linkedin')">
                            <i class="fab fa-linkedin"></i>
                            LinkedIn
                        </button>
                    </div>
                    <div class="modal-footer">
                        Don't have an account? 
                        <a href="#" onclick="showRegisterModal()">Sign up here</a>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Show modal with animation
    requestAnimationFrame(() => {
        modal.classList.add('show');
    });

    // Focus first input
    setTimeout(() => {
        const emailInput = modal.querySelector('#loginEmail');
        if (emailInput) emailInput.focus();
    }, 300);
}

function showRegisterModal() {
    // Remove existing modals
    const existingModal = document.querySelector('.auth-modal');
    if (existingModal) {
        existingModal.remove();
    }

    const modal = document.createElement('div');
    modal.className = 'auth-modal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="this.parentElement.remove()">
            <div class="modal-content" onclick="event.stopPropagation()">
                <div class="modal-header">
                    <h2><i class="fas fa-user-plus"></i> Create Account</h2>
                    <button class="close-btn" onclick="this.closest('.auth-modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <form id="registerForm" class="auth-form" onsubmit="handleRegister(event)">
                        <div class="form-row">
                            <div class="form-group">
                                <label for="firstName">First Name</label>
                                <input type="text" id="firstName" name="firstName" required 
                                       placeholder="John" value="John">
                            </div>
                            <div class="form-group">
                                <label for="lastName">Last Name</label>
                                <input type="text" id="lastName" name="lastName" required 
                                       placeholder="Doe" value="Doe">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="registerEmail">Email Address</label>
                            <input type="email" id="registerEmail" name="email" required 
                                   placeholder="john@example.com" value="john@example.com">
                        </div>
                        <div class="form-group">
                            <label for="registerPassword">Password</label>
                            <div class="password-input">
                                <input type="password" id="registerPassword" name="password" required 
                                       placeholder="Create a strong password" value="Password123!">
                                <button type="button" class="toggle-password" onclick="togglePassword('registerPassword')">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="confirmPassword">Confirm Password</label>
                            <div class="password-input">
                                <input type="password" id="confirmPassword" name="confirmPassword" required 
                                       placeholder="Confirm your password" value="Password123!">
                                <button type="button" class="toggle-password" onclick="togglePassword('confirmPassword')">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="checkbox-label">
                                <input type="checkbox" id="agreeTerms" name="agreeTerms" required checked>
                                <span class="checkmark"></span>
                                I agree to the <a href="#terms" target="_blank">Terms of Service</a> 
                                and <a href="#privacy" target="_blank">Privacy Policy</a>
                            </label>
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
                        <button class="btn btn-social google" onclick="handleSocialLogin('google')">
                            <i class="fab fa-google"></i>
                            Google
                        </button>
                        <button class="btn btn-social github" onclick="handleSocialLogin('github')">
                            <i class="fab fa-github"></i>
                            GitHub
                        </button>
                        <button class="btn btn-social linkedin" onclick="handleSocialLogin('linkedin')">
                            <i class="fab fa-linkedin"></i>
                            LinkedIn
                        </button>
                    </div>
                    <div class="modal-footer">
                        Already have an account? 
                        <a href="#" onclick="showLoginModal()">Sign in here</a>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Show modal with animation
    requestAnimationFrame(() => {
        modal.classList.add('show');
    });
}

function showForgotPasswordModal() {
    // Remove existing modals
    const existingModal = document.querySelector('.auth-modal');
    if (existingModal) {
        existingModal.remove();
    }

    const modal = document.createElement('div');
    modal.className = 'auth-modal';
    modal.innerHTML = `
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
                        <form id="forgotPasswordForm" class="auth-form" onsubmit="handleForgotPassword(event)">
                            <div class="form-group">
                                <label for="forgotEmail">Email Address</label>
                                <input type="email" id="forgotEmail" name="email" required 
                                       placeholder="Enter your email">
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
                        <a href="#" onclick="showLoginModal()">Sign in here</a>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Show modal with animation
    requestAnimationFrame(() => {
        modal.classList.add('show');
    });
}

function handleLogin(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const email = formData.get('email');
    const password = formData.get('password');
    const remember = formData.get('remember');

    // Show loading
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';
    submitBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
        if (email === 'demo@skillsphere.com' && password === 'password123') {
            // Success
            const user = {
                id: '1',
                name: 'Demo User',
                email: 'demo@skillsphere.com',
                avatar: 'https://via.placeholder.com/40x40/6366f1/ffffff?text=DU'
            };

            // Store session
            const sessionData = {
                user,
                timestamp: Date.now(),
                remember: !!remember
            };

            if (remember) {
                localStorage.setItem('skillsphere_session', JSON.stringify(sessionData));
            } else {
                sessionStorage.setItem('skillsphere_session', JSON.stringify(sessionData));
            }

            // Update UI
            updateAuthenticatedUI(user);
            
            // Close modal
            document.querySelector('.auth-modal').remove();
            
            // Show success
            showToast('Welcome back! You have been successfully logged in.', 'success');
        } else {
            // Failure
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            showToast('Invalid email or password. Try demo@skillsphere.com / password123', 'error');
        }
    }, 1000);
}

function handleRegister(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const email = formData.get('email');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');

    // Validate passwords match
    if (password !== confirmPassword) {
        showToast('Passwords do not match', 'error');
        return;
    }

    // Show loading
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...';
    submitBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
        const user = {
            id: Date.now().toString(),
            name: `${firstName} ${lastName}`,
            email: email,
            avatar: `https://via.placeholder.com/40x40/6366f1/ffffff?text=${firstName[0]}${lastName[0]}`
        };

        // Store session
        const sessionData = {
            user,
            timestamp: Date.now(),
            remember: false
        };

        sessionStorage.setItem('skillsphere_session', JSON.stringify(sessionData));

        // Update UI
        updateAuthenticatedUI(user);
        
        // Close modal
        document.querySelector('.auth-modal').remove();
        
        // Show success
        showToast('Account created successfully! Welcome to SkillSphere.', 'success');
    }, 1000);
}

function handleForgotPassword(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const email = formData.get('email');

    // Show loading
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
        document.getElementById('forgotPasswordStep1').style.display = 'none';
        document.getElementById('forgotPasswordStep2').style.display = 'block';
    }, 1000);
}

function handleSocialLogin(provider) {
    showToast(`${provider.charAt(0).toUpperCase() + provider.slice(1)} login would redirect to OAuth provider in a real implementation.`, 'info');
}

function togglePassword(inputId) {
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

function updateAuthenticatedUI(user) {
    const navActions = document.querySelector('.nav-actions');
    if (navActions) {
        navActions.innerHTML = `
            <div class="user-menu">
                <button class="user-avatar" onclick="toggleUserDropdown()">
                    <img src="${user.avatar}" alt="${user.name}">
                    <span>${user.name}</span>
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
                    <button class="dropdown-item" onclick="logout()">
                        <i class="fas fa-sign-out-alt"></i> Logout
                    </button>
                </div>
            </div>
        `;
    }
}

function toggleUserDropdown() {
    const dropdown = document.getElementById('userDropdown');
    if (dropdown) {
        dropdown.classList.toggle('show');
    }
}

function logout() {
    // Clear session
    localStorage.removeItem('skillsphere_session');
    sessionStorage.removeItem('skillsphere_session');
    
    // Reset UI
    const navActions = document.querySelector('.nav-actions');
    if (navActions) {
        navActions.innerHTML = `
            <a href="#" class="btn btn-outline" onclick="showLoginModal(); return false;">Sign In</a>
            <a href="#" class="btn btn-primary" onclick="showRegisterModal(); return false;">Get Started</a>
        `;
    }
    
    // Close dropdown
    const dropdown = document.getElementById('userDropdown');
    if (dropdown) {
        dropdown.classList.remove('show');
    }
    
    showToast('You have been successfully logged out.', 'success');
}

function showToast(message, type = 'info') {
    // Create toast container if it doesn't exist
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const iconMap = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas ${iconMap[type] || iconMap.info}"></i>
            <span>${message}</span>
            <button class="toast-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;

    container.appendChild(toast);

    requestAnimationFrame(() => {
        toast.classList.add('show');
    });

    // Auto remove after 5 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 5000);
}

// Check for existing session on load
function checkExistingSession() {
    const sessionData = localStorage.getItem('skillsphere_session') || 
                       sessionStorage.getItem('skillsphere_session');
    
    if (sessionData) {
        try {
            const { user, timestamp, remember } = JSON.parse(sessionData);
            
            // Check if session is expired (24 hours for session, 30 days for remember)
            const maxAge = remember ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
            
            if (Date.now() - timestamp < maxAge) {
                updateAuthenticatedUI(user);
            } else {
                // Session expired
                localStorage.removeItem('skillsphere_session');
                sessionStorage.removeItem('skillsphere_session');
            }
        } catch (error) {
            console.error('Error parsing session data:', error);
        }
    }
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    const userMenu = document.querySelector('.user-menu');
    const dropdown = document.getElementById('userDropdown');
    
    if (dropdown && userMenu && !userMenu.contains(e.target)) {
        dropdown.classList.remove('show');
    }
});

// Close modal on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const modal = document.querySelector('.auth-modal');
        if (modal) {
            modal.remove();
        }
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    checkExistingSession();
});