// ============================================================================
// Portfolio content — the only file you should need to touch.
//
// Add a project: push an object onto FEATURED_PROJECTS or ARCHIVE_PROJECTS.
// Change a stat, a skill pill, an experience entry, or the bio: edit the
// matching array/object below. Nothing in css/ or js/ needs to change —
// every page reads from here at load time via <script type="module">.
//
// Image paths are relative to the site root (e.g. "assets/portrait.webp").
// ============================================================================

export const PERSON = {
  name: "Amir Mashallah Ali",
  monogram: "AMA",
  titles: ["Programmer", "Mobile Developer", "Cyber Security MSc"],
  bio: "I build web and mobile products for real communities, from a national platform for 45+ university societies to the app their members carry in their pocket. First-class BSc Computer Science and MSc Cyber Security, University of Hertfordshire.",
  location: "London, UK",
  portrait: "assets/portrait.webp",
  cv: "assets/cv.pdf",
};

// Contact details are deliberately NOT stored as plain strings — see
// js/features/encrypted-contact.js. These are only used by the terminal's
// `contact` command and the mailto: composer, both of which run in JS,
// never printed into page HTML.
export const CONTACT = {
  email: "amashallahali@gmail.com",
  phone: "+44 7464 068557",
};

export const SOCIALS = [
  { name: "LinkedIn", url: "https://www.linkedin.com/in/amir-m-ali-", icon: "linkedin" },
  { name: "GitHub", url: "https://github.com/am21adk", icon: "github" },
  { name: "Instagram", url: "https://instagram.com/amirrr.ma", handle: "@amirrr.ma", icon: "instagram" },
];

// Domains the live-status feature is allowed to ping (also mirrored in the
// _headers CSP connect-src — keep the two in sync if you add a project).
export const LIVE_STATUS_HOSTS = ["https://www.absoc.uk", "https://www.badrgrappling.co.uk"];

export const STATS = [
  { value: 2, prefix: "", suffix: "", label: "First-class degrees" },
  { value: 1, prefix: "", suffix: "st", label: "Place, Accessibility Hackathon — led a team of 8" },
  { value: 45, prefix: "", suffix: "+", label: "Societies overseen nationally" },
  { value: 200, prefix: "", suffix: "+", label: "Attendees at a national event I hosted" },
  { value: 5400, prefix: "£", suffix: "", label: "Raised for the Al-Ayn orphans charity" },
];

