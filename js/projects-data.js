/**
 * Portfolio Data Configuration
 * Update this file to easily modify your profile, projects, skills, and experience!
 */

const portfolioData = {
  profile: {
    name: "Jaloliddin",
    title: "Full-Stack Software Engineer & Creative Developer",
    statusBadge: "Available for new projects & full-time roles",
    bio: "Passionate software engineer dedicated to building high-performance web applications, scalable distributed architectures, and visually captivating digital experiences.",
    location: "Global / Remote",
    email: "jaloliddin.dev@example.com",
    phone: "+1 (555) 789-0123",
    socialLinks: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
      telegram: "https://t.me"
    },
    stats: [
      { value: "28+", label: "Completed Projects" },
      { value: "4+", label: "Years Experience" },
      { value: "1.4k+", label: "Git Commits" },
      { value: "100%", label: "Client Satisfaction" }
    ]
  },

  categories: [
    { id: "all", label: "All Projects" },
    { id: "fullstack", label: "Full Stack" },
    { id: "frontend", label: "Frontend / UI" },
    { id: "mobile", label: "Mobile Apps" },
    { id: "devops", label: "Cloud & DevOps" },
    { id: "tools", label: "Developer Tools" }
  ],

  projects: [
    {
      id: "aether-ai",
      title: "Aether AI Analytics Hub",
      subtitle: "Enterprise telemetry & real-time predictive model observability platform",
      category: "fullstack",
      image: "assets/project-ai.jpg",
      metric: "⚡ 94.8% Accuracy • 12.6K req/min",
      tags: ["React", "TypeScript", "Node.js", "Python", "WebSockets", "Chart.js"],
      overview: "An enterprise-grade telemetry platform providing live observability into production AI inference pipelines, accuracy trends, latency distributions, and proactive anomaly warnings.",
      problem: "Monitoring complex distributed machine learning models in production often lacks live unified telemetry, resulting in undetected performance degradation and latency drift.",
      solution: "Engineered a low-latency streaming analytics suite utilizing WebSocket push streams, automated drift alerts, and high-density visualizers for data science teams.",
      features: [
        "Real-time bi-directional telemetry streaming via WebSockets",
        "Dynamic 3D inference topology mapping and data flow visualizer",
        "Automated drift detection with intelligent Slack/Discord webhook alerts",
        "Full audit logging, compliance tracking, and CSV/PDF report generation"
      ],
      demoUrl: "https://example.com/demo-aether",
      githubUrl: "https://github.com/example/aether-ai"
    },
    {
      id: "stride-luxe",
      title: "Stride Luxe 3D Showcase",
      subtitle: "Interactive WebGL 3D footwear customizer and luxury e-commerce engine",
      category: "frontend",
      image: "assets/project-ecommerce.jpg",
      metric: "★ 4.9 Rating • 45% Conversion Lift",
      tags: ["JavaScript", "Three.js", "WebGL", "CSS3 Glass", "Stripe API"],
      overview: "A visually breathtaking e-commerce boutique featuring 360-degree interactive 3D product manipulation, dynamic custom leather texturing, and frictionless cart checkout.",
      problem: "Traditional flat photos fail to convey tactile product luxury, resulting in high return rates and lower customer checkout confidence.",
      solution: "Created an optimized WebGL viewport rendering responsive 3D assets with real-time lighting adjustments and an intuitive customizer drawer.",
      features: [
        "Photorealistic 360-degree interactive 3D sneaker mesh inspection",
        "Custom leather and sole texture selector with instant colorway preview",
        "Glassmorphism slide-out shopping bag with instant subtotal recalculations",
        "Achieved 60 FPS animation performance on mobile and desktop viewports"
      ],
      demoUrl: "https://example.com/demo-stride",
      githubUrl: "https://github.com/example/stride-luxe"
    },
    {
      id: "cryptobank-hub",
      title: "CryptoBank & FinTech Hub",
      subtitle: "Digital asset management & unified fiat/crypto financial command center",
      category: "fullstack",
      image: "assets/project-fintech.jpg",
      metric: "🔒 $84K+ Net Worth Tracked • Bank-Grade Security",
      tags: ["React", "Next.js", "Web3.js", "PostgreSQL", "TailwindCSS", "ApexCharts"],
      overview: "A comprehensive wealth management application bridging traditional bank integrations with decentralized multi-chain crypto wallet portfolios.",
      problem: "Investors must juggle disparate banking apps and Web3 wallets to obtain a complete view of their net worth, spending habits, and asset allocations.",
      solution: "Consolidated bank APIs and blockchain RPC nodes into an encrypted single-pane dashboard featuring automated categorization and real-time market valuations.",
      features: [
        "Automated traditional bank syncing and real-time blockchain balance pulls",
        "Categorized monthly expense breakdown with predictive cashflow insights",
        "Biometric 2FA authentication, AES-256 encrypted session storage",
        "One-click atomic token exchange with lowest-gas route calculations"
      ],
      demoUrl: "https://example.com/demo-cryptobank",
      githubUrl: "https://github.com/example/cryptobank"
    },
    {
      id: "nexus-cloud-mesh",
      title: "Nexus Cloud DevOps Mesh",
      subtitle: "Kubernetes topology visualizer & zero-downtime CI/CD canary orchestrator",
      category: "devops",
      image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='450' viewBox='0 0 800 450'><rect width='100%' height='100%' fill='%230f172a'/><circle cx='400' cy='225' r='120' fill='none' stroke='%236366f1' stroke-width='2' stroke-dasharray='6,6'/><circle cx='400' cy='225' r='180' fill='none' stroke='%2306b6d4' stroke-width='1.5' opacity='0.4'/><circle cx='400' cy='225' r='36' fill='%236366f1' opacity='0.8'/><circle cx='280' cy='150' r='24' fill='%2306b6d4'/><circle cx='520' cy='150' r='24' fill='%2310b981'/><circle cx='280' cy='300' r='24' fill='%23a855f7'/><circle cx='520' cy='300' r='24' fill='%23f59e0b'/><line x1='400' y1='225' x2='280' y2='150' stroke='%236366f1' stroke-width='2'/><line x1='400' y1='225' x2='520' y2='150' stroke='%2310b981' stroke-width='2'/><line x1='400' y1='225' x2='280' y2='300' stroke='%23a855f7' stroke-width='2'/><line x1='400' y1='225' x2='520' y2='300' stroke='%23f59e0b' stroke-width='2'/><text x='400' y='410' fill='%2394a3b8' font-family='sans-serif' font-size='18' text-anchor='middle' font-weight='bold'>NEXUS KUBERNETES TOPOLOGY</text></svg>",
      metric: "🚀 99.99% Uptime • Automated Canaries",
      tags: ["Go", "Kubernetes", "Docker", "Prometheus", "GraphQL", "Helm"],
      overview: "A developer-first cluster health tool that renders distributed microservice dependencies, container memory allocations, and automated canary deployments.",
      problem: "Debugging microservice cascades across hundreds of pods during deployment rollouts requires navigating multiple disparate logs and CLI tools.",
      solution: "Built a graphical topology inspector mapping real-time inter-pod traffic, error rates, and automated circuit breakers.",
      features: [
        "Live node dependency graph displaying error rates and packet latency",
        "Automated canary deployments with automatic rollbacks upon threshold breaches",
        "Prometheus metric ingestion with sub-second cluster query rendering",
        "Role-based access control (RBAC) and team namespace isolation"
      ],
      demoUrl: "https://example.com/demo-nexus",
      githubUrl: "https://github.com/example/nexus-mesh"
    },
    {
      id: "hyperfast-cli",
      title: "HyperFast Asset Compiler",
      subtitle: "High-performance Rust-powered web asset minifier & tree-shaker",
      category: "tools",
      image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='450' viewBox='0 0 800 450'><rect width='100%' height='100%' fill='%23111827'/><rect x='80' y='60' width='640' height='330' rx='16' fill='%231f2937' stroke='%23374151' stroke-width='2'/><circle cx='115' cy='95' r='6' fill='%23ef4444'/><circle cx='135' cy='95' r='6' fill='%23f59e0b'/><circle cx='155' cy='95' r='6' fill='%2310b981'/><text x='115' y='160' fill='%2322d3ee' font-family='monospace' font-size='16'>$ hyperfast build --prod --parallel</text><text x='115' y='200' fill='%2310b981' font-family='monospace' font-size='16'>✔ Parsed 4,280 modules in 42ms</text><text x='115' y='240' fill='%2310b981' font-family='monospace' font-size='16'>✔ Tree-shaking eliminated 64.2% unused code</text><text x='115' y='280' fill='%2310b981' font-family='monospace' font-size='16'>✔ Compressed assets to brotli (98.4 KB total)</text><text x='115' y='325' fill='%23f8fafc' font-family='monospace' font-size='18' font-weight='bold'>⚡ Build finished in 184ms [12x faster]</text></svg>",
      metric: "⚡ 12x Faster than Webpack • 85k+ Downloads",
      tags: ["Rust", "WebAssembly", "Node.js", "CLI", "V8 Engine"],
      overview: "An open-source developer toolchain engineered to bundle, minify, and transpile modern TypeScript and CSS codebases using multi-core Rust concurrency.",
      problem: "Sluggish JavaScript build tools slow down developer feedback loops on expansive repositories containing thousands of modules.",
      solution: "Engineered parallelized Rust compilation pipelines that operate directly on memory buffers with zero unnecessary disk I/O.",
      features: [
        "Near-instantaneous incremental rebuilds in under 20 milliseconds",
        "Native WebAssembly and C-ABI bindings for seamless Node integration",
        "Automated modern image conversion pipeline (WebP & AVIF)",
        "Zero-configuration intelligent entrypoint detection"
      ],
      demoUrl: "https://example.com/demo-hyperfast",
      githubUrl: "https://github.com/example/hyperfast-cli"
    },
    {
      id: "zenith-health",
      title: "Zenith Mobile Health Tracker",
      subtitle: "Biometric activity monitor & AI wellness recommendation application",
      category: "mobile",
      image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='450' viewBox='0 0 800 450'><rect width='100%' height='100%' fill='%230b0f19'/><rect x='280' y='40' width='240' height='370' rx='28' fill='%231a2234' stroke='%2338bdf8' stroke-width='2'/><circle cx='400' cy='150' r='55' fill='none' stroke='%23ec4899' stroke-width='10' stroke-dasharray='260,70'/><circle cx='400' cy='150' r='40' fill='none' stroke='%2310b981' stroke-width='8' stroke-dasharray='180,60'/><text x='400' y='157' fill='%23ffffff' font-family='sans-serif' font-size='18' text-anchor='middle' font-weight='bold'>8,420</text><text x='400' y='175' fill='%2394a3b8' font-family='sans-serif' font-size='10' text-anchor='middle'>STEPS</text><rect x='305' y='235' width='190' height='45' rx='10' fill='%2322304d'/><text x='325' y='262' fill='%23f8fafc' font-family='sans-serif' font-size='13' font-weight='bold'>Sleep Score: 92%</text><rect x='305' y='295' width='190' height='45' rx='10' fill='%2322304d'/><text x='325' y='322' fill='%23f8fafc' font-family='sans-serif' font-size='13' font-weight='bold'>Heart Rate: 64 bpm</text></svg>",
      metric: "📱 50K+ Active Users • HealthKit Sync",
      tags: ["React Native", "TypeScript", "Expo", "HealthKit", "SQLite"],
      overview: "A sleek cross-platform wellness application that synchronizes with smartwatch sensors to deliver actionable recovery guidance and nutrition advice.",
      problem: "Complex biometric telemetry often overwhelms users without translating health data into daily actionable improvements.",
      solution: "Synthesized heart rate variability, sleep stages, and activity scores into an intuitive visual recovery ring with contextual AI tips.",
      features: [
        "Real-time Apple HealthKit and Google Fit sensor synchronization",
        "Adaptive sleep score calculation with circadian rhythm mapping",
        "Social challenge boards, streak tracking, and achievement badges",
        "Offline-first architecture with localized SQLite persistence"
      ],
      demoUrl: "https://example.com/demo-zenith",
      githubUrl: "https://github.com/example/zenith-health"
    }
  ],

  skills: [
    {
      category: "Frontend Engineering",
      icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,
      items: [
        { name: "JavaScript (ES6+) & TypeScript", level: 95 },
        { name: "React, Next.js & Vue", level: 92 },
        { name: "Modern CSS3, SCSS & Responsive Grid", level: 95 },
        { name: "Three.js, WebGL & Canvas Graphics", level: 80 }
      ]
    },
    {
      category: "Backend & Systems",
      icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 17l6-6-6-6"/><path d="M12 19h8"/></svg>`,
      items: [
        { name: "Node.js & Express / NestJS", level: 90 },
        { name: "Python, FastAPI & AsyncIO", level: 88 },
        { name: "RESTful APIs & GraphQL", level: 92 },
        { name: "Microservices & WebSockets", level: 85 }
      ]
    },
    {
      category: "Cloud, DevOps & Data",
      icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>`,
      items: [
        { name: "Docker, Kubernetes & Containerization", level: 84 },
        { name: "PostgreSQL, MongoDB & Redis", level: 88 },
        { name: "AWS & Cloudflare Edge Deployments", level: 82 },
        { name: "CI/CD Pipelines (GitHub Actions)", level: 86 }
      ]
    },
    {
      category: "UI/UX & Architecture",
      icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`,
      items: [
        { name: "Design Systems & Component Architecture", level: 94 },
        { name: "Performance Optimization & SEO Auditing", level: 92 },
        { name: "Web Accessibility (WCAG 2.1)", level: 88 },
        { name: "Figma UI Prototyping", level: 85 }
      ]
    }
  ],

  experience: [
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
  ]
};
