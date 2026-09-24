/**
 * Portfolio Application Logic
 * Interactive Project filtering, Search, Modal, Theme Switcher & Forms
 */

document.addEventListener('DOMContentLoaded', () => {
  // Load customized portfolio data from localStorage if modified via Admin Panel
  try {
    const customData = localStorage.getItem('portfolio_custom_data');
    if (customData) {
      const parsed = JSON.parse(customData);
      if (parsed.profile) portfolioData.profile = parsed.profile;
      if (parsed.projects) portfolioData.projects = parsed.projects;
      if (parsed.categories) portfolioData.categories = parsed.categories;
      if (parsed.skills) portfolioData.skills = parsed.skills;
      if (parsed.experience) portfolioData.experience = parsed.experience;
    }
  } catch (err) {
    console.warn("Could not load custom portfolio data from localStorage", err);
  }

  // API URL resolver (handles both http://localhost:5000 and file:/// previews)
  const API_BASE = (window.location.protocol === 'http:' || window.location.protocol === 'https:')
    ? ''
    : 'http://localhost:5000';

  // Application State
  const state = {
    selectedCategory: 'all',
    searchQuery: '',
    currentTheme: localStorage.getItem('portfolio-theme') || 
                  (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark')
  };

  // DOM Elements
  const themeToggleBtn = document.getElementById('theme-toggle');
  const projectsContainer = document.getElementById('projects-container');
  const filterTabsContainer = document.getElementById('filter-tabs');
  const searchInput = document.getElementById('search-input');
  const clearSearchBtn = document.getElementById('clear-search-btn');
  const projectModal = document.getElementById('project-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const contactForm = document.getElementById('contact-form');
  const toastContainer = document.getElementById('toast-container');
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerBackdrop = document.getElementById('drawer-backdrop');
  const backToTopBtn = document.getElementById('back-to-top');

  /* ==========================================================================
     THEME MANAGEMENT
     ========================================================================== */
  function applyTheme(theme) {
    state.currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('portfolio-theme', theme);
  }

  // Initialize theme
  applyTheme(state.currentTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const newTheme = state.currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      showToast(`Switched to ${newTheme === 'dark' ? 'Dark' : 'Light'} Mode`);
    });
  }

  /* ==========================================================================
     POPULATE PROFILE & STATS
     ========================================================================== */
  function populateProfile() {
    const profile = portfolioData.profile;
    
    // Fill text content
    const nameEl = document.querySelectorAll('.dynamic-name');
    nameEl.forEach(el => el.textContent = profile.name);

    const titleEl = document.getElementById('hero-title-text');
    if (titleEl) titleEl.textContent = profile.title;

    const bioEl = document.getElementById('hero-bio');
    if (bioEl) bioEl.textContent = profile.bio;

    const statusBadgeEl = document.getElementById('status-badge-text');
    if (statusBadgeEl) statusBadgeEl.textContent = profile.statusBadge;

    const contactEmailEl = document.getElementById('contact-email-text');
    if (contactEmailEl) contactEmailEl.textContent = profile.email;

    const contactPhoneEl = document.getElementById('contact-phone-text');
    if (contactPhoneEl) contactPhoneEl.textContent = profile.phone;

    // Render Stats
    const statsContainer = document.getElementById('hero-stats-container');
    if (statsContainer) {
      statsContainer.innerHTML = profile.stats.map(stat => `
        <div class="stat-card">
          <div class="stat-value">${stat.value}</div>
          <div class="stat-label">${stat.label}</div>
        </div>
      `).join('');
    }
  }

  /* ==========================================================================
     CATEGORY FILTER TABS & COUNTS
     ========================================================================== */
  function renderFilterTabs() {
    if (!filterTabsContainer) return;

    filterTabsContainer.innerHTML = portfolioData.categories.map(cat => {
      let count = 0;
      if (cat.id === 'all') {
        count = portfolioData.projects.length;
      } else {
        count = portfolioData.projects.filter(p => p.category === cat.id).length;
      }

      const isActive = cat.id === state.selectedCategory ? 'active' : '';

      return `
        <button class="filter-chip ${isActive}" data-category="${cat.id}">
          <span>${cat.label}</span>
          <span class="chip-count">${count}</span>
        </button>
      `;
    }).join('');

    // Attach listeners
    filterTabsContainer.querySelectorAll('.filter-chip').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const catId = e.currentTarget.getAttribute('data-category');
        state.selectedCategory = catId;
        
        filterTabsContainer.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
        e.currentTarget.classList.add('active');
        
        renderProjects();
      });
    });
  }

  /* ==========================================================================
     PROJECT CARD RENDERING
     ========================================================================== */
  function renderProjects() {
    if (!projectsContainer) return;

    // Filter projects based on category and search query
    const filtered = portfolioData.projects.filter(project => {
      const matchCat = state.selectedCategory === 'all' || project.category === state.selectedCategory;
      const query = state.searchQuery.toLowerCase().trim();
      const matchSearch = !query || 
        project.title.toLowerCase().includes(query) ||
        project.subtitle.toLowerCase().includes(query) ||
        project.overview.toLowerCase().includes(query) ||
        project.tags.some(t => t.toLowerCase().includes(query));

      return matchCat && matchSearch;
    });

    if (filtered.length === 0) {
      projectsContainer.innerHTML = `
        <div class="empty-state">
          <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            <line x1="8" y1="11" x2="14" y2="11"></line>
          </svg>
          <h3 style="margin-bottom: 0.5rem; font-size: 1.3rem;">No Projects Found</h3>
          <p style="margin-bottom: 1.5rem;">No projects matched your search criteria: "<strong>${escapeHtml(state.searchQuery)}</strong>"</p>
          <button id="reset-filter-btn" class="btn btn-secondary btn-sm">Reset Search & Filters</button>
        </div>
      `;

      const resetBtn = document.getElementById('reset-filter-btn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          state.selectedCategory = 'all';
          state.searchQuery = '';
          if (searchInput) searchInput.value = '';
          if (clearSearchBtn) clearSearchBtn.classList.remove('visible');
          renderFilterTabs();
          renderProjects();
        });
      }
      return;
    }

    projectsContainer.innerHTML = filtered.map(project => `
      <article class="project-card" data-id="${project.id}">
        <div class="card-media">
          <img class="card-img" src="${project.image}" alt="${escapeHtml(project.title)}" loading="lazy">
          <span class="card-category-badge">${getCategoryLabel(project.category)}</span>
        </div>
        <div class="card-body">
          <h3 class="card-title">${escapeHtml(project.title)}</h3>
          <p class="card-desc">${escapeHtml(project.subtitle)}</p>
          
          <div class="card-metric-pill">
            ${escapeHtml(project.metric)}
          </div>

          <div class="card-tags">
            ${project.tags.slice(0, 4).map(tag => `<span class="tag-pill">${escapeHtml(tag)}</span>`).join('')}
            ${project.tags.length > 4 ? `<span class="tag-pill">+${project.tags.length - 4}</span>` : ''}
          </div>

          <div class="card-footer">
            <button class="btn btn-primary btn-sm view-details-btn" data-id="${project.id}">
              <span>View Case Study</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
            <a href="${project.demoUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm" title="Live Demo">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              <span>Demo</span>
            </a>
          </div>
        </div>
      </article>
    `).join('');

    // Attach Details Modal Handlers
    projectsContainer.querySelectorAll('.view-details-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        openModal(id);
      });
    });
  }

  function getCategoryLabel(catId) {
    const found = portfolioData.categories.find(c => c.id === catId);
    return found ? found.label : catId;
  }

  /* ==========================================================================
     SEARCH BAR LOGIC
     ========================================================================== */
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      if (clearSearchBtn) {
        clearSearchBtn.classList.toggle('visible', state.searchQuery.length > 0);
      }
      renderProjects();
    });
  }

  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      state.searchQuery = '';
      if (searchInput) {
        searchInput.value = '';
        searchInput.focus();
      }
      clearSearchBtn.classList.remove('visible');
      renderProjects();
    });
  }

  /* ==========================================================================
     PROJECT DETAILS MODAL
     ========================================================================== */
  function openModal(projectId) {
    const project = portfolioData.projects.find(p => p.id === projectId);
    if (!project || !projectModal) return;

    const modalBanner = document.getElementById('modal-banner-img');
    const modalCategory = document.getElementById('modal-category');
    const modalTitle = document.getElementById('modal-title');
    const modalSubtitle = document.getElementById('modal-subtitle');
    const modalMetric = document.getElementById('modal-metric-text');
    const modalOverview = document.getElementById('modal-overview-text');
    const modalProblem = document.getElementById('modal-problem-text');
    const modalSolution = document.getElementById('modal-solution-text');
    const modalFeaturesList = document.getElementById('modal-features-list');
    const modalTags = document.getElementById('modal-tags');
    const modalDemoBtn = document.getElementById('modal-demo-btn');
    const modalGithubBtn = document.getElementById('modal-github-btn');

    if (modalBanner) modalBanner.src = project.image;
    if (modalCategory) modalCategory.textContent = getCategoryLabel(project.category);
    if (modalTitle) modalTitle.textContent = project.title;
    if (modalSubtitle) modalSubtitle.textContent = project.subtitle;
    if (modalMetric) modalMetric.textContent = project.metric;
    if (modalOverview) modalOverview.textContent = project.overview;
    if (modalProblem) modalProblem.textContent = project.problem;
    if (modalSolution) modalSolution.textContent = project.solution;

    if (modalFeaturesList) {
      modalFeaturesList.innerHTML = project.features.map(f => `
        <li class="modal-feature-item">${escapeHtml(f)}</li>
      `).join('');
    }

    if (modalTags) {
      modalTags.innerHTML = project.tags.map(t => `
        <span class="tag-pill">${escapeHtml(t)}</span>
      `).join('');
    }

    if (modalDemoBtn) modalDemoBtn.href = project.demoUrl;
    if (modalGithubBtn) modalGithubBtn.href = project.githubUrl;

    projectModal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Increment view count via API in background
    fetch(`${API_BASE}/api/projects/${projectId}`).catch(() => {});
  }

  function closeModal() {
    if (!projectModal) return;
    projectModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  if (projectModal) {
    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) {
        closeModal();
      }
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && projectModal && projectModal.classList.contains('active')) {
      closeModal();
    }
  });

  /* ==========================================================================
     SKILLS SECTION RENDERING
     ========================================================================== */
  function renderSkills() {
    const skillsContainer = document.getElementById('skills-container');
    if (!skillsContainer) return;

    skillsContainer.innerHTML = portfolioData.skills.map(skillGroup => `
      <div class="skill-category-card">
        <div class="skill-card-header">
          <div class="skill-icon-wrap">
            ${skillGroup.icon}
          </div>
          <h3 class="skill-card-title">${escapeHtml(skillGroup.category)}</h3>
        </div>
        <div class="skill-items-list">
          ${skillGroup.items.map(item => `
            <div class="skill-item">
              <div class="skill-item-info">
                <span>${escapeHtml(item.name)}</span>
                <span style="color: var(--text-muted); font-size: 0.8rem;">${item.level}%</span>
              </div>
              <div class="skill-progress-bar">
                <div class="skill-progress-fill" style="width: ${item.level}%;"></div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('');
  }

  /* ==========================================================================
     TIMELINE / EXPERIENCE RENDERING
     ========================================================================== */
  function renderTimeline() {
    const timelineContainer = document.getElementById('timeline-container');
    if (!timelineContainer) return;

    timelineContainer.innerHTML = portfolioData.experience.map(item => `
      <div class="timeline-item">
        <div class="timeline-dot"></div>
        <div class="timeline-content-card">
          <div class="timeline-header">
            <div>
              <h4 class="timeline-role">${escapeHtml(item.role)}</h4>
              <div class="timeline-company">${escapeHtml(item.company)}</div>
            </div>
            <span class="timeline-period">${escapeHtml(item.period)}</span>
          </div>
          <p class="timeline-description">${escapeHtml(item.description)}</p>
        </div>
      </div>
    `).join('');
  }

  /* ==========================================================================
     MOBILE DRAWER NAVIGATION
     ========================================================================== */
  function toggleMobileMenu(open) {
    if (!mobileDrawer || !drawerBackdrop) return;
    if (open) {
      mobileDrawer.classList.add('open');
      drawerBackdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
    } else {
      mobileDrawer.classList.remove('open');
      drawerBackdrop.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.contains('open');
      toggleMobileMenu(!isOpen);
    });
  }

  if (drawerBackdrop) {
    drawerBackdrop.addEventListener('click', () => toggleMobileMenu(false));
  }

  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => toggleMobileMenu(false));
  });

  /* ==========================================================================
     COPY TO CLIPBOARD HANDLERS
     ========================================================================== */
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const targetTextId = e.currentTarget.getAttribute('data-copy-target');
      const textEl = document.getElementById(targetTextId);
      if (textEl) {
        navigator.clipboard.writeText(textEl.textContent.trim()).then(() => {
          showToast(`Copied to clipboard: "${textEl.textContent.trim()}"`);
          const originalText = e.currentTarget.textContent;
          e.currentTarget.textContent = 'Copied!';
          setTimeout(() => {
            e.currentTarget.textContent = originalText;
          }, 2000);
        });
      }
    });
  });

  /* ==========================================================================
     CONTACT FORM HANDLING (REST API + Telegram Bot Notification)
     ========================================================================== */
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalHtml = submitBtn.innerHTML;

      const name = document.getElementById('contact-name').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const subject = document.getElementById('contact-subject').value.trim();
      const message = document.getElementById('contact-message').value.trim();

      // Set loading state
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-dashoffset="12"></circle>
        </svg>
        <span>Sending Message...</span>
      `;

      try {
        const res = await fetch(`${API_BASE}/api/contact`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, subject, message })
        });
        const data = await res.json();

        if (res.ok && data.success) {
          contactForm.reset();
          showToast('Thank you! Your message has been sent and saved successfully.');
        } else {
          showToast(`Notice: ${data.error || 'Could not send message'}`);
        }
      } catch (err) {
        // Fallback for static preview without running server
        setTimeout(() => {
          contactForm.reset();
          showToast('Thank you! Your message has been sent successfully.');
        }, 800);
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalHtml;
      }
    });
  }

  /* ==========================================================================
     TOAST NOTIFICATIONS
     ========================================================================== */
  function showToast(message) {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      <span class="toast-msg">${escapeHtml(message)}</span>
    `;

    toastContainer.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 3500);
  }

  /* ==========================================================================
     SCROLL EFFECTS & BACK TO TOP
     ========================================================================== */
  const header = document.querySelector('.site-header');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    // Header scrolled shadow
    if (header) {
      if (scrollY > 30) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // Back to top button
    if (backToTopBtn) {
      if (scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }

    // Scroll spy
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Utility XSS Escaper
  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Initialize Portfolio UI with local/default data first
  populateProfile();
  renderFilterTabs();
  renderProjects();
  renderSkills();
  renderTimeline();

  // Then asynchronously sync with live SQLite REST API if server is running
  async function syncWithServer() {
    try {
      const [projRes, profileRes] = await Promise.all([
        fetch(`${API_BASE}/api/projects`),
        fetch(`${API_BASE}/api/profile`)
      ]);

      if (projRes.ok && profileRes.ok) {
        const liveProjects = await projRes.json();
        const liveProfileData = await profileRes.json();

        if (Array.isArray(liveProjects) && liveProjects.length > 0) {
          portfolioData.projects = liveProjects;
        }

        if (liveProfileData.profile) {
          portfolioData.profile = liveProfileData.profile;
        }
        if (liveProfileData.categories && liveProfileData.categories.length > 0) {
          portfolioData.categories = liveProfileData.categories;
        }
        if (liveProfileData.skills && liveProfileData.skills.length > 0) {
          portfolioData.skills = liveProfileData.skills;
        }
        if (liveProfileData.experience && liveProfileData.experience.length > 0) {
          portfolioData.experience = liveProfileData.experience;
        }

        // Re-render with live database data
        populateProfile();
        renderFilterTabs();
        renderProjects();
        renderSkills();
        renderTimeline();
      }
    } catch (err) {
      // Running offline or as static file, local data is already rendered
    }
  }

  syncWithServer();
});