// ----------------------------------------------------------------------------
// Featured projects — the three coloured cards on Home and Projects.
// `color` must be one of "blue" | "yellow" | "pink" (see css/tokens.css).
// `stackConfirmedFrom` is just a note to future-you about provenance.
// ----------------------------------------------------------------------------
export const FEATURED_PROJECTS = [
  {
    id: "absoc-website",
    color: "blue",
    name: "ABSoc Website",
    type: "Website",
    stack: "Vanilla JS · Supabase · Stripe",
    status: "Live",
    liveUrl: "https://www.absoc.uk",
    statusCheckUrl: "https://www.absoc.uk/favicon.ico",
    summary: "The national site for the Muslim Student Council.",
    description:
      "The national site for the Muslim Student Council (MSC), the umbrella body for AhlulBayt Islamic Societies across 45+ UK universities. It runs member accounts, a national events calendar, a directory to find your campus ABSoc, and a shop, serving both the national committee and every local society underneath it.",
    highlights: [
      "Member accounts and a signed-in portal for 45+ societies",
      "A national events calendar alongside each society's own listings",
      "The Find Your ABSoc directory",
      "A shop with Stripe checkout",
    ],
    logo: "assets/projects/absoc-website/logo.webp",
    images: [
      { src: "assets/projects/absoc-website/logo.webp", alt: "The Muslim Student Council (MSC) mark", width: 256, height: 109 },
    ],
    cta: { label: "Visit site", url: "https://www.absoc.uk" },
  },
  {
    id: "badr-grappling",
    color: "yellow",
    name: "Badr Grappling",
    type: "Website",
    stack: "Vanilla JS · Supabase · Stripe",
    status: "Live",
    liveUrl: "https://www.badrgrappling.co.uk",
    statusCheckUrl: "https://www.badrgrappling.co.uk/favicon.ico",
    summary: "A London wrestling club, for adults and kids.",
    description:
      "The website and member portal for Badr Grappling, a wrestling club in London for adults and kids. It covers the club's branches and weekly timetable, membership and joining (a monthly card subscription through Stripe), and club news, on the same Supabase-backed stack as the ABSoc site.",
    highlights: [
      "Branches and a weekly class timetable",
      "Membership and joining, with a Stripe-billed monthly subscription",
      "Club news and a photo gallery",
    ],
    logo: "assets/projects/badr-grappling/logo.webp",
    images: [
      { src: "assets/projects/badr-grappling/screenshot-2.webp", alt: "The Badr Grappling squad with their club banner", width: 640, height: 480 },
      { src: "assets/projects/badr-grappling/screenshot-1.webp", alt: "The team training on the mats", width: 640, height: 446 },
    ],
    cta: { label: "Visit site", url: "https://www.badrgrappling.co.uk" },
  },
  {
    id: "absoc-app",
    color: "pink",
    name: "ABSoc App",
    type: "Mobile app",
    stack: "React Native · Expo · Supabase",
    status: "app",
    appStore: "https://apps.apple.com/gb/app/absoc/id6800276723",
    playStore: "https://play.google.com/store/apps/details?id=com.msc.absoc",
    adminAppStore: "https://apps.apple.com/gb/app/absoc-admin/id6801101214",
    summary: "The ABSoc member app, and its companion Admin app.",
    description:
      "The member app for the Muslim Student Council network: an event passport that stamps every event you attend, a national calendar spanning all 45+ societies, following and finding ABSocs, a member directory, and announcements — built on the same Supabase backend as the website. A companion ABSoc Admin app gives committees door check-in with instant stamp awards, one-tap event publishing, and society page management.",
    highlights: [
      "Event passport with a stamp for every event attended",
      "National calendar across 45+ societies, with following",
      "Member directory and society discovery",
      "Companion Admin app: door check-in, stamp awarding, event publishing",
    ],
    logo: "assets/projects/absoc-app/logo.webp",
    images: [
      { src: "assets/projects/absoc-app/screenshot-passport.webp", alt: "The ABSoc event passport, showing stamps and a member ID card", width: 640, height: 1387 },
      { src: "assets/projects/absoc-app/screenshot-calendar.webp", alt: "The shared national events calendar", width: 640, height: 1387 },
      { src: "assets/projects/absoc-app/screenshot-admin.webp", alt: "The ABSoc Admin check-in book", width: 640, height: 1387 },
    ],
    cta: { label: "App Store", url: "https://apps.apple.com/gb/app/absoc/id6800276723" },
  },
];

// ----------------------------------------------------------------------------
// Archive projects — the filterable "More projects" grid.
// `tags` drive the filter pills; keep them from the fixed set in
// ARCHIVE_FILTERS below so a new tag doesn't silently fail to filter.
// ----------------------------------------------------------------------------
export const ARCHIVE_FILTERS = ["All", "Security", "Mobile", "AI/ML", "Java", "Embedded & IoT", "Networking", "Data"];

