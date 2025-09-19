// SkillSphere - AI Career & Skills Companion
// Interactive functionality and animations

class SkillSphere {
    constructor() {
        this.init();
        this.bindEvents();
        this.setupAnimations();
    }

    init() {
        this.uploadArea = document.getElementById('uploadArea');
        this.uploadProgress = document.getElementById('uploadProgress');
        this.resultsSection = document.getElementById('results');
        this.resumeFile = document.getElementById('resumeFile');
        
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
    }

    bindEvents() {
        // File upload handling
        this.resumeFile.addEventListener('change', (e) => this.handleFileUpload(e));
        
        // Drag and drop
        this.uploadArea.addEventListener('dragover', (e) => this.handleDragOver(e));
        this.uploadArea.addEventListener('drop', (e) => this.handleDrop(e));
        this.uploadArea.addEventListener('click', () => this.resumeFile.click());

        // Feedback buttons
        document.querySelectorAll('.feedback-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleFeedback(e));
        });

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleFilter(e));
        });

        // Skill pills interaction
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('skill-pill')) {
                this.handleSkillClick(e.target);
            }
        });
    }

    setupAnimations() {
        // Intersection Observer for fade-in animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                }
            });
        }, { threshold: 0.1 });

        // Observe all cards
        document.querySelectorAll('.card').forEach(card => {
            observer.observe(card);
        });

        // Animate skill pills on load
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
        // Show upload progress
        document.querySelector('.upload-content').style.display = 'none';
        this.uploadProgress.style.display = 'block';

        // Simulate file processing
        this.simulateProgress();
    }

    simulateProgress() {
        const steps = document.querySelectorAll('.step');
        const progressFill = document.querySelector('.progress-fill');
        
        let currentStep = 0;
        const totalSteps = steps.length;
        
        const progressInterval = setInterval(() => {
            if (currentStep < totalSteps) {
                // Activate current step
                steps[currentStep].classList.add('active');
                
                // Update progress bar
                const progress = ((currentStep + 1) / totalSteps) * 100;
                progressFill.style.width = `${progress}%`;
                
                currentStep++;
            } else {
                clearInterval(progressInterval);
                
                // Show results after a short delay
                setTimeout(() => {
                    this.showResults();
                }, 1000);
            }
        }, 1500);
    }

    showResults() {
        // Hide upload section and show results
        document.querySelector('.upload-section').style.display = 'none';
        this.resultsSection.style.display = 'block';
        
        // Populate skills
        this.populateSkills();
        
        // Populate jobs
        this.populateJobs();
        
        // Scroll to results
        this.resultsSection.scrollIntoView({ behavior: 'smooth' });
        
        // Update status
        document.getElementById('analysisStatus').innerHTML = `
            <span class="status-text">Analysis Complete</span>
            <i class="fas fa-check-circle" style="color: var(--success);"></i>
        `;
    }

    populateSkills() {
        const technicalContainer = document.getElementById('technicalSkills');
        const softContainer = document.getElementById('softSkills');
        
        // Clear existing content
        technicalContainer.innerHTML = '';
        softContainer.innerHTML = '';
        
        // Add technical skills
        this.sampleSkills.technical.forEach((skill, index) => {
            setTimeout(() => {
                const skillElement = this.createSkillPill(skill);
                technicalContainer.appendChild(skillElement);
                skillElement.style.animation = `fadeInUp 0.5s ease-out ${index * 0.1}s both`;
            }, index * 100);
        });
        
        // Add soft skills
        this.sampleSkills.soft.forEach((skill, index) => {
            setTimeout(() => {
                const skillElement = this.createSkillPill(skill);
                softContainer.appendChild(skillElement);
                skillElement.style.animation = `fadeInUp 0.5s ease-out ${index * 0.1}s both`;
            }, (index + this.sampleSkills.technical.length) * 100);
        });
    }

    createSkillPill(skill) {
        const pill = document.createElement('div');
        pill.className = `skill-pill ${skill.level}-level`;
        pill.innerHTML = `
            <i class="${skill.icon}"></i>
            ${skill.name}
        `;
        pill.setAttribute('data-skill', skill.name);
        pill.setAttribute('data-level', skill.level);
        return pill;
    }

    populateJobs() {
        const jobGrid = document.getElementById('jobRecommendations');
        jobGrid.innerHTML = '';
        
        this.sampleJobs.forEach((job, index) => {
            setTimeout(() => {
                const jobCard = this.createJobCard(job);
                jobGrid.appendChild(jobCard);
                jobCard.style.animation = `fadeInUp 0.5s ease-out ${index * 0.1}s both`;
            }, index * 200);
        });
    }

    createJobCard(job) {
        const card = document.createElement('div');
        card.className = 'job-card';
        card.setAttribute('data-location', job.location.toLowerCase());
        
        const skillsHtml = job.skills.map(skill => 
            `<span class="job-skill">${skill}</span>`
        ).join('');
        
        card.innerHTML = `
            <div class="job-header">
                <h3>${job.title}</h3>
                <div class="job-company">${job.company}</div>
            </div>
            <div class="job-body">
                <div class="job-match">
                    <span class="match-score">${job.match}% Match</span>
                    <span style="color: rgba(255, 255, 255, 0.7);">${job.location}</span>
                </div>
                <div class="job-skills">
                    ${skillsHtml}
                </div>
                <div class="job-salary" style="color: var(--accent); font-weight: 600; margin-bottom: 1rem;">
                    ${job.salary}
                </div>
                <div class="job-actions">
                    <button class="btn btn-primary btn-small">
                        <i class="fas fa-paper-plane"></i>
                        Apply Now
                    </button>
                    <button class="btn btn-outline btn-small">
                        <i class="fas fa-bookmark"></i>
                        Save
                    </button>
                </div>
            </div>
        `;
        
        return card;
    }

    handleFeedback(e) {
        // Remove active state from all feedback buttons
        document.querySelectorAll('.feedback-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        // Add active state to clicked button
        e.currentTarget.classList.add('selected');
        
        // Show thank you message
        const feedbackSection = document.querySelector('.feedback-section');
        setTimeout(() => {
            feedbackSection.innerHTML = `
                <div style="text-align: center; padding: 2rem;">
                    <i class="fas fa-heart" style="font-size: 3rem; color: var(--accent); margin-bottom: 1rem;"></i>
                    <h3 style="color: white; margin-bottom: 0.5rem;">Thank you for your feedback!</h3>
                    <p style="color: rgba(255, 255, 255, 0.7);">Your input helps us improve our recommendations.</p>
                </div>
            `;
        }, 1000);
    }

    handleFilter(e) {
        // Update active filter
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        e.currentTarget.classList.add('active');
        
        const filter = e.currentTarget.getAttribute('data-filter');
        const jobCards = document.querySelectorAll('.job-card');
        
        jobCards.forEach(card => {
            if (filter === 'all') {
                card.style.display = 'block';
            } else {
                const location = card.getAttribute('data-location');
                if (filter === 'remote' && location === 'remote') {
                    card.style.display = 'block';
                } else if (filter === 'local' && location !== 'remote') {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            }
        });
    }

    handleSkillClick(skillElement) {
        const skillName = skillElement.getAttribute('data-skill');
        const skillLevel = skillElement.getAttribute('data-level');
        
        // Create tooltip or modal with skill details
        this.showSkillDetails(skillName, skillLevel, skillElement);
    }

    showSkillDetails(skillName, skillLevel, element) {
        // Remove existing tooltips
        document.querySelectorAll('.skill-tooltip').forEach(tooltip => {
            tooltip.remove();
        });
        
        const tooltip = document.createElement('div');
        tooltip.className = 'skill-tooltip';
        tooltip.style.cssText = `
            position: absolute;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 1rem;
            border-radius: 8px;
            font-size: 0.9rem;
            z-index: 1000;
            max-width: 200px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            backdrop-filter: blur(10px);
        `;
        
        const levelText = {
            'high': 'Expert Level',
            'medium': 'Intermediate Level',
            'low': 'Beginner Level'
        };
        
        tooltip.innerHTML = `
            <strong>${skillName}</strong><br>
            <span style="color: var(--accent);">${levelText[skillLevel]}</span><br>
            <small>Click to explore learning resources</small>
        `;
        
        document.body.appendChild(tooltip);
        
        const rect = element.getBoundingClientRect();
        tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
        tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10}px`;
        
        // Remove tooltip after 3 seconds
        setTimeout(() => {
            tooltip.remove();
        }, 3000);
    }

    animateSkillPills() {
        // Add floating animation to skill pills when they're created
        const style = document.createElement('style');
        style.textContent = `
            @keyframes float {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-5px); }
            }
            
            .skill-pill:hover {
                animation: float 1s ease-in-out infinite;
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize SkillSphere when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SkillSphere();
    
    // Register service worker for PWA functionality
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then((registration) => {
                    console.log('SW registered: ', registration);
                })
                .catch((registrationError) => {
                    console.log('SW registration failed: ', registrationError);
                });
        });
    }
});

// Add smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        // Only proceed if href is not just '#' and is a valid selector
        if (href && href !== '#' && href.length > 1) {
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Add parallax effect to hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Add typing effect to hero text
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing effect when page loads
window.addEventListener('load', () => {
    const heroTitle = document.querySelector('.hero h1');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        typeWriter(heroTitle, originalText, 50);
    }
});