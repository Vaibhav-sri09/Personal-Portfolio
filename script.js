/**
 * Vaibhav Sri Sannidh - Portfolio Interactive Scripts
 * Handles interactive hero canvas, typewriter effect, navigation,
 * project modals, form validation, and toast notifications.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Set current year in footer
  const currentYearEl = document.getElementById('currentYear');
  if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
  }

  // -------------------------------------------------------------------------
  // 2. Interactive Constellation Canvas in Hero
  // -------------------------------------------------------------------------
  const canvas = document.getElementById('heroCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = canvas.parentElement.offsetWidth);
    let height = (canvas.height = canvas.parentElement.offsetHeight);

    const particles = [];
    const particleCount = Math.min(Math.floor((width * height) / 14000), 75);
    const mouse = { x: null, y: null, maxDistance: 130 };

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.7;
        this.vy = (Math.random() - 0.5) * 0.7;
        this.radius = Math.random() * 1.8 + 1.2;
        this.color = Math.random() > 0.4 ? '#00f0ff' : '#3b82f6';
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Mouse attraction / interaction
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.maxDistance) {
            const force = (mouse.maxDistance - dist) / mouse.maxDistance;
            this.x -= (dx / dist) * force * 1.5;
            this.y -= (dy / dist) * force * 1.5;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function connectParticles() {
      const maxLineDist = 120;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxLineDist) {
            const opacity = 1 - dist / maxLineDist;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0, 240, 255, ${opacity * 0.22})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
    }

    let animationFrameId;
    function animate() {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      connectParticles();
      animationFrameId = requestAnimationFrame(animate);
    }

    animate();

    // Canvas Resize Listener
    window.addEventListener('resize', () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.offsetWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
    });

    // Mouse Move on Hero
    const heroSection = document.getElementById('hero');
    if (heroSection) {
      heroSection.addEventListener('mousemove', (e) => {
        const rect = heroSection.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
      });

      heroSection.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
      });
    }
  }

  // -------------------------------------------------------------------------
  // 3. Typewriter Effect (Accurate Student Level Titles)
  // -------------------------------------------------------------------------
  const typewriterEl = document.getElementById('typewriterText');
  if (typewriterEl) {
    const roles = [
      'First Year B.Tech Student',
      'Engineering at VIT Vellore',
      'C++ & Python Learner',
      'Developing Foundational DSA',
      'Exploring AI & Machine Learning'
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function typeEffect() {
      const currentRole = roles[roleIndex];

      if (isDeleting) {
        typewriterEl.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 40;
      } else {
        typewriterEl.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 85;
      }

      if (!isDeleting && charIndex === currentRole.length) {
        isDeleting = true;
        typingSpeed = 1800; // Pause at end of phrase
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typingSpeed = 350; // Pause before typing new phrase
      }

      setTimeout(typeEffect, typingSpeed);
    }

    typeEffect();
  }

  // -------------------------------------------------------------------------
  // 4. Navbar Sticky State & Active Link Highlighting
  // -------------------------------------------------------------------------
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-link');

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    // Navbar shadow on scroll
    if (scrollY > 50) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }

    // Active link highlighting
    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  });

  // -------------------------------------------------------------------------
  // 5. Mobile Navigation Drawer
  // -------------------------------------------------------------------------
  const menuToggle = document.getElementById('menuToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');

  if (menuToggle && mobileDrawer) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('open');
      menuToggle.classList.toggle('open', isOpen);
      menuToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close mobile menu when clicking any link inside
    mobileDrawer.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        menuToggle.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (
        mobileDrawer.classList.contains('open') &&
        !mobileDrawer.contains(e.target) &&
        !menuToggle.contains(e.target)
      ) {
        mobileDrawer.classList.remove('open');
        menuToggle.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // -------------------------------------------------------------------------
  // 6. Project Architecture Detail Modals
  // -------------------------------------------------------------------------
  const modalTriggers = document.querySelectorAll('.open-modal-btn');
  const modalBackdrops = document.querySelectorAll('.modal-backdrop');

  modalTriggers.forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const targetModalId = trigger.getAttribute('data-modal');
      const targetModal = document.getElementById(targetModalId);
      if (targetModal) {
        targetModal.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  modalBackdrops.forEach((modal) => {
    // Close button click
    const closeBtns = modal.querySelectorAll('.modal-close-btn, .modal-close-btn-footer');
    closeBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        modal.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    // Click outside modal-dialog
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  });

  // Close modals on Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      modalBackdrops.forEach((modal) => {
        if (modal.classList.contains('open')) {
          modal.classList.remove('open');
          document.body.style.overflow = '';
        }
      });
    }
  });

  // -------------------------------------------------------------------------
  // 7. Toast Notification Utility
  // -------------------------------------------------------------------------
  function showToast(message, duration = 3200) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00f0ff" stroke-width="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  // -------------------------------------------------------------------------
  // 8. Copy Email to Clipboard
  // -------------------------------------------------------------------------
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  const emailLink = document.getElementById('emailLink');

  if (copyEmailBtn && emailLink) {
    copyEmailBtn.addEventListener('click', async () => {
      const emailText = emailLink.textContent.trim();
      try {
        await navigator.clipboard.writeText(emailText);
        showToast('Email address copied to clipboard!');
      } catch (err) {
        // Fallback for older environments
        const textarea = document.createElement('textarea');
        textarea.value = emailText;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast('Email address copied to clipboard!');
      }
    });
  }

  // Copy Phone Number to Clipboard
  const copyPhoneBtn = document.getElementById('copyPhoneBtn');
  const phoneLink = document.getElementById('phoneLink');

  if (copyPhoneBtn && phoneLink) {
    copyPhoneBtn.addEventListener('click', async () => {
      const phoneText = phoneLink.textContent.trim();
      try {
        await navigator.clipboard.writeText(phoneText);
        showToast('Phone number copied to clipboard!');
      } catch (err) {
        const textarea = document.createElement('textarea');
        textarea.value = phoneText;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast('Phone number copied to clipboard!');
      }
    });
  }

  // -------------------------------------------------------------------------
  // 9. Contact Form Handling (Transparent Mailto Trigger - No Fake Backend)
  // -------------------------------------------------------------------------
  const contactForm = document.getElementById('contactForm');
  const formSuccessAlert = document.getElementById('formSuccessAlert');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const subjectInput = document.getElementById('subject');
      const messageInput = document.getElementById('message');

      const nameError = document.getElementById('nameError');
      const emailError = document.getElementById('emailError');
      const subjectError = document.getElementById('subjectError');
      const messageError = document.getElementById('messageError');

      let isValid = true;

      // Validate Name
      if (!nameInput.value.trim()) {
        nameError.classList.add('visible');
        isValid = false;
      } else {
        nameError.classList.remove('visible');
      }

      // Validate Email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
        emailError.classList.add('visible');
        isValid = false;
      } else {
        emailError.classList.remove('visible');
      }

      // Validate Subject
      if (!subjectInput.value.trim()) {
        subjectError.classList.add('visible');
        isValid = false;
      } else {
        subjectError.classList.remove('visible');
      }

      // Validate Message
      if (!messageInput.value.trim()) {
        messageError.classList.add('visible');
        isValid = false;
      } else {
        messageError.classList.remove('visible');
      }

      if (isValid) {
        const submitBtn = document.getElementById('submitBtn');
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = '<span>Preparing email...</span>';
        }

        // Prepare mailto link with encoded parameters
        const recipient = 'vaibhavsrisannidhanasoori@gmail.com';
        const subject = encodeURIComponent(`[Portfolio Contact] ${subjectInput.value.trim()}`);
        const body = encodeURIComponent(
          `Hi Vaibhav,\n\nName: ${nameInput.value.trim()}\nEmail: ${emailInput.value.trim()}\n\nMessage:\n${messageInput.value.trim()}\n`
        );
        const mailtoUri = `mailto:${recipient}?subject=${subject}&body=${body}`;

        setTimeout(() => {
          // Open default email application
          window.location.href = mailtoUri;

          if (formSuccessAlert) {
            formSuccessAlert.style.display = 'flex';
          }
          showToast('Email draft opened in your mail application!');

          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = `
              <span>Open Email Client Draft</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            `;
          }
        }, 500);
      }
    });
  }
});
