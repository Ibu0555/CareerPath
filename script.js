// SkillSphere - AI Career & Skills Companion
// Enhanced with authentication, user management, and comprehensive features

class SkillSphere {
    constructor() {
        this.currentUser = null;
        this.isAuthenticated = false;
        this.authToken = null;
        this.rememberMe = false;
        this.loadingStates = new Map();
        
        this.init();
        this.bindEvents();
        this.setupAnimations();
        this.loadUserState();
        this.initializeActivityHistory();
    }

    init() {
        this.uploadArea = document.getElementById('uploadArea');
        this.uploadProgress = document.getElementById('uploadProgress');
        this.resultsSection = document.getElementById('results');
        this.resumeFile = document.getElementById('resumeFile');
        
        // Modal elements
        this.modals = {
            auth: document.getElementById('authModalOverlay'),
            profile: document.getElementById('profileModalOverlay'),
            settings: document.getElementById('settingsModalOverlay'),
            history: document.getElementById('historyModalOverlay'),
            about: document.getElementById('aboutModalOverlay')
        };
        
        // Sample data for demo
        this.sampleSkills = {
            technical: [
                { name: 'JavaScript', level: 'high', icon: 'fab fa-js-square' },
                { name: 'React', level: 'high', icon: 'fab fa-react' },
                { name: 'Node.js', level: 'medium', icon: 'fab fa-node-js' },
                { name: 'Python', level: 'medium', icon: 'fab fa-python' },
                { name: 'TypeScript', level: 'medium', icon: 'fas fa-code' },
                { name: 'GraphQL', level: 'low', icon: 'fas fa-project-diagram' },
                { name: 'Docker', level: 'low', icon: 'fab fa-docker' },
                { name: 'AWS', level: 'low', icon: 'fab fa-aws' }
            ],
            soft: [
                { name: 'Leadership', level: 'high', icon: 'fas fa-users' },
                { name: 'Communication', level: 'high', icon: 'fas fa-comments' },
                { name: 'Problem Solving', level: 'high', icon: 'fas fa-lightbulb' },
                { name: 'Team Collaboration', level: 'medium', icon: 'fas fa-handshake' },
                { name: 'Project Management', level: 'medium', icon: 'fas fa-tasks' },
                { name: 'Public Speaking', level: 'low', icon: 'fas fa-microphone' }
            ]
        };

        this.sampleJobs = [
            {
                title: 'Senior Frontend Developer',
                company: 'TechCorp Inc.',
                match: 92,
                skills: ['React', 'TypeScript', 'GraphQL'],
                location: 'Remote',
                salary: '$120k - $150k'
            },
            {
                title: 'Full Stack Engineer',
                company: 'StartupXYZ',
                match: 87,
                skills: ['JavaScript', 'Node.js', 'React'],
                location: 'San Francisco',
                salary: '$110k - $140k'
            },
            {
                title: 'React Developer',
                company: 'Digital Agency',
                match: 85,
                skills: ['React', 'JavaScript', 'CSS'],
                location: 'New York',
                salary: '$100k - $130k'
            },
            {
                title: 'Frontend Architect',
                company: 'Enterprise Solutions',
                match: 78,
                skills: ['React', 'TypeScript', 'System Design'],
                location: 'Remote',
                salary: '$140k - $180k'
            }
        ];

        // Initialize activity history
        this.activityHistory = this.loadActivityHistory();
    }