export const ARCHIVE_PROJECTS = [
  {
    id: "khattam",
    name: "Khattam",
    tags: ["Mobile"],
    summary: "React Native + TypeScript iOS app for logging and tracking missed prayers.",
    description:
      "A React Native and TypeScript iOS app that helps users log and track missed prayers. An interactive calculation system gives real-time totals via Firebase, with customisable tracking that lets users deduct complete prayers and see the remaining total instantly. A visual dashboard displays progress through intuitive display boxes, built from reusable React and TypeScript components.",
  },
  {
    id: "msc-dissertation",
    name: "MSc dissertation",
    tags: ["Security", "AI/ML"],
    summary: "Python hybrid static and dynamic analysis pipeline for Android APKs.",
    description:
      "A Python-based hybrid static and dynamic analysis pipeline for Android applications, built end to end from conceptualisation through to a working tool. It runs APKs through MobSF and Frida for static and dynamic analysis, proposes mitigations aligned with the OWASP Mobile Top 10, and uses machine learning to classify detected issues by severity, producing JSON reports.",
  },
  {
    id: "final-year-project",
    name: "Final year project",
    tags: ["Mobile", "AI/ML"],
    summary: "AI-powered gym progress tracker in React Native.",
    description:
      "A gym progress tracking mobile app built in React Native, with secure user authentication and real-time data storage via Firestore. AI model integration and machine learning algorithms deliver personalised training insights from a user's logged progress.",
  },
  {
    id: "grey-box-pentest",
    name: "Grey-box penetration test",
    tags: ["Security"],
    summary: "Team engagement against a live server, with privilege escalation to root.",
    description:
      "A consultancy-style, team-based grey-box penetration test against a live server environment. Contributed to planning and managing the engagement lifecycle, and to vulnerability discovery, exploitation, and privilege escalation to root/admin level, confirming and documenting at least five unique high-impact attacks. Delivered a professional report with an executive risk assessment, technical attack detail, and mitigation strategies.",
  },
  {
    id: "cyber-defence-ir",
    name: "Cyber defence & incident response",
    tags: ["Security"],
    summary: "Wireshark PCAP analysis of a simulated attack on critical national infrastructure.",
    description:
      "Acted as a cybersecurity analyst in a simulated national defence scenario, conducting post-incident PCAP analysis with Wireshark of a suspected cyberattack on Critical National Infrastructure. Assessed impact using NIST/ISO 27001, then built a Bash-based defensive proof of concept on Kali Linux that automates mitigations such as IP blocking and suspicious traffic detection.",
  },
  {
    id: "digital-forensics",
    name: "Digital forensics investigation",
    tags: ["Security"],
    summary: "Hash-verified analysis of a suspect's disk image, with a formal evidential report.",
    description:
      "A full digital forensic investigation as part of a simulated customs and border enforcement case. Verified evidence integrity with cryptographic hash values before a structured forensic examination of a disk image, documenting every action through contemporaneous notes, and produced a formal investigative report suitable for legal and regulatory contexts.",
  },
  {
    id: "threat-modelling",
    name: "Threat modelling & attack trees",
    tags: ["Security"],
    summary: "Analysis of the 2025 threat landscape and an attack tree for a fictional organisation.",
    description:
      "An individual research project analysing the 2025 threat landscape, threat actors and emerging risks, culminating in a comprehensive attack tree for a fictional organisation. Modelled multiple attack paths against a realistic threat profile and delivered evidence-based recommendations mapped to each scenario.",
  },
  {
    id: "healthcare-security-policy",
    name: "Healthcare security policy",
    tags: ["Security"],
    summary: "Acting as CISO after a real ransomware case: risk assessment and records policy.",
    description:
      "An information security governance project based on a real ransomware attack on a UK healthcare provider, assuming the role of CISO. Performed an asset-based risk assessment and developed a Protection of Records Policy aligned with the ISO/IEC 27000 family, mapping controls against GDPR and NHS-related compliance obligations.",
  },
  {
    id: "secure-iot-lorawan",
    name: "Secure IoT network (LoRaWAN)",
    tags: ["Embedded & IoT", "Security"],
    summary: "Clean-room sensor node with safety-state classification and encrypted transmission.",
    description:
      "A secure IoT monitoring network for a semiconductor manufacturing clean room, using LoRaWAN for long-range sensor-to-gateway communication. Built a DHT22 temperature/humidity sensor node with multi-state LED safety alerts and XOR-encrypted wireless transmission, classifying operational states (safe, warning, danger, critical) in real time.",
  },
  {
    id: "vision-robot-control",
    name: "Vision-based robot control",
    tags: ["Embedded & IoT"],
    summary: "ISO C autonomous car that follows a target using camera colour detection.",
    description:
      "An autonomous embedded control system in ISO C for the Initio robotic car, following a target using camera-based colour detection and infrared sensors. Implemented multi-threaded real-time processing with mutexes to synchronise camera and motor control, plus worst-case complexity analysis and fault-tree testing of degraded modes.",
  },
  {
    id: "embedded-robotics",
    name: "Embedded robotics",
    tags: ["Embedded & IoT"],
    summary: "ISO C obstacle avoidance and line following, with PWM motor control.",
    description:
      "An embedded control application in ISO C for the Initio robotic car: obstacle avoidance from infrared sensor input, extended with a floor-sensor line-following algorithm, and pulse-width modulation to regulate motor speed against energy, friction and mechanical constraints.",
  },
  {
    id: "ai-safety-gridworlds",
    name: "AI Safety Gridworlds",
    tags: ["AI/ML"],
    summary: "Agent simulations of safe interruptibility, side effects and reward gaming.",
    description:
      "Agent-based simulations inspired by DeepMind's AI Safety Gridworlds research, modelling specification problems in reinforcement learning: safe interruptibility, avoiding side effects, and reward gaming. Implemented multiple agent strategies (random walk, reward-exploiting, goal-oriented) and compared behavioural outcomes across controlled simulations.",
  },
  {
    id: "blastonbury-database",
    name: "Blastonbury festival database",
    tags: ["Data", "Java"],
    summary: "Normalised Oracle schema with views, GRANTs and audit triggers, migrated to MySQL.",
    description:
      "A full relational database for a large-scale music festival's security clearance and performance scheduling. Produced a complete ER model and a fully normalised Oracle SQL schema with views, GRANT-based access control, and audit triggers, then migrated the entire dataset to MySQL — with a PHP front end and a Java (JDBC) application demonstrating end-to-end integration.",
  },
  {
    id: "war-in-netaverse",
    name: "War in Netaverse",
    tags: ["Java"],
    summary: "Java team strategy game with an OOP domain model and a battle engine.",
    description:
      "A Java-based strategy game simulating fleet management, resource allocation and battle resolution. Designed an object-oriented domain model across multiple force types with distinct costs, strengths and lifecycle states, a dynamic war-chest economy and battle resolution engine, built test-first with JUnit and shipped with both CLI and GUI front ends.",
  },
  {
    id: "competition-manager",
    name: "Competition manager",
    tags: ["Java"],
    summary: "From UML requirements to a Java MVC app with a hand-built GUI and CSV/JSON persistence.",
    description:
      "A competition management application designed from a UML use-case model and three-tier architecture through to a Java MVC implementation. Built an interactive GUI for real-time editing, sorting, filtering and score recalculation, with file-based persistence in CSV/JSON and modular reporting for rankings and statistics.",
  },
  {
    id: "enterprise-branch-network",
    name: "Enterprise branch network",
    tags: ["Networking"],
    summary: "Cisco Packet Tracer design with VLANs, subnetting, DHCP, routing and WAN links.",
    description:
      "A small enterprise branch network for a financial services organisation, designed and fully configured in Cisco Packet Tracer. Implemented end-to-end IPv4 connectivity between departmental LANs and an external ISP, with VLAN segmentation, DHCP, static addressing for critical infrastructure, routing, and secured WAN serial links, validated with ping, traceroute and interface diagnostics.",
  },
  {
    id: "spotify-bpm",
    name: "Spotify BPM analysis",
    tags: ["Data"],
    summary: "Group study in R of tempo versus popularity in the 2000s.",
    description:
      "A group research project in R analysing the relationship between beats per minute and song popularity on Spotify during the 2000s, producing visualisations to identify trends and correlations and delivering a structured report under strict deadline and word-count constraints.",
  },
];

