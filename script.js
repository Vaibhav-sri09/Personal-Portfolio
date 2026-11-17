/**
 * Vaibhav Sri Sannidh - Portfolio Interactive Engine (v2.0)
 * Handles:
 * 1. Scroll progress bar
 * 2. High-performance interactive particle canvas (High DPI)
 * 3. Terminal typewriter effect
 * 4. Floating navbar state & scroll-spy
 * 5. Mobile navigation drawer with backdrop
 * 6. Code terminal tab inspector
 * 7. Project category filtering
 * 8. Project architecture deep dive modals
 * 9. Toast notification utility
 * 10. Copy-to-clipboard for email & phone
 * 11. Contact form mailto generator with validation
 * 12. IntersectionObserver scroll reveals
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // -------------------------------------------------------------------------
  // 1. Current Year in Footer
  // -------------------------------------------------------------------------
  const currentYearEl = document.getElementById('currentYear');
  if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
  }

  // -------------------------------------------------------------------------
  // 2. Reading Scroll Progress Bar
  // -------------------------------------------------------------------------
  const scrollProgressBar = document.getElementById('scrollProgressBar');
  function updateScrollProgress() {
    if (!scrollProgressBar) return;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgressBar.style.width = `${Math.min(100, Math.max(0, scrollPercent))}%`;
  }
  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  updateScrollProgress();

  // -------------------------------------------------------------------------
  // 3. Interactive Constellation Canvas in Hero (Retina / High-DPI Ready)
  // -------------------------------------------------------------------------
  const canvas = document.getElementById('heroCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resizeCanvas() {
      const parent = canvas.parentElement;
      if (!parent) return;
      width = parent.offsetWidth;
      height = parent.offsetHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    }
    resizeCanvas();

    const particles = [];
    const particleCount = Math.min(Math.floor((width * height) / 12000), 80);
    const mouse = { x: null, y: null, maxDistance: 140 };

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.7;
        this.vy = (Math.random() - 0.5) * 0.7;
        this.radius = Math.random() * 1.8 + 1.1;
        this.color = Math.random() > 0.4 ? '#00f0ff' : '#38bdf8';
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.hypot(dx, dy);
          if (dist < mouse.maxDistance) {
            const force = (mouse.maxDistance - dist) / mouse.maxDistance;
            this.x -= (dx / dist) * force * 1.6;
            this.y -= (dy / dist) * force * 1.6;
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
      const maxLineDist = 130;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);

          if (dist < maxLineDist) {
            const opacity = 1 - dist / maxLineDist;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0, 240, 255, ${opacity * 0.2})`;
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

    window.addEventListener('resize', () => {
      resizeCanvas();
    });

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
  // 4. Typewriter Effect
  // -------------------------------------------------------------------------
  const typewriterEl = document.getElementById('typewriterText');
  if (typewriterEl) {
    const roles = [
      'First-Year IT Student at VIT Vellore',
      'C++ & Python Developer',
      'Problem Solver (390+ on CodeChef)',
      'Foundational DSA & STL Learner',
      'Full-Stack REST API Builder'
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 90;

    function typeEffect() {
      const currentRole = roles[roleIndex];

      if (isDeleting) {
        typewriterEl.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 35;
      } else {
        typewriterEl.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 80;
      }

      if (!isDeleting && charIndex === currentRole.length) {
        isDeleting = true;
        typingSpeed = 2000; // Pause at completion
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typingSpeed = 400; // Pause before new word
      }

      setTimeout(typeEffect, typingSpeed);
    }

    typeEffect();
  }

  // -------------------------------------------------------------------------
  // 5. Navbar Scrolled State & Active Spy
  // -------------------------------------------------------------------------
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-link');

  function handleNavbarScroll() {
    const scrollY = window.pageYOffset;

    if (scrollY > 40) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }

    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 130;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          const href = link.getAttribute('href');
          if (href === `#${sectionId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }
  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll();

  // -------------------------------------------------------------------------
  // 6. Mobile Navigation Drawer
  // -------------------------------------------------------------------------
  const menuToggle = document.getElementById('menuToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileCloseBtn = document.getElementById('mobileCloseBtn');
  const drawerOverlay = document.getElementById('drawerOverlay');

  function openDrawer() {
    mobileDrawer?.classList.add('open');
    drawerOverlay?.classList.add('active');
    menuToggle?.classList.add('open');
    menuToggle?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    mobileDrawer?.classList.remove('open');
    drawerOverlay?.classList.remove('active');
    menuToggle?.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer?.classList.contains('open');
      if (isOpen) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });
  }

  if (mobileCloseBtn) {
    mobileCloseBtn.addEventListener('click', closeDrawer);
  }

  if (drawerOverlay) {
    drawerOverlay.addEventListener('click', closeDrawer);
  }

  document.querySelectorAll('.mobile-link').forEach((link) => {
    link.addEventListener('click', closeDrawer);
  });

  // -------------------------------------------------------------------------
  // 7. Terminal Tabs Toggle
  // -------------------------------------------------------------------------
  const tabJsonBtn = document.getElementById('tabJsonBtn');
  const tabPyBtn = document.getElementById('tabPyBtn');
  const codeJson = document.getElementById('codeJson');
  const codePy = document.getElementById('codePy');

  if (tabJsonBtn && tabPyBtn && codeJson && codePy) {
    tabJsonBtn.addEventListener('click', () => {
      tabJsonBtn.classList.add('active');
      tabJsonBtn.setAttribute('aria-selected', 'true');
      tabPyBtn.classList.remove('active');
      tabPyBtn.setAttribute('aria-selected', 'false');

      codeJson.style.display = 'block';
      codePy.style.display = 'none';
    });

    tabPyBtn.addEventListener('click', () => {
      tabPyBtn.classList.add('active');
      tabPyBtn.setAttribute('aria-selected', 'true');
      tabJsonBtn.classList.remove('active');
      tabJsonBtn.setAttribute('aria-selected', 'false');

      codePy.style.display = 'block';
      codeJson.style.display = 'none';
    });
  }

  // -------------------------------------------------------------------------
  // 8. Projects Category Filtering
  // -------------------------------------------------------------------------
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.projects-grid .project-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });

  // -------------------------------------------------------------------------
  // 9. Architecture Modals
  // -------------------------------------------------------------------------
  const modalTriggers = document.querySelectorAll('.open-modal-btn');
  const modalBackdrops = document.querySelectorAll('.modal-backdrop');

  modalTriggers.forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = trigger.getAttribute('data-modal');
      const targetModal = document.getElementById(targetId);
      if (targetModal) {
        targetModal.classList.add('open');
        targetModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  modalBackdrops.forEach((modal) => {
    const closeButtons = modal.querySelectorAll('.modal-close-btn, .modal-close-btn-footer');
    closeButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      });
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }
    });
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      modalBackdrops.forEach((modal) => {
        if (modal.classList.contains('open')) {
          modal.classList.remove('open');
          modal.setAttribute('aria-hidden', 'true');
          document.body.style.overflow = '';
        }
      });
      closeDrawer();
    }
  });

  // -------------------------------------------------------------------------
  // 10. Toast Notification System
  // -------------------------------------------------------------------------
  function showToast(message, duration = 3000) {
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
  // 11. Copy to Clipboard Utility
  // -------------------------------------------------------------------------
  async function copyText(text, successMsg) {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      showToast(successMsg);
    } catch (err) {
      showToast(`Copied: ${text}`);
    }
  }

  const copyEmailBtn = document.getElementById('copyEmailBtn');
  const emailLink = document.getElementById('emailLink');
  if (copyEmailBtn && emailLink) {
    copyEmailBtn.addEventListener('click', () => {
      copyText(emailLink.textContent.trim(), 'Email address copied to clipboard!');
    });
  }

  const copyPhoneBtn = document.getElementById('copyPhoneBtn');
  const phoneLink = document.getElementById('phoneLink');
  if (copyPhoneBtn && phoneLink) {
    copyPhoneBtn.addEventListener('click', () => {
      copyText(phoneLink.textContent.trim(), 'Phone number copied to clipboard!');
    });
  }

  // -------------------------------------------------------------------------
  // 12. Contact Form Validation & Direct Mailto Generator
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
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput.value.trim() || !emailPattern.test(emailInput.value.trim())) {
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
        const origBtnText = submitBtn.innerHTML;

        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Creating Email Draft...</span>';

        const recipient = 'vaibhavsrisannidhanasoori@gmail.com';
        const subject = encodeURIComponent(`[Portfolio] ${subjectInput.value.trim()}`);
        const body = encodeURIComponent(
          `Hi Vaibhav,\n\nName: ${nameInput.value.trim()}\nEmail: ${emailInput.value.trim()}\n\nMessage:\n${messageInput.value.trim()}\n`
        );
        const mailtoUri = `mailto:${recipient}?subject=${subject}&body=${body}`;

        setTimeout(() => {
          window.location.href = mailtoUri;

          if (formSuccessAlert) {
            formSuccessAlert.style.display = 'flex';
          }
          showToast('Email client opened with draft message!');

          submitBtn.disabled = false;
          submitBtn.innerHTML = origBtnText;
        }, 400);
      }
    });
  }

  // -------------------------------------------------------------------------
  // 13. Scroll Reveal Animations (IntersectionObserver)
  // -------------------------------------------------------------------------
  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback for older browsers
    revealElements.forEach((el) => el.classList.add('active'));
  }

  // -------------------------------------------------------------------------
  // 14. Dynamic GitHub Statistics & Repository Loader
  // -------------------------------------------------------------------------
  const downloadResumeBtn = document.getElementById('downloadResumeBtn');
  if (downloadResumeBtn) {
    downloadResumeBtn.addEventListener('click', () => {
      showToast('Downloading Vaibhav_Resume.pdf...');
    });
  }

  async function loadGitHubStats() {
    const ghRepoCount = document.getElementById('ghRepoCount');
    const ghFollowerCount = document.getElementById('ghFollowerCount');
    const reposContainer = document.getElementById('githubReposContainer');

    try {
      // 1. Fetch user profile statistics
      const userRes = await fetch('https://api.github.com/users/Vaibhav-sri09', {
        headers: { 'Accept': 'application/vnd.github.v3+json' }
      });

      if (userRes.ok) {
        const userData = await userRes.json();
        if (ghRepoCount && userData.public_repos !== undefined) {
          ghRepoCount.textContent = userData.public_repos;
        }
        if (ghFollowerCount && userData.followers !== undefined) {
          ghFollowerCount.textContent = userData.followers;
        }
      }

      // 2. Fetch recent public repositories
      const reposRes = await fetch('https://api.github.com/users/Vaibhav-sri09/repos?sort=updated&per_page=6', {
        headers: { 'Accept': 'application/vnd.github.v3+json' }
      });

      if (reposRes.ok) {
        const repos = await reposRes.json();
        if (Array.isArray(repos) && repos.length > 0 && reposContainer) {
          const langColors = {
            'Python': 'python',
            'HTML': 'html',
            'C++': 'cpp',
            'JavaScript': 'js',
            'CSS': 'html',
            'C': 'cpp'
          };

          reposContainer.innerHTML = repos.map((repo) => {
            const lang = repo.language || 'Code';
            const langClass = langColors[lang] || 'python';
            const desc = repo.description || 'Verified open-source repository on GitHub.';
            const stars = repo.stargazers_count || 0;

            return `
              <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="gh-repo-card reveal active">
                <div class="repo-card-top">
                  <div class="repo-name-group">
                    <svg class="repo-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                    <span class="repo-title">${repo.name}</span>
                  </div>
                  <span class="repo-badge">${repo.private ? 'Private' : 'Public'}</span>
                </div>
                <p class="repo-description">${desc}</p>
                <div class="repo-meta-row">
                  <span class="repo-lang"><span class="lang-color ${langClass}"></span> ${lang}</span>
                  <span class="repo-stat">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    ${stars}
                  </span>
                  <span class="repo-arrow">↗</span>
                </div>
              </a>
            `;
          }).join('');
        }
      }
    } catch (err) {
      // Offline or rate-limited; verified static cards remain visible
      console.log('GitHub API offline or rate-limited; fallback to verified HTML content.');
    }
  }

  loadGitHubStats();
});