    bindEvents() {
        // File upload handling
        this.resumeFile?.addEventListener('change', (e) => this.handleFileUpload(e));
        
        // Drag and drop
        this.uploadArea?.addEventListener('dragover', (e) => this.handleDragOver(e));
        this.uploadArea?.addEventListener('drop', (e) => this.handleDrop(e));
        this.uploadArea?.addEventListener('click', () => this.resumeFile?.click());

        // Authentication events
        this.bindAuthenticationEvents();
        
        // Modal events
        this.bindModalEvents();
        
        // Navigation events
        this.bindNavigationEvents();

        // Feedback and filter buttons
        document.querySelectorAll('.feedback-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleFeedback(e));
        });

        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleFilter(e));
        });

        // Skill pills interaction
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('skill-pill')) {
                this.handleSkillClick(e.target);
            }
        });

        // Theme changes
        this.bindThemeEvents();
    }

    bindAuthenticationEvents() {
        // Sign in/up button clicks
        document.getElementById('signInBtn')?.addEventListener('click', () => this.showSignInModal());
        document.getElementById('getStartedBtn')?.addEventListener('click', () => this.showSignUpModal());
        
        // Form submissions
        document.getElementById('signInForm')?.addEventListener('submit', (e) => this.handleSignIn(e));
        document.getElementById('signUpForm')?.addEventListener('submit', (e) => this.handleSignUp(e));
        document.getElementById('forgotPasswordForm')?.addEventListener('submit', (e) => this.handleForgotPassword(e));
        
        // Modal switches
        document.getElementById('switchToSignUp')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.switchModal('signInModal', 'signUpModal');
        });
        
        document.getElementById('switchToSignIn')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.switchModal('signUpModal', 'signInModal');
        });
        
        document.getElementById('forgotPasswordLink')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.switchModal('signInModal', 'forgotPasswordModal');
        });
        
        document.getElementById('backToSignIn')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.switchModal('forgotPasswordModal', 'signInModal');
        });

        // Password toggles
        document.getElementById('toggleSignInPassword')?.addEventListener('click', () => 
            this.togglePasswordVisibility('signInPassword', 'toggleSignInPassword'));
        document.getElementById('toggleSignUpPassword')?.addEventListener('click', () => 
            this.togglePasswordVisibility('signUpPassword', 'toggleSignUpPassword'));

        // Password strength checking
        document.getElementById('signUpPassword')?.addEventListener('input', (e) => 
            this.checkPasswordStrength(e.target.value));

        // User menu actions
        document.getElementById('profileBtn')?.addEventListener('click', () => this.showModal('profile'));
        document.getElementById('settingsBtn')?.addEventListener('click', () => this.showModal('settings'));
        document.getElementById('historyBtn')?.addEventListener('click', () => this.showModal('history'));
        document.getElementById('signOutBtn')?.addEventListener('click', () => this.signOut());

        // Social authentication
        document.getElementById('googleSignIn')?.addEventListener('click', () => this.handleSocialAuth('google'));
        document.getElementById('linkedinSignIn')?.addEventListener('click', () => this.handleSocialAuth('linkedin'));
    }

    bindModalEvents() {
        // Close buttons
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal-overlay');
                if (modal) this.hideModal(modal.id.replace('ModalOverlay', ''));
            });
        });

        // Click outside to close
        Object.values(this.modals).forEach(modal => {
            modal?.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideModal(modal.id.replace('ModalOverlay', ''));
                }
            });
        });

        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e.target));
        });

        // Export buttons
        document.querySelectorAll('.export-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleDataExport(e.target.dataset.format));
        });
    }

    bindNavigationEvents() {
        document.getElementById('aboutLink')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showModal('about');
        });
    }

    bindThemeEvents() {
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.changeTheme(e.target.dataset.theme));
        });
    }

    // Authentication Methods
    showSignInModal() {
        this.showModal('auth');
        this.switchModal(null, 'signInModal');
    }

    showSignUpModal() {
        this.showModal('auth');
        this.switchModal(null, 'signUpModal');
    }

    async handleSignIn(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const email = formData.get('email') || document.getElementById('signInEmail').value;
        const password = formData.get('password') || document.getElementById('signInPassword').value;
        const rememberMe = document.getElementById('rememberMe').checked;

        if (!this.validateEmail(email)) {
            this.showError('signInEmailError', 'Please enter a valid email address');
            return;
        }

        if (!password) {
            this.showError('signInPasswordError', 'Password is required');
            return;
        }

        this.setLoading('signInSubmit', true);

        try {
            // Simulate API call
            await this.simulateApiCall(1500);
            
            // Demo: always successful login
            const user = {
                id: 'user_123',
                email: email,
                name: 'John Doe',
                firstName: 'John',
                lastName: 'Doe',
                avatar: null,
                role: 'Frontend Developer',
                joinDate: new Date().toISOString(),
                settings: {
                    theme: 'light',
                    notifications: true,
                    language: 'en'
                }
            };

            this.authToken = 'jwt_token_demo_' + Date.now();
            this.currentUser = user;
            this.isAuthenticated = true;
            this.rememberMe = rememberMe;

            // Save to localStorage if remember me
            if (rememberMe) {
                localStorage.setItem('skillsphere_auth', JSON.stringify({
                    token: this.authToken,
                    user: this.currentUser,
                    rememberMe: true
                }));
            } else {
                sessionStorage.setItem('skillsphere_auth', JSON.stringify({
                    token: this.authToken,
                    user: this.currentUser,
                    rememberMe: false
                }));
            }

            this.updateAuthUI();
            this.hideModal('auth');
            this.showToast('Welcome back!', 'You have successfully signed in.', 'success');
            this.addActivity('sign_in', 'Signed in to SkillSphere');

        } catch (error) {
            this.showError('signInPasswordError', 'Invalid email or password');
        }

        this.setLoading('signInSubmit', false);
    }

    async handleSignUp(e) {
        e.preventDefault();
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const email = document.getElementById('signUpEmail').value;
        const password = document.getElementById('signUpPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const agreeTerms = document.getElementById('agreeTerms').checked;

        // Clear previous errors
        this.clearErrors();

        // Validation
        let hasErrors = false;

        if (!firstName.trim()) {
            this.showError('firstNameError', 'First name is required');
            hasErrors = true;
        }

        if (!lastName.trim()) {
            this.showError('lastNameError', 'Last name is required');
            hasErrors = true;
        }

        if (!this.validateEmail(email)) {
            this.showError('signUpEmailError', 'Please enter a valid email address');
            hasErrors = true;
        }

        if (!this.validatePassword(password)) {
            this.showError('signUpPasswordError', 'Password must be at least 8 characters with uppercase, lowercase, and number');
            hasErrors = true;
        }

        if (password !== confirmPassword) {
            this.showError('confirmPasswordError', 'Passwords do not match');
            hasErrors = true;
        }

        if (!agreeTerms) {
            this.showToast('Agreement Required', 'Please agree to the Terms of Service and Privacy Policy', 'warning');
            hasErrors = true;
        }

        if (hasErrors) return;

        this.setLoading('signUpSubmit', true);

        try {
            // Simulate API call
            await this.simulateApiCall(2000);
            
            // Show email verification modal
            document.getElementById('verificationEmail').textContent = email;
            this.switchModal('signUpModal', 'emailVerificationModal');
            this.showToast('Account Created!', 'Please check your email to verify your account.', 'success');

        } catch (error) {
            this.showError('signUpEmailError', 'Email already exists or registration failed');
        }

        this.setLoading('signUpSubmit', false);
    }

    async handleForgotPassword(e) {
        e.preventDefault();
        const email = document.getElementById('resetEmail').value;

        if (!this.validateEmail(email)) {
            this.showError('resetEmailError', 'Please enter a valid email address');
            return;
        }

        this.setLoading('resetSubmit', true);

        try {
            await this.simulateApiCall(1500);
            this.showToast('Reset Link Sent', 'Please check your email for password reset instructions.', 'success');
            this.hideModal('auth');
        } catch (error) {
            this.showError('resetEmailError', 'Failed to send reset email');
        }

        this.setLoading('resetSubmit', false);
    }

    handleSocialAuth(provider) {
        this.showToast('Coming Soon', `${provider} authentication will be available soon!`, 'info');
    }

    signOut() {
        this.currentUser = null;
        this.isAuthenticated = false;
        this.authToken = null;
        
        localStorage.removeItem('skillsphere_auth');
        sessionStorage.removeItem('skillsphere_auth');
        
        this.updateAuthUI();
        this.showToast('Signed Out', 'You have been successfully signed out.', 'info');
        this.addActivity('sign_out', 'Signed out of SkillSphere');
    }

    updateAuthUI() {
        const signInBtn = document.getElementById('signInBtn');
        const getStartedBtn = document.getElementById('getStartedBtn');
        const userMenu = document.getElementById('userMenu');

        if (this.isAuthenticated && this.currentUser) {
            signInBtn.style.display = 'none';
            getStartedBtn.style.display = 'none';
            userMenu.style.display = 'flex';
            
            // Update profile info
            document.getElementById('profileName').textContent = this.currentUser.name;
            document.getElementById('profileEmail').textContent = this.currentUser.email;
            document.getElementById('profileRole').textContent = this.currentUser.role;
        } else {
            signInBtn.style.display = 'inline-flex';
            getStartedBtn.style.display = 'inline-flex';
            userMenu.style.display = 'none';
        }
    }

    loadUserState() {
        const authData = localStorage.getItem('skillsphere_auth') || sessionStorage.getItem('skillsphere_auth');
        if (authData) {
            try {
                const parsed = JSON.parse(authData);
                this.authToken = parsed.token;
                this.currentUser = parsed.user;
                this.isAuthenticated = true;
                this.rememberMe = parsed.rememberMe;
                this.updateAuthUI();
            } catch (error) {
                console.error('Failed to parse auth data:', error);
            }
        }
    }

    // Modal Management
    showModal(modalName) {
        const modal = this.modals[modalName];
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    hideModal(modalName) {
        const modal = this.modals[modalName];
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    switchModal(hideModalId, showModalId) {
        if (hideModalId) {
            document.getElementById(hideModalId).style.display = 'none';
        }
        if (showModalId) {
            // Hide all modals in auth overlay first
            document.querySelectorAll('#authModalOverlay .modal').forEach(modal => {
                modal.style.display = 'none';
            });
            document.getElementById(showModalId).style.display = 'block';
        }
    }

    // Tab Management
    switchTab(tabBtn) {
        const tabContainer = tabBtn.closest('.modal-body');
        const targetTab = tabBtn.dataset.tab;
        
        // Update tab buttons
        tabContainer.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        tabBtn.classList.add('active');
        
        // Update tab content
        tabContainer.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
        const targetPane = tabContainer.querySelector(`#${targetTab}`);
        if (targetPane) targetPane.classList.add('active');
    }

    // Theme Management
    changeTheme(theme) {
        document.querySelectorAll('.theme-btn').forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
        
        // Apply theme (basic implementation)
        if (theme === 'dark') {
            document.body.style.filter = 'invert(1) hue-rotate(180deg)';
        } else if (theme === 'light') {
            document.body.style.filter = '';
        } else if (theme === 'auto') {
            const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.body.style.filter = isDark ? 'invert(1) hue-rotate(180deg)' : '';
        }
        
        this.showToast('Theme Changed', `Switched to ${theme} theme`, 'info');
    }

    // Data Export
    async handleDataExport(format) {
        if (!this.isAuthenticated) {
            this.showToast('Authentication Required', 'Please sign in to export your data', 'warning');
            return;
        }

        const exportData = {
            user: this.currentUser,
            skills: this.sampleSkills,
            jobMatches: this.sampleJobs,
            activityHistory: this.activityHistory,
            exportedAt: new Date().toISOString()
        };

        try {
            switch (format) {
                case 'json':
                    this.downloadFile(JSON.stringify(exportData, null, 2), 'skillsphere-data.json', 'application/json');
                    break;
                case 'csv':
                    const csvData = this.convertToCSV(exportData);
                    this.downloadFile(csvData, 'skillsphere-data.csv', 'text/csv');
                    break;
                case 'pdf':
                    this.showToast('PDF Export', 'PDF export functionality coming soon!', 'info');
                    break;
            }
            
            this.addActivity('data_export', `Exported data as ${format.toUpperCase()}`);
            this.showToast('Export Complete', `Data exported as ${format.toUpperCase()}`, 'success');
        } catch (error) {
            this.showToast('Export Failed', 'Failed to export data', 'error');
        }
    }

    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    convertToCSV(data) {
        // Simple CSV conversion for skills
        let csv = 'Category,Skill,Level\n';
        Object.entries(data.skills).forEach(([category, skills]) => {
            skills.forEach(skill => {
                csv += `${category},${skill.name},${skill.level}\n`;
            });
        });
        return csv;
    }

    // Activity History
    initializeActivityHistory() {
        if (!this.activityHistory.length) {
            this.activityHistory = [
                {
                    id: '1',
                    type: 'account_creation',
                    title: 'Account Created',
                    description: 'Welcome to SkillSphere!',
                    timestamp: new Date(Date.now() - 86400000).toISOString(),
                    icon: 'fas fa-user-plus'
                }
            ];
            this.saveActivityHistory();
        }
        this.renderActivityHistory();
    }

    addActivity(type, description, title = null) {
        if (!this.isAuthenticated) return;

        const activity = {
            id: Date.now().toString(),
            type,
            title: title || this.getActivityTitle(type),
            description,
            timestamp: new Date().toISOString(),
            icon: this.getActivityIcon(type)
        };

        this.activityHistory.unshift(activity);
        this.saveActivityHistory();
        this.renderActivityHistory();
    }

    getActivityTitle(type) {
        const titles = {
            sign_in: 'Signed In',
            sign_out: 'Signed Out',
            resume_upload: 'Resume Uploaded',
            skill_update: 'Skills Updated',
            job_view: 'Job Viewed',
            data_export: 'Data Exported'
        };
        return titles[type] || 'Activity';
    }

    getActivityIcon(type) {
        const icons = {
            sign_in: 'fas fa-sign-in-alt',
            sign_out: 'fas fa-sign-out-alt',
            resume_upload: 'fas fa-file-upload',
            skill_update: 'fas fa-star',
            job_view: 'fas fa-briefcase',
            data_export: 'fas fa-download',
            account_creation: 'fas fa-user-plus'
        };
        return icons[type] || 'fas fa-circle';
    }

    renderActivityHistory() {
        const timeline = document.getElementById('activityTimeline');
        if (!timeline) return;

        timeline.innerHTML = this.activityHistory.map(activity => `
            <div class="history-item" data-type="${activity.type}">
                <div class="history-icon">
                    <i class="${activity.icon}"></i>
                </div>
                <div class="history-content">
                    <h5>${activity.title}</h5>
                    <p>${activity.description}</p>
                    <span class="history-time">${this.formatRelativeTime(activity.timestamp)}</span>
                </div>
            </div>
        `).join('');
    }

    loadActivityHistory() {
        const stored = localStorage.getItem('skillsphere_activity');
        return stored ? JSON.parse(stored) : [];
    }

    saveActivityHistory() {
        localStorage.setItem('skillsphere_activity', JSON.stringify(this.activityHistory));
    }

    // Utility Methods
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    validatePassword(password) {
        // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    }

    checkPasswordStrength(password) {
        const strengthMeter = document.querySelector('.strength-fill');
        const strengthText = document.querySelector('.strength-text');
        
        if (!strengthMeter || !strengthText) return;

        let strength = 0;
        let feedback = 'Very weak';
        let color = '#ef4444';

        if (password.length >= 8) strength += 1;
        if (/[a-z]/.test(password)) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/\d/.test(password)) strength += 1;
        if (/[@$!%*?&]/.test(password)) strength += 1;

        switch (strength) {
            case 0:
            case 1:
                feedback = 'Very weak';
                color = '#ef4444';
                break;
            case 2:
                feedback = 'Weak';
                color = '#f59e0b';
                break;
            case 3:
                feedback = 'Fair';
                color = '#eab308';
                break;
            case 4:
                feedback = 'Good';
                color = '#10b981';
                break;
            case 5:
                feedback = 'Strong';
                color = '#059669';
                break;
        }

        strengthMeter.style.width = `${(strength / 5) * 100}%`;
        strengthMeter.style.background = color;
        strengthText.textContent = feedback;
    }

    togglePasswordVisibility(inputId, buttonId) {
        const input = document.getElementById(inputId);
        const button = document.getElementById(buttonId);
        const icon = button.querySelector('i');

        if (input.type === 'password') {
            input.type = 'text';
            icon.className = 'fas fa-eye-slash';
        } else {
            input.type = 'password';
            icon.className = 'fas fa-eye';
        }
    }

    showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }

    clearErrors() {
        document.querySelectorAll('.error-message').forEach(el => {
            el.textContent = '';
            el.style.display = 'none';
        });
    }

    setLoading(buttonId, isLoading) {
        const button = document.getElementById(buttonId);
        if (!button) return;

        const textSpan = button.querySelector('.btn-text');
        const loadingSpan = button.querySelector('.btn-loading');

        if (isLoading) {
            textSpan.style.display = 'none';
            loadingSpan.style.display = 'inline-flex';
            button.disabled = true;
        } else {
            textSpan.style.display = 'inline';
            loadingSpan.style.display = 'none';
            button.disabled = false;
        }
    }

    async simulateApiCall(delay = 1000) {
        return new Promise(resolve => setTimeout(resolve, delay));
    }

    formatRelativeTime(timestamp) {
        const now = new Date();
        const time = new Date(timestamp);
        const diffInSeconds = Math.floor((now - time) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
        return `${Math.floor(diffInSeconds / 86400)} days ago`;
    }

    // Toast Notifications
    showToast(title, message, type = 'info') {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toastId = 'toast_' + Date.now();
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.id = toastId;

        const iconMap = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };

        toast.innerHTML = `
            <div class="toast-icon">
                <i class="${iconMap[type]}"></i>
            </div>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close" onclick="skillSphere.hideToast('${toastId}')">
                <i class="fas fa-times"></i>
            </button>
        `;

        container.appendChild(toast);
        
        // Trigger animation
        setTimeout(() => toast.classList.add('show'), 100);
        
        // Auto remove after 5 seconds
        setTimeout(() => this.hideToast(toastId), 5000);
    }

    hideToast(toastId) {
        const toast = document.getElementById(toastId);
        if (toast) {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }
    }

    // Original SkillSphere methods (updated)
    setupAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.card').forEach(card => {
            observer.observe(card);
        });

        this.animateSkillPills();
    }

    handleFileUpload(e) {
        const file = e.target.files[0];
        if (file) {
            this.processFile(file);
        }
    }

    handleDragOver(e) {
        e.preventDefault();
        this.uploadArea.style.borderColor = 'var(--accent)';
        this.uploadArea.style.backgroundColor = 'rgba(6, 182, 212, 0.1)';
    }

    handleDrop(e) {
        e.preventDefault();
        this.uploadArea.style.borderColor = 'rgba(255, 255, 255, 0.3)';
        this.uploadArea.style.backgroundColor = 'transparent';
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            this.processFile(files[0]);
        }
    }

    processFile(file) {
        document.querySelector('.upload-content').style.display = 'none';
        this.uploadProgress.style.display = 'block';

        this.simulateProgress();
        
        if (this.isAuthenticated) {
            this.addActivity('resume_upload', `Uploaded ${file.name}`);
        }
    }

    simulateProgress() {
        const steps = document.querySelectorAll('.step');
        const progressFill = document.querySelector('.progress-fill');
        
        let currentStep = 0;
        const totalSteps = steps.length;
        
        const progressInterval = setInterval(() => {
            if (currentStep < totalSteps) {
                steps[currentStep].classList.add('active');
                
                const progress = ((currentStep + 1) / totalSteps) * 100;
                progressFill.style.width = `${progress}%`;
                
                currentStep++;
            } else {
                clearInterval(progressInterval);
                
                setTimeout(() => {
                    this.showResults();
                }, 1000);
            }
        }, 1500);
    }

    showResults() {
        this.uploadProgress.style.display = 'none';
        this.resultsSection.style.display = 'block';
        
        this.populateSkills();
        this.populateJobs();
        
        this.resultsSection.scrollIntoView({ behavior: 'smooth' });
    }

    populateSkills() {
        const technicalContainer = document.getElementById('technicalSkills');
        const softContainer = document.getElementById('softSkills');
        
        if (technicalContainer) {
            technicalContainer.innerHTML = this.sampleSkills.technical
                .map(skill => this.createSkillPill(skill)).join('');
        }
        
        if (softContainer) {
            softContainer.innerHTML = this.sampleSkills.soft
                .map(skill => this.createSkillPill(skill)).join('');
        }
    }

    createSkillPill(skill) {
        return `
            <div class="skill-pill ${skill.level}" data-skill="${skill.name}" data-level="${skill.level}">
                <i class="${skill.icon}"></i>
                <span>${skill.name}</span>
                <div class="skill-level">${skill.level}</div>
            </div>
        `;
    }

    populateJobs() {
        const jobContainer = document.getElementById('jobRecommendations');
        if (jobContainer) {
            jobContainer.innerHTML = this.sampleJobs
                .map(job => this.createJobCard(job)).join('');
        }
    }

    createJobCard(job) {
        return `
            <div class="job-card" data-match="${job.match}">
                <div class="job-header">
                    <h3>${job.title}</h3>
                    <div class="match-score">${job.match}% match</div>
                </div>
                <p class="company">${job.company}</p>
                <p class="location">${job.location}</p>
                <p class="salary">${job.salary}</p>
                <div class="job-skills">
                    ${job.skills.map(skill => `<span class="job-skill">${skill}</span>`).join('')}
                </div>
                <div class="job-actions">
                    <button class="btn btn-outline btn-small" onclick="skillSphere.viewJob('${job.title}')">View Details</button>
                    <button class="btn btn-primary btn-small">Apply Now</button>
                </div>
            </div>
        `;
    }

    viewJob(jobTitle) {
        if (this.isAuthenticated) {
            this.addActivity('job_view', `Viewed ${jobTitle}`);
        }
        this.showToast('Job Details', `Viewing details for ${jobTitle}`, 'info');
    }

    handleFeedback(e) {
        const feedback = e.target.dataset.feedback;
        this.showToast('Thank You!', `Your ${feedback} feedback helps us improve.`, 'success');
    }

    handleFilter(e) {
        const filter = e.target.dataset.filter;
        
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        
        const jobs = document.querySelectorAll('.job-card');
        jobs.forEach(job => {
            const location = job.querySelector('.location').textContent.toLowerCase();
            const shouldShow = filter === 'all' || 
                              (filter === 'remote' && location.includes('remote')) ||
                              (filter === 'local' && !location.includes('remote'));
            
            job.style.display = shouldShow ? 'block' : 'none';
        });
    }

    handleSkillClick(skillElement) {
        const skillName = skillElement.dataset.skill;
        const skillLevel = skillElement.dataset.level;
        this.showSkillDetails(skillName, skillLevel, skillElement);
    }

    showSkillDetails(skillName, skillLevel, element) {
        this.showToast('Skill Details', `${skillName} - ${skillLevel} level`, 'info');
    }

    animateSkillPills() {
        const skillPills = document.querySelectorAll('.skill-pill');
        skillPills.forEach((pill, index) => {
            pill.style.animationDelay = `${index * 0.1}s`;
            pill.classList.add('fade-in-up');
        });
    }
}

// Initialize the application
const skillSphere = new SkillSphere();

// Service Worker registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('SW registered: ', registration))
            .catch(registrationError => console.log('SW registration failed: ', registrationError));
    });
}