// ----------------------------------------------------------------------------
// Experience, rendered as a git log on About. `branch: "main"` entries sit
// on the trunk; `branch: "who-is-hussain"` entries branch off it. Order is
// newest-first within each branch, matching how the feature draws commits.
// No dates, per Amir's request, except the Who Is Hussain? years.
// ----------------------------------------------------------------------------
export const EXPERIENCE = [
  {
    id: "vice-chair-msc",
    branch: "main",
    tag: "leadership",
    role: "Vice Chair",
    org: "Muslim Student Council",
    year: null,
    body: "Oversees 45+ university societies nationally, organises national summits, retreats, training days and conferences with 200+ sign-ups, and travels to universities to advise society leaders.",
  },
  {
    id: "vp-event-organiser",
    branch: "main",
    tag: "leadership",
    role: "Vice-President & Event Organiser",
    org: "university society",
    year: null,
    body: "Hosted a national football event with 200+ attendees from across the UK, raising £5,400 for the Al-Ayn orphans charity.",
  },
  {
    id: "wih-driver",
    branch: "who-is-hussain",
    tag: "volunteering",
    role: "Driver",
    org: "Who Is Hussain?, London",
    year: 2021,
    body: "Started as a driver for the weekly food drives.",
  },
  {
    id: "wih-coordinator",
    branch: "who-is-hussain",
    tag: "volunteering",
    role: "Coordinator & Organiser",
    org: "Who Is Hussain?, London",
    year: 2023,
    body: "Grew into coordinating and organising the weekly food drives in Acton and Charing Cross with rotating volunteer teams.",
  },
  {
    id: "wih-head-of-drivers",
    branch: "who-is-hussain",
    tag: "volunteering",
    role: "Head of Drivers",
    org: "Who Is Hussain?, London",
    year: 2025,
    body: "Responsible for the van's insurance and tax compliance, reporting directly to the London Lead.",
  },
  {
    id: "wih-deputy-head",
    branch: "who-is-hussain",
    tag: "volunteering",
    role: "Deputy Head of Drivers",
    org: "Who Is Hussain?, London",
    year: null,
    body: "Currently overseeing vehicle readiness, training new drivers, staffing the weekly food drives, and maintaining consistent communication across the team.",
  },
];

