/**
 * Admin Panel Logic (admin.js)
 * Full-Stack API Integration, JWT Auth, Project Management, File Uploads & Messages Inbox
 */

document.addEventListener('DOMContentLoaded', () => {
  // Constants
  const DEFAULT_PIN = "1234";
  const STORAGE_KEY = "portfolio_custom_data";
  const AUTH_KEY = "admin_auth_authenticated";
  const TOKEN_KEY = "portfolio_jwt_token";
  const API_BASE = (window.location.protocol === 'http:' || window.location.protocol === 'https:')
    ? window.location.origin
    : 'http://localhost:5000';

  // State
  let adminData = {
    profile: null,
    projects: [],
    categories: [],
    messages: []
  };
  let editingProjectId = null;
  let isApiOnline = false;

  // DOM Elements - Auth
  const authOverlay = document.getElementById('auth-overlay');
  const pinInput = document.getElementById('pin-input');
  const authSubmitBtn = document.getElementById('auth-submit-btn');
  const authError = document.getElementById('auth-error');
  const logoutBtn = document.getElementById('logout-btn');

  // DOM Elements - Navigation & Tabs
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.admin-tab-content');
  const themeToggleBtn = document.getElementById('theme-toggle');

  // DOM Elements - Metrics
  const totalProjectsMetric = document.getElementById('metric-total-projects');
  const totalViewsMetric = document.getElementById('metric-total-views');
  const totalMessagesMetric = document.getElementById('metric-total-messages');
  const serverStatusMetric = document.getElementById('metric-server-status');
  const unreadCountBadge = document.getElementById('unread-count-badge');

  // DOM Elements - Projects
  const projectsTableBody = document.getElementById('projects-table-body');
  const addProjectBtn = document.getElementById('add-project-btn');
  const projectModal = document.getElementById('project-edit-modal');
  const projectModalClose = document.getElementById('project-modal-close');
  const projectForm = document.getElementById('project-form');
  const modalFormTitle = document.getElementById('modal-form-title');

  // File Upload Elements
  const fileInput = document.getElementById('form-project-file');
  const uploadFileTrigger = document.getElementById('upload-file-trigger');
  const uploadStatus = document.getElementById('upload-status');

  // DOM Elements - Messages
  const messagesTableBody = document.getElementById('messages-table-body');
  const refreshMessagesBtn = document.getElementById('refresh-messages-btn');
  const messageViewModal = document.getElementById('message-view-modal');
  const messageModalClose = document.getElementById('message-modal-close');

  // DOM Elements - Profile Form
  const profileForm = document.getElementById('profile-form');

  // DOM Elements - Export & Reset
  const codePreviewEl = document.getElementById('code-preview');
  const copyCodeBtn = document.getElementById('copy-code-btn');
  const downloadFileBtn = document.getElementById('download-file-btn');
  const resetDefaultsBtn = document.getElementById('reset-defaults-btn');
  const toastContainer = document.getElementById('toast-container');

  function getAuthHeader() {
    const token = sessionStorage.getItem(TOKEN_KEY);
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  /* ==========================================================================
     AUTHENTICATION LOGIC (API + JWT)
     ========================================================================== */
  async function checkAuthentication() {
    const token = sessionStorage.getItem(TOKEN_KEY);
    const isSessionAuth = sessionStorage.getItem(AUTH_KEY) === "true";

    if (token) {
      try {
        const res = await fetch(`${API_BASE}/api/auth/verify`, {
          headers: getAuthHeader()
        });
        const data = await res.json();
        if (data.authenticated) {
          authOverlay.style.display = "none";
          initDashboard();
          return;
        }
      } catch (e) {
        // Fallback to local session if server check fails
      }
    }

    if (isSessionAuth) {
      authOverlay.style.display = "none";
      initDashboard();
    } else {
      authOverlay.style.display = "flex";
      pinInput.value = "";
      pinInput.focus();
    }
  }

  async function handleLogin() {
    const enteredPin = pinInput.value.trim();
    if (!enteredPin) return;

    // Try API login first
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: enteredPin })
      });
      const data = await res.json();

      if (data.success && data.token) {
        sessionStorage.setItem(TOKEN_KEY, data.token);
        sessionStorage.setItem(AUTH_KEY, "true");
        authOverlay.style.display = "none";
        authError.style.display = "none";
        showToast("Connected to Backend API! Access Granted.");
        initDashboard();
        return;
      }
    } catch (e) {
      console.warn("API login failed, checking offline fallback", e);
    }

    // Offline fallback for static file preview
    if (enteredPin === DEFAULT_PIN) {
      sessionStorage.setItem(AUTH_KEY, "true");
      authOverlay.style.display = "none";
      authError.style.display = "none";
      showToast("Access Granted (Local Mode).");
      initDashboard();
    } else {
      authError.style.display = "block";
      pinInput.value = "";
      pinInput.focus();
    }
  }

  if (authSubmitBtn) authSubmitBtn.addEventListener('click', handleLogin);
  if (pinInput) {
    pinInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleLogin();
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      sessionStorage.removeItem(AUTH_KEY);
      sessionStorage.removeItem(TOKEN_KEY);
      checkAuthentication();
      showToast("Logged out successfully.");
    });
  }

  /* ==========================================================================
     DATA LOADING & SYNCHRONIZATION
     ========================================================================== */
  async function loadData() {
    // Attempt to load from REST API
    try {
      const [projRes, profileRes, statsRes] = await Promise.all([
        fetch(`${API_BASE}/api/projects`),
        fetch(`${API_BASE}/api/profile`),
        fetch(`${API_BASE}/api/stats`)
      ]);

      if (projRes.ok && profileRes.ok) {
        isApiOnline = true;
        adminData.projects = await projRes.json();
        const profData = await profileRes.json();
        adminData.profile = profData.profile;
        adminData.categories = profData.categories || (typeof portfolioData !== 'undefined' ? portfolioData.categories : []);
        
        if (serverStatusMetric) {
          serverStatusMetric.textContent = "Online";
          serverStatusMetric.style.color = "var(--accent-emerald)";
        }

        if (statsRes.ok) {
          const stats = await statsRes.json();
          if (totalViewsMetric) totalViewsMetric.textContent = stats.totalViews;
          if (totalMessagesMetric) totalMessagesMetric.textContent = stats.totalMessages;
          updateUnreadBadge(stats.unreadMessages);
        }

        renderProjectsTable();
        populateProfileForm();
        renderMetrics();
        loadMessages();
        return;
      }
    } catch (err) {
      console.warn("REST API is not reachable, using local fallback.", err);
    }

    // Fallback: LocalStorage / projects-data.js
    isApiOnline = false;
    if (serverStatusMetric) {
      serverStatusMetric.textContent = "Offline (Local)";
      serverStatusMetric.style.color = "var(--accent-amber)";
    }

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        adminData.projects = parsed.projects || [];
        adminData.profile = parsed.profile || null;
      } catch (e) {
        console.error(e);
      }
    } else if (typeof portfolioData !== 'undefined') {
      adminData = JSON.parse(JSON.stringify(portfolioData));
    }

    renderProjectsTable();
    populateProfileForm();
    renderMetrics();
  }

  /* ==========================================================================
     TAB SWITCHING
     ========================================================================== */
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      tabButtons.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.style.display = 'none');

      btn.classList.add('active');
      const activeContent = document.getElementById(`tab-${targetTab}`);
      if (activeContent) activeContent.style.display = 'block';

      if (targetTab === 'export') {
        updateCodePreview();
      } else if (targetTab === 'messages') {
        loadMessages();
      }
    });
  });

  /* ==========================================================================
     METRICS RENDERING
     ========================================================================== */
  function renderMetrics() {
    if (totalProjectsMetric) {
      totalProjectsMetric.textContent = adminData.projects.length;
    }
  }

  function updateUnreadBadge(count) {
    if (!unreadCountBadge) return;
    if (count && count > 0) {
      unreadCountBadge.textContent = count;
      unreadCountBadge.style.display = 'inline-block';
    } else {
      unreadCountBadge.style.display = 'none';
    }
  }

  /* ==========================================================================
     PROJECTS TABLE & CRUD
     ========================================================================== */
  function renderProjectsTable() {
    if (!projectsTableBody) return;

    if (adminData.projects.length === 0) {
      projectsTableBody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align: center; padding: 2.5rem; color: var(--text-muted);">
            No projects found. Click "Add New Project" to create one.
          </td>
        </tr>
      `;
      return;
    }

    projectsTableBody.innerHTML = adminData.projects.map((project) => `
      <tr>
        <td style="width: 80px;">
          <img class="table-thumb" src="${project.image}" alt="${escapeHtml(project.title)}" onerror="this.src='assets/project-ai.jpg'">
        </td>
        <td>
          <div class="table-title">${escapeHtml(project.title)}</div>
          <div class="table-sub">${escapeHtml(project.subtitle || '')}</div>
        </td>
        <td>
          <span class="admin-badge">${escapeHtml(project.category)}</span>
        </td>
        <td>
          <div style="font-size: 0.85rem; font-weight: 600; color: var(--text-primary); display: flex; align-items: center; gap: 0.35rem;">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            <span>${project.views || 0} views</span>
          </div>
          <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.2rem;">
            ${escapeHtml(project.metric || '—')}
          </div>
        </td>
        <td>
          <div class="table-actions">
            <button class="action-btn action-edit edit-project-btn" data-id="${project.id}">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
              <span>Edit</span>
            </button>
            <button class="action-btn action-delete delete-project-btn" data-id="${project.id}">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              <span>Delete</span>
            </button>
          </div>
        </td>
      </tr>
    `).join('');

    projectsTableBody.querySelectorAll('.edit-project-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        openProjectModal(e.currentTarget.getAttribute('data-id'));
      });
    });

    projectsTableBody.querySelectorAll('.delete-project-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        deleteProject(e.currentTarget.getAttribute('data-id'));
      });
    });
  }

  function openProjectModal(projectId = null) {
    editingProjectId = projectId;
    projectForm.reset();
    if (uploadStatus) uploadStatus.textContent = '';

    if (projectId) {
      modalFormTitle.textContent = "Edit Project";
      const project = adminData.projects.find(p => p.id === projectId);
      if (project) {
        document.getElementById('form-project-title').value = project.title || '';
        document.getElementById('form-project-subtitle').value = project.subtitle || '';
        document.getElementById('form-project-category').value = project.category || 'fullstack';
        document.getElementById('form-project-image').value = project.image || '';
        document.getElementById('form-project-metric').value = project.metric || '';
        document.getElementById('form-project-tags').value = (project.tags || []).join(', ');
        document.getElementById('form-project-overview').value = project.overview || '';
        document.getElementById('form-project-problem').value = project.problem || '';
        document.getElementById('form-project-solution').value = project.solution || '';
        document.getElementById('form-project-features').value = (project.features || []).join('\n');
        document.getElementById('form-project-demourl').value = project.demoUrl || '';
        document.getElementById('form-project-githuburl').value = project.githubUrl || '';
      }
    } else {
      modalFormTitle.textContent = "Add New Project";
      document.getElementById('form-project-category').value = 'fullstack';
      document.getElementById('form-project-image').value = 'assets/project-ai.jpg';
    }

    projectModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeProjectModal() {
    projectModal.classList.remove('active');
    document.body.style.overflow = '';
    editingProjectId = null;
  }

  if (addProjectBtn) addProjectBtn.addEventListener('click', () => openProjectModal(null));
  if (projectModalClose) projectModalClose.addEventListener('click', closeProjectModal);
  if (projectModal) {
    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) closeProjectModal();
    });
  }

  /* File Upload Trigger */
  if (uploadFileTrigger && fileInput) {
    uploadFileTrigger.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('image', file);

      if (uploadStatus) uploadStatus.textContent = 'Uploading...';

      try {
        const res = await fetch(`${API_BASE}/api/upload`, {
          method: 'POST',
          headers: getAuthHeader(),
          body: formData
        });
        const data = await res.json();
        if (data.success) {
          document.getElementById('form-project-image').value = data.url;
          if (uploadStatus) uploadStatus.textContent = `✔ Uploaded: ${file.name}`;
          showToast(`Image uploaded successfully!`);
        } else {
          if (uploadStatus) uploadStatus.textContent = 'Upload failed';
          showToast(`Upload error: ${data.error || 'Server rejected file'}`);
        }
      } catch (err) {
        console.error(err);
        if (uploadStatus) uploadStatus.textContent = 'Upload failed (Network)';
        showToast("Could not upload file to server.");
      }
    });
  }

  // Handle Project Form Submit (API with LocalStorage fallback)
  if (projectForm) {
    projectForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const projectPayload = {
        title: document.getElementById('form-project-title').value.trim(),
        subtitle: document.getElementById('form-project-subtitle').value.trim(),
        category: document.getElementById('form-project-category').value,
        image: document.getElementById('form-project-image').value.trim() || 'assets/project-ai.jpg',
        metric: document.getElementById('form-project-metric').value.trim(),
        tags: document.getElementById('form-project-tags').value.split(',').map(t => t.trim()).filter(Boolean),
        overview: document.getElementById('form-project-overview').value.trim(),
        problem: document.getElementById('form-project-problem').value.trim(),
        solution: document.getElementById('form-project-solution').value.trim(),
        features: document.getElementById('form-project-features').value.split('\n').map(f => f.trim()).filter(Boolean),
        demoUrl: document.getElementById('form-project-demourl').value.trim() || '#',
        githubUrl: document.getElementById('form-project-githuburl').value.trim() || '#'
      };

      if (isApiOnline) {
        try {
          const url = editingProjectId ? `${API_BASE}/api/projects/${editingProjectId}` : `${API_BASE}/api/projects`;
          const method = editingProjectId ? 'PUT' : 'POST';

          const res = await fetch(url, {
            method: method,
            headers: {
              'Content-Type': 'application/json',
              ...getAuthHeader()
            },
            body: JSON.stringify(projectPayload)
          });
          const result = await res.json();

          if (result.success) {
            showToast(`Project saved to database successfully!`);
            closeProjectModal();
            loadData();
            return;
          }
        } catch (err) {
          console.error("API update failed, fallback to local", err);
        }
      }

      // Local fallback
      if (editingProjectId) {
        const index = adminData.projects.findIndex(p => p.id === editingProjectId);
        if (index !== -1) {
          adminData.projects[index] = { ...adminData.projects[index], ...projectPayload };
        }
      } else {
        const id = projectPayload.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `proj-${Date.now()}`;
        adminData.projects.unshift({ id, ...projectPayload, views: 0 });
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(adminData));
      showToast(`Project saved in local storage!`);
      closeProjectModal();
      renderProjectsTable();
      renderMetrics();
    });
  }

  async function deleteProject(projectId) {
    const project = adminData.projects.find(p => p.id === projectId);
    if (!project) return;

    if (confirm(`Are you sure you want to delete "${project.title}"?`)) {
      if (isApiOnline) {
        try {
          const res = await fetch(`${API_BASE}/api/projects/${projectId}`, {
            method: 'DELETE',
            headers: getAuthHeader()
          });
          if (res.ok) {
            showToast(`Project "${project.title}" deleted from database.`);
            loadData();
            return;
          }
        } catch (e) {
          console.warn("API delete failed, fallback to local", e);
        }
      }

      adminData.projects = adminData.projects.filter(p => p.id !== projectId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(adminData));
      renderProjectsTable();
      renderMetrics();
      showToast(`Project "${project.title}" deleted.`);
    }
  }

  /* ==========================================================================
     MESSAGES INBOX (API)
     ========================================================================= */
  async function loadMessages() {
    if (!messagesTableBody) return;

    if (!isApiOnline) {
      messagesTableBody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align: center; padding: 2rem; color: var(--text-muted);">
            Backend API is currently offline. Start the Node.js server to receive live messages.
          </td>
        </tr>
      `;
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/messages`, {
        headers: getAuthHeader()
      });
      if (res.ok) {
        adminData.messages = await res.json();
        renderMessagesTable();

        const unread = adminData.messages.filter(m => m.isRead === 0).length;
        updateUnreadBadge(unread);
        if (totalMessagesMetric) totalMessagesMetric.textContent = adminData.messages.length;
      }
    } catch (err) {
      console.error('Failed to load messages:', err);
    }
  }

  if (refreshMessagesBtn) {
    refreshMessagesBtn.addEventListener('click', () => {
      loadMessages();
      showToast("Messages refreshed!");
    });
  }

  function renderMessagesTable() {
    if (!messagesTableBody) return;

    if (adminData.messages.length === 0) {
      messagesTableBody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align: center; padding: 2.5rem; color: var(--text-muted);">
            No messages received yet. Messages sent through the contact form will appear here.
          </td>
        </tr>
      `;
      return;
    }

    messagesTableBody.innerHTML = adminData.messages.map(msg => {
      const isUnread = msg.isRead === 0;
      const formattedDate = new Date(msg.createdAt).toLocaleDateString() + ' ' + new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      return `
        <tr style="${isUnread ? 'background-color: rgba(99, 102, 241, 0.05); font-weight: 500;' : ''}">
          <td>
            <div style="font-weight: 600; color: var(--text-primary);">${escapeHtml(msg.name)}</div>
            <div style="font-size: 0.8rem; color: var(--text-muted);">${escapeHtml(msg.email)}</div>
          </td>
          <td>
            <div style="font-weight: 600; color: var(--text-primary);">${escapeHtml(msg.subject || 'No Subject')}</div>
            <div style="font-size: 0.8rem; color: var(--text-secondary); max-width: 320px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
              ${escapeHtml(msg.message)}
            </div>
          </td>
          <td style="font-size: 0.8rem; color: var(--text-muted); white-space: nowrap;">
            ${formattedDate}
          </td>
          <td>
            ${isUnread ? 
              `<span class="tag-pill" style="background: rgba(236, 72, 153, 0.15); color: var(--accent-pink); font-size: 0.75rem; border: 1px solid rgba(236, 72, 153, 0.3);">New</span>` : 
              `<span class="tag-pill" style="color: var(--text-muted); font-size: 0.75rem;">Read</span>`}
          </td>
          <td>
            <div class="table-actions">
              <button class="action-btn action-edit view-msg-btn" data-id="${msg.id}">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                <span>Read</span>
              </button>
              <button class="action-btn action-delete delete-msg-btn" data-id="${msg.id}">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    messagesTableBody.querySelectorAll('.view-msg-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        openMessageModal(parseInt(e.currentTarget.getAttribute('data-id')));
      });
    });

    messagesTableBody.querySelectorAll('.delete-msg-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        deleteMessage(parseInt(e.currentTarget.getAttribute('data-id')));
      });
    });
  }

  async function openMessageModal(messageId) {
    const msg = adminData.messages.find(m => m.id === messageId);
    if (!msg || !messageViewModal) return;

    document.getElementById('msg-detail-sender').textContent = msg.name;
    document.getElementById('msg-detail-email').textContent = msg.email;
    document.getElementById('msg-detail-subject').textContent = msg.subject || 'No Subject';
    document.getElementById('msg-detail-date').textContent = new Date(msg.createdAt).toLocaleString();
    document.getElementById('msg-detail-body').textContent = msg.message;
    document.getElementById('msg-reply-btn').href = `mailto:${encodeURIComponent(msg.email)}?subject=${encodeURIComponent('Re: ' + (msg.subject || 'Portfolio Inquiry'))}`;

    messageViewModal.classList.add('active');

    // Mark as read on server
    if (msg.isRead === 0 && isApiOnline) {
      try {
        await fetch(`${API_BASE}/api/messages/${messageId}/read`, {
          method: 'PATCH',
          headers: getAuthHeader()
        });
        msg.isRead = 1;
        renderMessagesTable();
        const unread = adminData.messages.filter(m => m.isRead === 0).length;
        updateUnreadBadge(unread);
      } catch (e) {
        console.error(e);
      }
    }
  }

  if (messageModalClose && messageViewModal) {
    messageModalClose.addEventListener('click', () => messageViewModal.classList.remove('active'));
    messageViewModal.addEventListener('click', (e) => {
      if (e.target === messageViewModal) messageViewModal.classList.remove('active');
    });
  }

  async function deleteMessage(messageId) {
    if (!confirm('Are you sure you want to delete this message?')) return;

    if (isApiOnline) {
      try {
        const res = await fetch(`${API_BASE}/api/messages/${messageId}`, {
          method: 'DELETE',
          headers: getAuthHeader()
        });
        if (res.ok) {
          showToast('Message deleted.');
          loadMessages();
          return;
        }
      } catch (e) {
        console.error(e);
      }
    }

    adminData.messages = adminData.messages.filter(m => m.id !== messageId);
    renderMessagesTable();
    showToast('Message deleted.');
  }

  /* ==========================================================================
     PROFILE SETTINGS FORM (API + Local)
     ========================================================================== */
  function populateProfileForm() {
    const profile = adminData.profile;
    if (!profile) return;

    document.getElementById('form-profile-name').value = profile.name || '';
    document.getElementById('form-profile-title').value = profile.title || '';
    document.getElementById('form-profile-status').value = profile.statusBadge || '';
    document.getElementById('form-profile-bio').value = profile.bio || '';
    document.getElementById('form-profile-email').value = profile.email || '';
    document.getElementById('form-profile-phone').value = profile.phone || '';
    document.getElementById('form-profile-github').value = profile.socialLinks?.github || '';
    document.getElementById('form-profile-linkedin').value = profile.socialLinks?.linkedin || '';
  }

  if (profileForm) {
    profileForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const profilePayload = {
        name: document.getElementById('form-profile-name').value.trim(),
        title: document.getElementById('form-profile-title').value.trim(),
        statusBadge: document.getElementById('form-profile-status').value.trim(),
        bio: document.getElementById('form-profile-bio').value.trim(),
        email: document.getElementById('form-profile-email').value.trim(),
        phone: document.getElementById('form-profile-phone').value.trim(),
        socialLinks: {
          ...(adminData.profile?.socialLinks || {}),
          github: document.getElementById('form-profile-github').value.trim(),
          linkedin: document.getElementById('form-profile-linkedin').value.trim()
        }
      };

      if (isApiOnline) {
        try {
          const res = await fetch(`${API_BASE}/api/profile`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              ...getAuthHeader()
            },
            body: JSON.stringify(profilePayload)
          });
          const data = await res.json();
          if (data.success) {
            adminData.profile = data.profile;
            showToast("Profile settings saved to database!");
            return;
          }
        } catch (err) {
          console.warn("API profile update failed, fallback to local", err);
        }
      }

      adminData.profile = { ...(adminData.profile || {}), ...profilePayload };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(adminData));
      showToast("Profile settings saved to local storage!");
    });
  }

  /* ==========================================================================
     EXPORT & BACKUP TOOLS
     ========================================================================== */
  function generateExportCode() {
    return `/**\n * Portfolio Data Configuration\n * Exported from Admin Panel on ${new Date().toLocaleString()}\n */\n\nconst portfolioData = ${JSON.stringify(adminData, null, 2)};\n`;
  }

  function updateCodePreview() {
    if (codePreviewEl) {
      codePreviewEl.textContent = generateExportCode();
    }
  }

  if (copyCodeBtn) {
    copyCodeBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(generateExportCode()).then(() => {
        showToast("Exported code copied to clipboard!");
      });
    });
  }

  if (downloadFileBtn) {
    downloadFileBtn.addEventListener('click', () => {
      const code = generateExportCode();
      const blob = new Blob([code], { type: 'text/javascript' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'projects-data.js';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast("File downloaded as 'projects-data.js'!");
    });
  }

  if (resetDefaultsBtn) {
    resetDefaultsBtn.addEventListener('click', () => {
      if (confirm("Reset all projects and profile data to factory defaults?")) {
        localStorage.removeItem(STORAGE_KEY);
        loadData();
        showToast("Restored to factory defaults.");
      }
    });
  }

  /* ==========================================================================
     THEME TOGGLE
     ========================================================================== */
  const currentTheme = localStorage.getItem('portfolio-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const nowTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', nowTheme);
      localStorage.setItem('portfolio-theme', nowTheme);
      showToast(`Switched to ${nowTheme} mode`);
    });
  }

  /* ==========================================================================
     TOAST ALERTS
     ========================================================================== */
  function showToast(message) {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast show';
    toast.innerHTML = `
      <svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      <span class="toast-msg">${escapeHtml(message)}</span>
    `;
    toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 3000);
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function initDashboard() {
    loadData();
  }

  checkAuthentication();
});
