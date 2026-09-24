const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, '..');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
const DB_PATH = path.join(DATA_DIR, 'portfolio.db');
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Error connecting to SQLite database:', err.message);
  } else {
    console.log('Connected to SQLite database at', DB_PATH);
  }
});

// Helper for promises
const runQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
};

const getQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const allQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

// Initialize schema and seed defaults
async function initDatabase() {
  await runQuery(`
    CREATE TABLE IF NOT EXISTS profile (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      name TEXT NOT NULL,
      title TEXT NOT NULL,
      statusBadge TEXT,
      bio TEXT,
      location TEXT,
      email TEXT,
      phone TEXT,
      socialLinks TEXT,
      stats TEXT,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await runQuery(`
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      subtitle TEXT,
      category TEXT NOT NULL,
      image TEXT,
      metric TEXT,
      tags TEXT,
      overview TEXT,
      problem TEXT,
      solution TEXT,
      features TEXT,
      demoUrl TEXT,
      githubUrl TEXT,
      views INTEGER DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await runQuery(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT,
      message TEXT NOT NULL,
      isRead INTEGER DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await runQuery(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      label TEXT NOT NULL
    )
  `);

  await runQuery(`
    CREATE TABLE IF NOT EXISTS skills (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category TEXT NOT NULL,
      icon TEXT,
      items TEXT
    )
  `);

  await runQuery(`
    CREATE TABLE IF NOT EXISTS experience (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      role TEXT NOT NULL,
      company TEXT NOT NULL,
      period TEXT NOT NULL,
      description TEXT
    )
  `);

  // Check if profile exists, if not seed default
  const existingProfile = await getQuery('SELECT * FROM profile WHERE id = 1');
  if (!existingProfile) {
    console.log('Seeding initial profile data...');
    const defaultProfile = {
      name: "Jaloliddin",
      title: "Full-Stack Software Engineer & Python / Web Developer",
      statusBadge: "Available for new projects & full-time roles",
      bio: "Passionate software engineer dedicated to building high-performance web applications, scalable distributed architectures, and automated Telegram bot systems.",
      location: "Global / Remote",
      email: "sharobiddinovjaloliddin97@gmail.com",
      phone: "+998 (90) 000-0000",
      socialLinks: JSON.stringify({
        github: "https://github.com/sharobiddinovjaloliddin97-sudo",
        linkedin: "https://www.linkedin.com/in/jaloliddin-sharobiddinov-4a4960293/",
        twitter: "https://twitter.com",
        telegram: "https://t.me"
      }),
      stats: JSON.stringify([
        { value: "5+", label: "Production Projects" },
        { value: "3+", label: "Years Experience" },
        { value: "1.2k+", label: "Git Commits" },
        { value: "100%", label: "Client Satisfaction" }
      ])
    };

    await runQuery(`
      INSERT INTO profile (id, name, title, statusBadge, bio, location, email, phone, socialLinks, stats)
      VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      defaultProfile.name,
      defaultProfile.title,
      defaultProfile.statusBadge,
      defaultProfile.bio,
      defaultProfile.location,
      defaultProfile.email,
      defaultProfile.phone,
      defaultProfile.socialLinks,
      defaultProfile.stats
    ]);
  } else {
    // Update existing profile email & github & linkedin
    await runQuery(`
      UPDATE profile
      SET email = 'sharobiddinovjaloliddin97@gmail.com',
          socialLinks = json_set(
            json_set(COALESCE(socialLinks, '{}'), '$.github', 'https://github.com/sharobiddinovjaloliddin97-sudo'),
            '$.linkedin', 'https://www.linkedin.com/in/jaloliddin-sharobiddinov-4a4960293/'
          )
      WHERE id = 1
    `).catch(() => {});
  }

  // Real GitHub projects list
  const defaultProjects = [
    {
      id: "velmora-ecommerce",
      title: "Velmora E-Commerce Platform",
      subtitle: "Production-ready bilingual e-commerce suite with Django REST, React & PostgreSQL",
      category: "fullstack",
      image: "assets/velmora-logo.jpg",
      metric: "🛍️ Live on Vercel • Bilingual (UZ/RU)",
      tags: JSON.stringify(["React", "Vite", "Tailwind CSS", "Django", "Django REST", "PostgreSQL", "JWT"]),
      overview: "Velmora is a production-ready bilingual e-commerce web platform engineered with React (Vite) and Django REST Framework, featuring localized shopping, cart checkout, and JWT authentication.",
      problem: "Online stores often struggle with clunky multi-language support and slow catalog queries on high-traffic product pages.",
      solution: "Engineered a decoupled React frontend styled with Tailwind CSS, backed by a high-throughput Django REST API and PostgreSQL database with Swagger documentation.",
      features: JSON.stringify([
        "Bilingual user interface supporting Uzbek and Russian localized shopping",
        "High-performance React + Vite frontend with Tailwind CSS styling",
        "Django REST Framework backend with Swagger and OpenAPI documentation",
        "Production PostgreSQL database with JWT session authentication and secure checkout"
      ]),
      demoUrl: "https://velmora-ecommerce-chi.vercel.app",
      githubUrl: "https://github.com/sharobiddinovjaloliddin97-sudo/velmora-ecommerce",
      views: 184
    },
    {
      id: "agrobank-attendance",
      title: "Agrobank Attendance & Employee Analytics",
      subtitle: "Bank employee check-in monitoring, biometric/E-IMZO auth & attendance analytics",
      category: "frontend",
      image: "assets/agrobank-logo.jpg",
      metric: "🏦 Enterprise HR Tool • E-IMZO Auth",
      tags: JSON.stringify(["JavaScript", "HTML5", "CSS3", "Chart.js", "E-IMZO", "REST API"]),
      overview: "An enterprise bank employee attendance and workforce analytics dashboard designed to monitor employee check-ins, late arrivals, and personnel department metrics in real-time.",
      problem: "Manual employee attendance tracking across bank branches causes latency in HR payroll calculations and attendance verification.",
      solution: "Created an intuitive bank portal interface with secure authorization, E-IMZO digital signature integration, and live statistical charts.",
      features: JSON.stringify([
        "Modern authentication with E-IMZO digital signature integration",
        "Real-time attendance timeline tracking (check-in / check-out timestamps)",
        "Department-level workforce analytics and late arrival warning indicators",
        "Fully responsive unscrollable dashboard layout optimized for corporate workstations"
      ]),
      demoUrl: "https://github.com/sharobiddinovjaloliddin97-sudo/agrobank-attendance",
      githubUrl: "https://github.com/sharobiddinovjaloliddin97-sudo/agrobank-attendance",
      views: 126
    },
    {
      id: "spyfall-bot",
      title: "Spyfall (Shpion) Telegram Bot Game",
      subtitle: "Asynchronous multiplayer party game bot powered by Python & python-telegram-bot",
      category: "tools",
      image: "assets/spyfall-logo.jpg",
      metric: "🎮 Async Group Game • 0% AI Cost",
      tags: JSON.stringify(["Python 3.11", "python-telegram-bot", "AsyncIO", "Telegram API"]),
      overview: "An asynchronous group game bot based on the popular Spyfall social deduction game, running entirely on pure Python game logic without requiring external AI credits.",
      problem: "Organizing social deduction board games online often requires complex third-party apps with high latency and expensive API subscriptions.",
      solution: "Engineered an event-driven Telegram bot using python-telegram-bot v21 that manages room lobbies, secret role distribution, and voting rounds directly inside Telegram groups.",
      features: JSON.stringify([
        "Multiplayer group lobby creation with automatic secret role assignment",
        "Asynchronous non-blocking game loops powered by Python 3.11 AsyncIO",
        "Pure Python deterministic game logic with zero external AI API costs",
        "Interactive inline buttons for voting, timer alerts, and spy reveal"
      ]),
      demoUrl: "https://github.com/sharobiddinovjaloliddin97-sudo/Spyfall",
      githubUrl: "https://github.com/sharobiddinovjaloliddin97-sudo/Spyfall",
      views: 210
    },
    {
      id: "velmora-bot",
      title: "Velmora E-Commerce Telegram Store Bot",
      subtitle: "Telegram storefront bot bridging chat ordering with Django e-commerce backend",
      category: "tools",
      image: "assets/velmora-logo.jpg",
      metric: "🛒 In-Chat Storefront • Instant Ordering",
      tags: JSON.stringify(["Python", "python-telegram-bot", "Django REST API", "Webhooks", "E-Commerce"]),
      overview: "A dedicated Telegram bot client designed for the Velmora E-Commerce ecosystem, enabling customers to browse product catalogs, check stock, and place orders directly within Telegram.",
      problem: "Many customers in Central Asia prefer ordering directly through Telegram messaging rather than navigating standalone web browsers.",
      solution: "Engineered an in-chat conversational storefront connecting directly to Velmora's backend REST API with product cards, cart management, and order notifications.",
      features: JSON.stringify([
        "Interactive product catalog browsing with image previews and size variants",
        "Seamless synchronization with Velmora Django backend product database",
        "In-chat cart manipulation with total price calculations and promo codes",
        "Automated admin order alert dispatches upon checkout completion"
      ]),
      demoUrl: "https://github.com/sharobiddinovjaloliddin97-sudo/velmora_bot",
      githubUrl: "https://github.com/sharobiddinovjaloliddin97-sudo/velmora_bot",
      views: 145
    },
    {
      id: "family-birthday-bot",
      title: "Family Birthday & Event Reminder Bot",
      subtitle: "Automated event scheduler & birthday notification bot with SQLite and aiohttp webhooks",
      category: "tools",
      image: "assets/familybot-logo.png",
      metric: "🎂 Automated Reminders • 24/7 Webhook",
      tags: JSON.stringify(["Python 3.11", "python-telegram-bot", "SQLite", "APScheduler", "aiohttp"]),
      overview: "An automated Telegram assistant built to remember family birthdays, anniversaries, and custom recurrent events, dispatching timed congratulatory notifications to groups and private chats.",
      problem: "Remembering recurring family birthdays and important milestone anniversaries is easy to forget across busy schedules and distributed family groups.",
      solution: "Built a background scheduling engine with APScheduler and SQLite persistence that checks event calendars daily and pushes proactive morning reminder cards.",
      features: JSON.stringify([
        "Smart recurring reminder scheduler with timezone-aware notification triggers",
        "Persistent event database storing birthdates and anniversary milestones via SQLite",
        "Integrated aiohttp web server keeping the bot active 24/7 on free cloud hosts",
        "Intuitive Telegram bot commands for adding, listing, and removing upcoming dates"
      ]),
      demoUrl: "https://github.com/sharobiddinovjaloliddin97-sudo/FamilyBirthdayBot",
      githubUrl: "https://github.com/sharobiddinovjaloliddin97-sudo/FamilyBirthdayBot",
      views: 133
    }
  ];

  // Automatic Migration: Remove old mock projects & test entries
  const oldMockIds = ['aether-ai', 'stride-luxe', 'cryptobank-hub', 'nexus-cloud-mesh', 'hyperfast-cli', 'zenith-health', 'velmora-silk-products'];
  await runQuery(`DELETE FROM projects WHERE id IN ('${oldMockIds.join("','")}')`);

  // Ensure real projects exist in SQLite
  for (const proj of defaultProjects) {
    const existing = await getQuery('SELECT id FROM projects WHERE id = ?', [proj.id]);
    if (!existing) {
      await runQuery(`
        INSERT INTO projects (id, title, subtitle, category, image, metric, tags, overview, problem, solution, features, demoUrl, githubUrl, views)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        proj.id, proj.title, proj.subtitle, proj.category, proj.image, proj.metric, proj.tags,
        proj.overview, proj.problem, proj.solution, proj.features, proj.demoUrl, proj.githubUrl, proj.views
      ]);
    }
  }

  // Update existing project images to newly uploaded user assets
  await runQuery("UPDATE projects SET image = 'assets/velmora-logo.jpg' WHERE id IN ('velmora-ecommerce', 'velmora-bot')");
  await runQuery("UPDATE projects SET image = 'assets/spyfall-logo.jpg' WHERE id = 'spyfall-bot'");
  await runQuery("UPDATE projects SET image = 'assets/agrobank-logo.jpg' WHERE id = 'agrobank-attendance'");
  await runQuery("UPDATE projects SET image = 'assets/familybot-logo.png' WHERE id = 'family-birthday-bot'");

  // Seed / update categories
  const cats = [
    { id: "all", label: "All Projects" },
    { id: "fullstack", label: "Full Stack" },
    { id: "frontend", label: "Frontend / UI" },
    { id: "tools", label: "Telegram Bots & Tools" }
  ];
  await runQuery(`DELETE FROM categories WHERE id IN ('mobile', 'devops')`);
  for (const c of cats) {
    const existing = await getQuery('SELECT id FROM categories WHERE id = ?', [c.id]);
    if (!existing) {
      await runQuery('INSERT INTO categories (id, label) VALUES (?, ?)', [c.id, c.label]);
    } else {
      await runQuery('UPDATE categories SET label = ? WHERE id = ?', [c.label, c.id]);
    }
  }

  // Seed skills
  const skillsCount = await getQuery('SELECT COUNT(*) as count FROM skills');
  if (skillsCount.count === 0) {
    const defaultSkills = [
      {
        category: "Frontend Engineering",
        icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,
        items: JSON.stringify([
          { name: "JavaScript (ES6+) & TypeScript", level: 92 },
          { name: "React, Vite & Next.js", level: 90 },
          { name: "Tailwind CSS & Responsive UI", level: 95 },
          { name: "Chart.js & Dashboard Graphics", level: 85 }
        ])
      },
      {
        category: "Backend & Python Ecosystem",
        icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 17l6-6-6-6"/><path d="M12 19h8"/></svg>`,
        items: JSON.stringify([
          { name: "Python 3.11 & AsyncIO", level: 95 },
          { name: "Django & Django REST Framework", level: 92 },
          { name: "Node.js & Express API", level: 88 },
          { name: "python-telegram-bot & Webhooks", level: 96 }
        ])
      },
      {
        category: "Databases & Cloud Architecture",
        icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>`,
        items: JSON.stringify([
          { name: "PostgreSQL & SQLite Database", level: 90 },
          { name: "Docker & Container Deployments", level: 85 },
          { name: "Railway, Vercel & Cloudflare", level: 92 },
          { name: "Git, GitHub CI/CD & APIs", level: 90 }
        ])
      },
      {
        category: "Security & Systems",
        icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`,
        items: JSON.stringify([
          { name: "JWT Authentication & Security", level: 92 },
          { name: "E-IMZO Digital Signature Auth", level: 86 },
          { name: "RESTful API Architecture", level: 94 },
          { name: "Webhooks & Event Schedulers", level: 90 }
        ])
      }
    ];

    for (const s of defaultSkills) {
      await runQuery('INSERT INTO skills (category, icon, items) VALUES (?, ?, ?)', [s.category, s.icon, s.items]);
    }
  }

  // Seed experience
  const expCount = await getQuery('SELECT COUNT(*) as count FROM experience');
  if (expCount.count === 0) {
    const defaultExp = [
      {
        role: "Lead Full-Stack Developer",
        company: "Apex Tech Innovations",
        period: "2023 - Present",
        description: "Spearheading engineering efforts for cloud enterprise applications, mentoring junior engineers, and architecting real-time WebSocket systems serving over 150,000 monthly active users."
      },
      {
        role: "Senior Frontend Engineer",
        company: "Nova Digital Labs",
        period: "2021 - 2023",
        description: "Engineered scalable component libraries, reduced First Contentful Paint by 42%, and delivered flagship e-commerce platforms with interactive 3D WebGL interfaces."
      },
      {
        role: "Full-Stack Web Developer",
        company: "Craft Code Studio",
        period: "2020 - 2021",
        description: "Developed custom client portals, integrated secure payment gateways, and configured automated CI/CD deployment pipelines on AWS."
      },
      {
        role: "B.S. in Computer Science & Engineering",
        company: "State Technical University",
        period: "2016 - 2020",
        description: "Graduated with honors. Focused on algorithms, distributed databases, human-computer interaction, and software design patterns."
      }
    ];

    for (const e of defaultExp) {
      await runQuery('INSERT INTO experience (role, company, period, description) VALUES (?, ?, ?, ?)', [e.role, e.company, e.period, e.description]);
    }
  }

  console.log('Database initialization completed.');
}

module.exports = {
  db,
  runQuery,
  getQuery,
  allQuery,
  initDatabase
};