export const SKILLS = {
  build: [
    "JavaScript", "TypeScript", "React", "React Native", "Expo", "HTML5", "CSS3",
    "Python", "Java", "C", "SQL", "PostgreSQL", "MySQL", "Oracle", "PHP",
    "Supabase", "Firebase", "Stripe", "Cloudflare Pages", "Git", "JUnit",
    "React Testing Library", "R", "Machine Learning",
  ],
  secure: [
    "Penetration Testing", "Threat Modelling", "Digital Forensics", "Incident Response",
    "Wireshark", "Kali Linux", "Bash", "MobSF", "Frida", "OWASP Mobile Top 10",
    "ISO/IEC 27001", "NIST", "GDPR", "WCAG", "Cisco Packet Tracer",
    "VLANs & Subnetting", "LoRaWAN / IoT",
  ],
};

export const EDUCATION = [
  {
    id: "msc-cyber-security",
    qualification: "MSc Cyber Security",
    grade: "First Class",
    institution: "University of Hertfordshire",
    electives: ["Cyber Operations", "Responsible Technology", "Information Security and Compliance", "Penetration Testing"],
  },
  {
    id: "bsc-computer-science",
    qualification: "BSc Computer Science",
    grade: "First-Class Honours",
    institution: "University of Hertfordshire",
    electives: ["Software Engineering", "Artificial Intelligence", "Internet of Things", "Software Architecture"],
  },
];

export const CERTIFICATIONS = [
  { id: "google-cybersecurity", name: "Google Cybersecurity Certificate", issuer: "Coursera" },
];

// Used by the AboutMe.js editor (feature 2) — this is the literal object it
// renders, tokenises and syntax-highlights. Keep values short; long strings
// wrap awkwardly in the editor's fixed-width panel.
export const ABOUT_ME_CODE = {
  name: "Amir Mashallah Ali",
  role: "Programmer & Mobile Developer",
  based: "London, UK",
  education: ["MSc Cyber Security, First Class", "BSc Computer Science, First-Class Honours"],
  certifications: ["Google Cybersecurity Certificate"],
  languages: ["JavaScript", "TypeScript", "Python", "Java", "SQL"],
  currently: ["Vice Chair @ MSC", "Deputy Head of Drivers @ Who Is Hussain?"],
  linkedin: "linkedin.com/in/amir-m-ali-",
  instagram: "@amirrr.ma",
};
