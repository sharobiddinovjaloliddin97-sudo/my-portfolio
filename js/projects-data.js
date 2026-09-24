/**
 * Portfolio Data Configuration
 * Real Projects and Profile of Jaloliddin Sharobiddinov
 */

const portfolioData = {
  profile: {
    name: "Jaloliddin",
    title: "Full-Stack Software Engineer & Python / Web Developer",
    statusBadge: "Available for new projects & full-time roles",
    bio: "Passionate software engineer dedicated to building high-performance web applications, scalable distributed architectures, and automated Telegram bot systems.",
    location: "Global / Remote",
    email: "sharobiddinovjaloliddin97@gmail.com",
    phone: "+998 (90) 000-0000",
    socialLinks: {
      github: "https://github.com/sharobiddinovjaloliddin97-sudo",
      linkedin: "https://www.linkedin.com/in/jaloliddin-sharobiddinov-4a4960293/",
      twitter: "https://twitter.com",
      telegram: "https://t.me"
    },
    stats: [
      { value: "5+", label: "Production Projects" },
      { value: "3+", label: "Years Experience" },
      { value: "1.2k+", label: "Git Commits" },
      { value: "100%", label: "Client Satisfaction" }
    ]
  },

  categories: [
    { id: "all", label: "All Projects" },
    { id: "fullstack", label: "Full Stack" },
    { id: "frontend", label: "Frontend / UI" },
    { id: "tools", label: "Telegram Bots & Tools" }
  ],

  projects: [
    {
      id: "velmora-ecommerce",
      title: "Velmora E-Commerce Platform",
      subtitle: "Production-ready bilingual e-commerce suite with Django REST, React & PostgreSQL",
      category: "fullstack",
      image: "assets/velmora-logo.jpg",
      metric: "🛍️ Live on Vercel • Bilingual (UZ/RU)",
      tags: ["React", "Vite", "Tailwind CSS", "Django", "Django REST", "PostgreSQL", "JWT"],
      overview: "Velmora is a production-ready bilingual e-commerce web platform engineered with React (Vite) and Django REST Framework, featuring localized shopping, cart checkout, and JWT authentication.",
      problem: "Online stores often struggle with clunky multi-language support and slow catalog queries on high-traffic product pages.",
      solution: "Engineered a decoupled React frontend styled with Tailwind CSS, backed by a high-throughput Django REST API and PostgreSQL database with Swagger documentation.",
      features: [
        "Bilingual user interface supporting Uzbek and Russian localized shopping",
        "High-performance React + Vite frontend with Tailwind CSS styling",
        "Django REST Framework backend with Swagger and OpenAPI documentation",
        "Production PostgreSQL database with JWT session authentication and secure checkout"
      ],
      demoUrl: "https://velmora-ecommerce-chi.vercel.app",
      githubUrl: "https://github.com/sharobiddinovjaloliddin97-sudo/velmora-ecommerce"
    },
    {
      id: "agrobank-attendance",
      title: "Agrobank Attendance & Employee Analytics",
      subtitle: "Bank employee check-in monitoring, biometric/E-IMZO auth & attendance analytics",
      category: "frontend",
      image: "assets/agrobank-logo.jpg",
      metric: "🏦 Enterprise HR Tool • E-IMZO Auth",
      tags: ["JavaScript", "HTML5", "CSS3", "Chart.js", "E-IMZO", "REST API"],
      overview: "An enterprise bank employee attendance and workforce analytics dashboard designed to monitor employee check-ins, late arrivals, and personnel department metrics in real-time.",
      problem: "Manual employee attendance tracking across bank branches causes latency in HR payroll calculations and attendance verification.",
      solution: "Created an intuitive bank portal interface with secure authorization, E-IMZO digital signature integration, and live statistical charts.",
      features: [
        "Modern authentication with E-IMZO digital signature integration",
        "Real-time attendance timeline tracking (check-in / check-out timestamps)",
        "Department-level workforce analytics and late arrival warning indicators",
        "Fully responsive unscrollable dashboard layout optimized for corporate workstations"
      ],
      demoUrl: "https://github.com/sharobiddinovjaloliddin97-sudo/agrobank-attendance",
      githubUrl: "https://github.com/sharobiddinovjaloliddin97-sudo/agrobank-attendance"
    },
    {
      id: "spyfall-bot",
      title: "Spyfall (Shpion) Telegram Bot Game",
      subtitle: "Asynchronous multiplayer party game bot powered by Python & python-telegram-bot",
      category: "tools",
      image: "assets/spyfall-logo.jpg",
      metric: "🎮 Async Group Game • 0% AI Cost",
      tags: ["Python 3.11", "python-telegram-bot", "AsyncIO", "Telegram API"],
      overview: "An asynchronous group game bot based on the popular Spyfall social deduction game, running entirely on pure Python game logic without requiring external AI credits.",
      problem: "Organizing social deduction board games online often requires complex third-party apps with high latency and expensive API subscriptions.",
      solution: "Engineered an event-driven Telegram bot using python-telegram-bot v21 that manages room lobbies, secret role distribution, and voting rounds directly inside Telegram groups.",
      features: [
        "Multiplayer group lobby creation with automatic secret role assignment",
        "Asynchronous non-blocking game loops powered by Python 3.11 AsyncIO",
        "Pure Python deterministic game logic with zero external AI API costs",
        "Interactive inline buttons for voting, timer alerts, and spy reveal"
      ],
      demoUrl: "https://github.com/sharobiddinovjaloliddin97-sudo/Spyfall",
      githubUrl: "https://github.com/sharobiddinovjaloliddin97-sudo/Spyfall"
    },
    {
      id: "velmora-bot",
      title: "Velmora E-Commerce Telegram Store Bot",
      subtitle: "Telegram storefront bot bridging chat ordering with Django e-commerce backend",
      category: "tools",
      image: "assets/velmora-logo.jpg",
      metric: "🛒 In-Chat Storefront • Instant Ordering",
      tags: ["Python", "python-telegram-bot", "Django REST API", "Webhooks", "E-Commerce"],
      overview: "A dedicated Telegram bot client designed for the Velmora E-Commerce ecosystem, enabling customers to browse product catalogs, check stock, and place orders directly within Telegram.",
      problem: "Many customers in Central Asia prefer ordering directly through Telegram messaging rather than navigating standalone web browsers.",
      solution: "Engineered an in-chat conversational storefront connecting directly to Velmora's backend REST API with product cards, cart management, and order notifications.",
      features: [
        "Interactive product catalog browsing with image previews and size variants",
        "Seamless synchronization with Velmora Django backend product database",
        "In-chat cart manipulation with total price calculations and promo codes",
        "Automated admin order alert dispatches upon checkout completion"
      ],
      demoUrl: "https://github.com/sharobiddinovjaloliddin97-sudo/velmora_bot",
      githubUrl: "https://github.com/sharobiddinovjaloliddin97-sudo/velmora_bot"
    },
    {
      id: "family-birthday-bot",
      title: "Family Birthday & Event Reminder Bot",
      subtitle: "Automated event scheduler & birthday notification bot with SQLite and aiohttp webhooks",
      category: "tools",
      image: "assets/familybot-logo.png",
      metric: "🎂 Automated Reminders • 24/7 Webhook",
      tags: ["Python 3.11", "python-telegram-bot", "SQLite", "APScheduler", "aiohttp"],
      overview: "An automated Telegram assistant built to remember family birthdays, anniversaries, and custom recurrent events, dispatching timed congratulatory notifications to groups and private chats.",
      problem: "Remembering recurring family birthdays and important milestone anniversaries is easy to forget across busy schedules and distributed family groups.",
      solution: "Built a background scheduling engine with APScheduler and SQLite persistence that checks event calendars daily and pushes proactive morning reminder cards.",
      features: [
        "Smart recurring reminder scheduler with timezone-aware notification triggers",
        "Persistent event database storing birthdates and anniversary milestones via SQLite",
        "Integrated aiohttp web server keeping the bot active 24/7 on free cloud hosts",
        "Intuitive Telegram bot commands for adding, listing, and removing upcoming dates"
      ],
      demoUrl: "https://github.com/sharobiddinovjaloliddin97-sudo/FamilyBirthdayBot",
      githubUrl: "https://github.com/sharobiddinovjaloliddin97-sudo/FamilyBirthdayBot"
    }
  ],

  skills: [
    {
      category: "Frontend Engineering",
      icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,
      items: [
        { name: "JavaScript (ES6+) & TypeScript", level: 92 },
        { name: "React, Vite & Next.js", level: 90 },
        { name: "Tailwind CSS & Responsive UI", level: 95 },
        { name: "Chart.js & Dashboard Graphics", level: 85 }
      ]
    },
    {
      category: "Backend & Python Ecosystem",
      icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 17l6-6-6-6"/><path d="M12 19h8"/></svg>`,
      items: [
        { name: "Python 3.11 & AsyncIO", level: 95 },
        { name: "Django & Django REST Framework", level: 92 },
        { name: "Node.js & Express API", level: 88 },
        { name: "python-telegram-bot & Webhooks", level: 96 }
      ]
    },
    {
      category: "Databases & Cloud Architecture",
      icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>`,
      items: [
        { name: "PostgreSQL & SQLite Database", level: 90 },
        { name: "Docker & Container Deployments", level: 85 },
        { name: "Railway, Vercel & Cloudflare", level: 92 },
        { name: "Git, GitHub CI/CD & APIs", level: 90 }
      ]
    },
    {
      category: "Security & Systems",
      icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`,
      items: [
        { name: "JWT Authentication & Security", level: 92 },
        { name: "E-IMZO Digital Signature Auth", level: 86 },
        { name: "RESTful API Architecture", level: 94 },
        { name: "Webhooks & Event Schedulers", level: 90 }
      ]
    }
  ],

  experience: [
    {
      role: "Full-Stack Software Engineer",
      company: "Velmora E-Commerce",
      period: "2024 - Present",
      description: "Spearheaded development of a bilingual e-commerce platform with React Vite and Django REST Framework, integrating Telegram ordering bots and PostgreSQL database."
    },
    {
      role: "Frontend & Banking Portal Developer",
      company: "Banking & Enterprise Solutions",
      period: "2023 - 2024",
      description: "Developed employee attendance tracking portals and corporate HR dashboards featuring E-IMZO digital signature authorization and live statistical charts."
    },
    {
      role: "Python Telegram Bot Developer",
      company: "Independent Projects & Open Source",
      period: "2022 - Present",
      description: "Engineered scalable asynchronous Telegram bots for multiplayer gaming (Spyfall), automated birthday schedulers with APScheduler, and store management bots."
    }
  ]
};
