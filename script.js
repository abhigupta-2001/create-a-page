/**
 * NexusAuth - Interactive Client-Side Auth & Validation System
 */

document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const authCard = document.getElementById('authCard');
    const dashboardCard = document.getElementById('dashboardCard');
    const formSubtitle = document.getElementById('formSubtitle');

    // Tabs
    const tabSignIn = document.getElementById('tabSignIn');
    const tabSignUp = document.getElementById('tabSignUp');

    // Forms
    const signInForm = document.getElementById('signInForm');
    const signUpForm = document.getElementById('signUpForm');
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');

    // Links & Buttons
    const btnForgotPassword = document.getElementById('btnForgotPassword');
    const btnBackToLogin = document.getElementById('btnBackToLogin');
    const btnLogout = document.getElementById('btnLogout');
    const dashNotificationBtn = document.getElementById('dashNotificationBtn');

    // Inputs - Sign In
    const loginEmail = document.getElementById('loginEmail');
    const loginPassword = document.getElementById('loginPassword');
    const rememberMe = document.getElementById('rememberMe');

    // Inputs - Sign Up
    const regName = document.getElementById('regName');
    const regEmail = document.getElementById('regEmail');
    const regPassword = document.getElementById('regPassword');
    const regConfirmPassword = document.getElementById('regConfirmPassword');
    const acceptTerms = document.getElementById('acceptTerms');

    // Password Strength Meter Elements
    const strengthBar = document.getElementById('strengthBar');
    const strengthText = document.getElementById('strengthText');
    const ruleLength = document.getElementById('ruleLength');
    const ruleUpper = document.getElementById('ruleUpper');
    const ruleNumber = document.getElementById('ruleNumber');
    const ruleSpecial = document.getElementById('ruleSpecial');

    // Inputs - Reset Password
    const resetEmail = document.getElementById('resetEmail');

    // Dashboard Elements
    const dashUserName = document.getElementById('dashUserName');
    const dashUserEmail = document.getElementById('dashUserEmail');
    const dashAvatar = document.getElementById('dashAvatar');
    const dashLastLogin = document.getElementById('dashLastLogin');

    /* ==========================================================================
       Tab Navigation System
       ========================================================================== */
    function switchTab(target) {
        if (target === 'signin') {
            tabSignIn.classList.add('active');
            tabSignUp.classList.remove('active');
            tabSignIn.setAttribute('aria-selected', 'true');
            tabSignUp.setAttribute('aria-selected', 'false');

            signInForm.classList.add('active');
            signUpForm.classList.remove('active');
            forgotPasswordForm.classList.remove('active');

            formSubtitle.textContent = "Welcome back! Please enter your details.";
        } else if (target === 'signup') {
            tabSignUp.classList.add('active');
            tabSignIn.classList.remove('active');
            tabSignUp.setAttribute('aria-selected', 'true');
            tabSignIn.setAttribute('aria-selected', 'false');

            signUpForm.classList.add('active');
            signInForm.classList.remove('active');
            forgotPasswordForm.classList.remove('active');

            formSubtitle.textContent = "Join NexusAuth today. Quick and secure.";
        } else if (target === 'forgot') {
            tabSignIn.classList.remove('active');
            tabSignUp.classList.remove('active');

            forgotPasswordForm.classList.add('active');
            signInForm.classList.remove('active');
            signUpForm.classList.remove('active');

            formSubtitle.textContent = "Reset your account password.";
        }
    }

    tabSignIn.addEventListener('click', () => switchTab('signin'));
    tabSignUp.addEventListener('click', () => switchTab('signup'));
    btnForgotPassword.addEventListener('click', () => switchTab('forgot'));
    btnBackToLogin.addEventListener('click', () => switchTab('signin'));

    /* ==========================================================================
       Password Toggle Visibility
       ========================================================================== */
    const togglePasswordBtns = document.querySelectorAll('.toggle-password');
    togglePasswordBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            const passwordInput = document.getElementById(targetId);
            const icon = btn.querySelector('i');

            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.className = 'fa-regular fa-eye-slash';
            } else {
                passwordInput.type = 'password';
                icon.className = 'fa-regular fa-eye';
            }
        });
    });

    /* ==========================================================================
       Validation Utilities
       ========================================================================== */
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

    function showError(input, errorElement, message) {
        const group = input.closest('.input-group') || input.closest('.form-actions');
        if (group) {
            group.classList.add('invalid');
            group.classList.remove('valid');
        }
        if (errorElement) {
            errorElement.textContent = message;
        }
    }

    function clearError(input, errorElement) {
        const group = input.closest('.input-group') || input.closest('.form-actions');
        if (group) {
            group.classList.remove('invalid');
            group.classList.add('valid');
        }
        if (errorElement) {
            errorElement.textContent = '';
        }
    }

    /* ==========================================================================
       Password Strength Meter Evaluator
       ========================================================================== */
    function evaluatePasswordStrength(password) {
        let score = 0;

        const hasLength = password.length >= 8;
        const hasUpper = /[A-Z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecial = /[^A-Za-z0-9]/.test(password);

        // Update Checklist Icons
        updateRule(ruleLength, hasLength);
        updateRule(ruleUpper, hasUpper);
        updateRule(ruleNumber, hasNumber);
        updateRule(ruleSpecial, hasSpecial);

        if (hasLength) score += 25;
        if (hasUpper) score += 25;
        if (hasNumber) score += 25;
        if (hasSpecial) score += 25;

        // Visual Feedback
        strengthBar.style.width = `${score}%`;

        if (password.length === 0) {
            strengthBar.style.backgroundColor = 'transparent';
            strengthText.textContent = 'Password Strength';
            strengthText.style.color = 'var(--text-dim)';
        } else if (score <= 25) {
            strengthBar.style.backgroundColor = 'var(--error)';
            strengthText.textContent = 'Weak Password';
            strengthText.style.color = 'var(--error)';
        } else if (score <= 50) {
            strengthBar.style.backgroundColor = 'var(--warning)';
            strengthText.textContent = 'Fair Password';
            strengthText.style.color = 'var(--warning)';
        } else if (score <= 75) {
            strengthBar.style.backgroundColor = 'var(--success)';
            strengthText.textContent = 'Good Password';
            strengthText.style.color = 'var(--success)';
        } else {
            strengthBar.style.backgroundColor = 'var(--accent-glow)';
            strengthText.textContent = 'Strong Password';
            strengthText.style.color = 'var(--accent-glow)';
        }

        return score;
    }

    function updateRule(element, isMet) {
        if (isMet) {
            element.classList.add('met');
        } else {
            element.classList.remove('met');
        }
    }

    if (regPassword) {
        regPassword.addEventListener('input', (e) => {
            evaluatePasswordStrength(e.target.value);
            if (regConfirmPassword.value) {
                checkPasswordMatch();
            }
        });
    }

    function checkPasswordMatch() {
        const errorEl = document.getElementById('regConfirmPasswordError');
        if (regConfirmPassword.value !== regPassword.value) {
            showError(regConfirmPassword, errorEl, 'Passwords do not match');
            return false;
        } else {
            clearError(regConfirmPassword, errorEl);
            return true;
        }
    }

    if (regConfirmPassword) {
        regConfirmPassword.addEventListener('input', checkPasswordMatch);
    }

    /* ==========================================================================
       Toast Notification System
       ========================================================================== */
    function showToast(title, message, type = 'info') {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;

        let iconClass = 'fa-solid fa-circle-info';
        if (type === 'success') iconClass = 'fa-solid fa-circle-check';
        if (type === 'error') iconClass = 'fa-solid fa-circle-xmark';

        toast.innerHTML = `
            <i class="${iconClass} toast-icon"></i>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                <div class="toast-message">${message}</div>
            </div>
        `;

        container.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('toast-out');
            toast.addEventListener('animationend', () => toast.remove());
        }, 4000);
    }

    /* ==========================================================================
       Form Submissions (Simulated Auth Logic)
       ========================================================================== */

    // SIGN IN SUBMISSION
    signInForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;

        const emailErr = document.getElementById('loginEmailError');
        const passErr = document.getElementById('loginPasswordError');

        // Email validation
        if (!loginEmail.value.trim()) {
            showError(loginEmail, emailErr, 'Email address is required');
            isValid = false;
        } else if (!isValidEmail(loginEmail.value.trim())) {
            showError(loginEmail, emailErr, 'Please enter a valid email address');
            isValid = false;
        } else {
            clearError(loginEmail, emailErr);
        }

        // Password validation
        if (!loginPassword.value) {
            showError(loginPassword, passErr, 'Password is required');
            isValid = false;
        } else {
            clearError(loginPassword, passErr);
        }

        if (!isValid) return;

        // Show spinner on submit button
        const submitBtn = document.getElementById('signInSubmitBtn');
        submitBtn.classList.add('loading');

        setTimeout(() => {
            submitBtn.classList.remove('loading');

            const userEmail = loginEmail.value.trim();
            const userName = userEmail.split('@')[0];
            const formattedName = userName.charAt(0).toUpperCase() + userName.slice(1);

            showToast('Sign In Successful', `Welcome back, ${formattedName}!`, 'success');

            // Open Dashboard View
            openDashboard(formattedName, userEmail);
        }, 1200);
    });

    // SIGN UP SUBMISSION
    signUpForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;

        const nameErr = document.getElementById('regNameError');
        const emailErr = document.getElementById('regEmailError');
        const passErr = document.getElementById('regPasswordError');
        const termsErr = document.getElementById('termsError');

        // Name
        if (!regName.value.trim()) {
            showError(regName, nameErr, 'Full Name is required');
            isValid = false;
        } else {
            clearError(regName, nameErr);
        }

        // Email
        if (!regEmail.value.trim()) {
            showError(regEmail, emailErr, 'Email address is required');
            isValid = false;
        } else if (!isValidEmail(regEmail.value.trim())) {
            showError(regEmail, emailErr, 'Please enter a valid email address');
            isValid = false;
        } else {
            clearError(regEmail, emailErr);
        }

        // Password strength
        const strength = evaluatePasswordStrength(regPassword.value);
        if (!regPassword.value) {
            showError(regPassword, passErr, 'Password is required');
            isValid = false;
        } else if (strength < 50) {
            showError(regPassword, passErr, 'Password is too weak. Please add uppercase & numbers.');
            isValid = false;
        } else {
            clearError(regPassword, passErr);
        }

        // Password match
        if (!checkPasswordMatch()) {
            isValid = false;
        }

        // Terms
        if (!acceptTerms.checked) {
            if (termsErr) termsErr.textContent = 'You must accept the terms to proceed.';
            isValid = false;
        } else {
            if (termsErr) termsErr.textContent = '';
        }

        if (!isValid) return;

        const submitBtn = document.getElementById('signUpSubmitBtn');
        submitBtn.classList.add('loading');

        setTimeout(() => {
            submitBtn.classList.remove('loading');
            showToast('Account Created!', 'Your account has been registered successfully. Logging you in...', 'success');

            openDashboard(regName.value.trim(), regEmail.value.trim());
        }, 1400);
    });

    // FORGOT PASSWORD SUBMISSION
    forgotPasswordForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const resetErr = document.getElementById('resetEmailError');

        if (!resetEmail.value.trim()) {
            showError(resetEmail, resetErr, 'Email is required');
            return;
        } else if (!isValidEmail(resetEmail.value.trim())) {
            showError(resetEmail, resetErr, 'Enter a valid email');
            return;
        }

        clearError(resetEmail, resetErr);
        const submitBtn = document.getElementById('resetSubmitBtn');
        submitBtn.classList.add('loading');

        setTimeout(() => {
            submitBtn.classList.remove('loading');
            showToast('Reset Link Sent', `Password reset instructions sent to ${resetEmail.value.trim()}`, 'info');
            switchTab('signin');
        }, 1200);
    });

    // SOCIAL LOGIN BUTTON MOCKS
    const socialBtns = document.querySelectorAll('.btn-social');
    socialBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const provider = btn.getAttribute('data-provider');
            showToast('Social Auth', `Connecting with ${provider}... (Demo Mode)`, 'info');
            setTimeout(() => {
                openDashboard(`${provider} User`, `user@${provider.toLowerCase()}.com`);
            }, 1000);
        });
    });

    /* ==========================================================================
       Dashboard View Logic
       ========================================================================== */
    function openDashboard(name, email) {
        authCard.style.opacity = '0';
        authCard.style.transform = 'translateY(-20px)';

        setTimeout(() => {
            authCard.classList.add('hidden');
            dashboardCard.classList.remove('hidden');
            dashboardCard.style.opacity = '1';
            dashboardCard.style.transform = 'translateY(0)';

            dashUserName.textContent = `Welcome back, ${name}!`;
            dashUserEmail.textContent = email;

            // Generate Avatar Initials
            const initials = name
                .split(' ')
                .map(part => part.charAt(0))
                .join('')
                .toUpperCase()
                .substring(0, 2) || 'US';
            dashAvatar.textContent = initials;

            const now = new Date();
            dashLastLogin.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }, 300);
    }

    btnLogout.addEventListener('click', () => {
        dashboardCard.style.opacity = '0';
        dashboardCard.style.transform = 'translateY(20px)';

        setTimeout(() => {
            dashboardCard.classList.add('hidden');
            authCard.classList.remove('hidden');
            authCard.style.opacity = '1';
            authCard.style.transform = 'translateY(0)';

            // Reset Form Fields
            signInForm.reset();
            signUpForm.reset();
            forgotPasswordForm.reset();
            evaluatePasswordStrength('');

            showToast('Signed Out', 'You have been safely signed out.', 'info');
        }, 300);
    });

    dashNotificationBtn.addEventListener('click', () => {
        showToast('System Alert', '2-Factor Authentication recommended for enhanced security.', 'info');
    });
});
