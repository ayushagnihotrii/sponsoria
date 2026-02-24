/* ===== SPONSORIA — SHARED JS MODULE ===== */

/* ---------- LOCAL STORAGE STATE ---------- */
const AppState = {
  get(key) { try { return JSON.parse(localStorage.getItem('sponsoria_' + key)); } catch { return null; } },
  set(key, val) { localStorage.setItem('sponsoria_' + key, JSON.stringify(val)); },
  remove(key) { localStorage.removeItem('sponsoria_' + key); },
  push(key, item) { const arr = this.get(key) || []; arr.push(item); this.set(key, arr); return arr; },
  update(key, id, updates) {
    const arr = this.get(key) || [];
    const idx = arr.findIndex(i => i.id === id);
    if (idx > -1) { arr[idx] = { ...arr[idx], ...updates }; this.set(key, arr); }
    return arr;
  }
};

/* ---------- SESSION ---------- */
const Session = {
  login(user) { AppState.set('session', user); },
  logout() { AppState.remove('session'); window.location.href = '/auth/login.html'; },
  get() { return AppState.get('session'); },
  isLoggedIn() { return !!this.get(); },
  role() { return this.get()?.role || null; },
  require(role) {
    if (!this.isLoggedIn()) { window.location.href = '/auth/login.html'; return false; }
    if (role && this.role() !== role) { window.location.href = '/'; return false; }
    return true;
  }
};

/* ---------- ID GENERATOR ---------- */
function genId() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }

/* ---------- NOTIFICATIONS ---------- */
const Notifications = {
  add(userId, msg, type = 'info') {
    AppState.push('notifications', { id: genId(), userId, message: msg, type, read: false, time: new Date().toISOString() });
  },
  getForUser(userId) { return (AppState.get('notifications') || []).filter(n => n.userId === userId).reverse(); },
  unreadCount(userId) { return this.getForUser(userId).filter(n => !n.read).length; },
  markRead(id) { AppState.update('notifications', id, { read: true }); }
};

/* ---------- TOAST ---------- */
function showToast(msg, type = 'success') {
  const t = document.createElement('div');
  t.className = 'toast toast-' + type;
  t.innerHTML = `<i class="fa-solid ${type === 'success' ? 'fa-circle-check' : type === 'error' ? 'fa-circle-xmark' : 'fa-circle-info'}"></i><span>${msg}</span>`;
  document.body.appendChild(t);
  requestAnimationFrame(() => t.classList.add('show'));
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 300); }, 3000);
}

/* ---------- SEED DEMO DATA ---------- */
function seedDemoData() {
  if (AppState.get('seeded')) return;

  // Demo institutions
  const institutions = [
    { id: 'inst1', role: 'institution', email: 'tech@iitpune.ac.in', password: 'demo', collegeName: 'IIT Pune', city: 'Pune', state: 'Maharashtra', tier: 'Tier 1', studentStrength: 8000, contactPerson: 'Prof. Sharma', verified: true, socialMedia: { instagram: '#', linkedin: '#', twitter: '#' }, pastEvents: ['TechFest 2024', 'Hackathon 2024'] },
    { id: 'inst2', role: 'institution', email: 'events@vit.ac.in', password: 'demo', collegeName: 'VIT Chennai', city: 'Chennai', state: 'Tamil Nadu', tier: 'Tier 1', studentStrength: 12000, contactPerson: 'Dr. Rajan', verified: true, socialMedia: { instagram: '#' }, pastEvents: ['Riviera 2024'] },
    { id: 'inst3', role: 'institution', email: 'fests@du.ac.in', password: 'demo', collegeName: 'Delhi University', city: 'Delhi', state: 'Delhi NCR', tier: 'Tier 1', studentStrength: 15000, contactPerson: 'Prof. Gupta', verified: false, socialMedia: {}, pastEvents: [] },
  ];

  // Demo sponsors
  const sponsors = [
    { id: 'spon1', role: 'sponsor', email: 'marketing@pepsi.com', password: 'demo', companyName: 'Pepsi India', industry: 'FMCG / Beverages', budgetRange: '₹5L – ₹20L', contactPerson: 'Rahul M.', logo: '', pastSponsored: ['TechFest 2024 — Title Sponsor'], targetIndustries: ['Tech', 'Cultural', 'Sports'] },
    { id: 'spon2', role: 'sponsor', email: 'campus@samsung.com', password: 'demo', companyName: 'Samsung India', industry: 'Technology', budgetRange: '₹2L – ₹10L', contactPerson: 'Priya K.', logo: '', pastSponsored: ['Hackathon X — Tech Partner'], targetIndustries: ['Tech', 'Hackathon'] },
    { id: 'spon3', role: 'sponsor', email: 'brand@redbull.com', password: 'demo', companyName: 'Red Bull India', industry: 'FMCG / Energy', budgetRange: '₹1L – ₹8L', contactPerson: 'Vikram S.', logo: '', pastSponsored: ['Rhythm Night — Beverage Partner'], targetIndustries: ['Cultural', 'DJ Night', 'Sports'] },
  ];

  // Demo events
  const events = [
    { id: 'evt1', institutionId: 'inst1', eventName: 'TechFest 2025', type: 'Tech Fest', date: '2026-03-15', venue: 'IIT Pune Main Ground', footfall: 5000, targetAudience: 'Engineering Students, Tech Enthusiasts', description: "India's Biggest College Tech Festival featuring robotics, coding challenges, and tech talks.", tiers: [
      { name: 'Title Sponsor', price: '₹10,00,000', perks: ['Main stage branding', 'Logo on all materials', 'Stall space (20x20)', 'Social media promotion', 'Press coverage'] },
      { name: 'Gold Sponsor', price: '₹5,00,000', perks: ['Stage branding', 'Logo on banners', 'Stall space (10x10)', 'Social media mention'] },
      { name: 'Silver Sponsor', price: '₹2,00,000', perks: ['Logo on banners', 'Stall space (5x5)', 'Social media mention'] },
    ], status: 'published', views: 142, saves: 28, interests: 5, city: 'Pune', collegeTier: 'Tier 1', budgetRange: '₹2L – ₹10L', createdAt: '2026-02-01' },
    { id: 'evt2', institutionId: 'inst2', eventName: 'Rhythm DJ Night', type: 'DJ Night', date: '2026-02-28', venue: 'VIT Open Air Theatre', footfall: 3000, targetAudience: 'College Students, Music Lovers', description: 'Biggest Campus Music Event with top DJs and live performances.', tiers: [
      { name: 'Title Sponsor', price: '₹3,00,000', perks: ['Stage branding', 'Product placement', 'VIP passes (50)', 'Full social media campaign'] },
      { name: 'Beverage Partner', price: '₹1,50,000', perks: ['Exclusive beverage stall', 'Brand sampling', 'Logo on cups'] },
    ], status: 'published', views: 89, saves: 15, interests: 3, city: 'Chennai', collegeTier: 'Tier 1', budgetRange: '₹50K – ₹3L', createdAt: '2026-02-05' },
    { id: 'evt3', institutionId: 'inst3', eventName: 'Culturals Utsav', type: 'Cultural Fest', date: '2026-04-05', venue: 'DU Convention Centre', footfall: 8000, targetAudience: 'Students, Artists, Performers', description: "DU's Premier Annual Cultural Festival with dance, drama, and art.", tiers: [
      { name: 'Title Sponsor', price: '₹8,00,000', perks: ['Main stage branding', 'Logo everywhere', 'Stall (30x30)', 'Celeb meet access'] },
      { name: 'Co-Sponsor', price: '₹4,00,000', perks: ['Secondary branding', 'Stall (15x15)', 'Social promo'] },
      { name: 'Associate Sponsor', price: '₹1,00,000', perks: ['Logo on standees', 'Stall (5x5)'] },
    ], status: 'published', views: 210, saves: 42, interests: 8, city: 'Delhi', collegeTier: 'Tier 1', budgetRange: '₹1L – ₹8L', createdAt: '2026-01-20' },
    { id: 'evt4', institutionId: 'inst1', eventName: 'Hackathon X', type: 'Hackathon', date: '2026-03-22', venue: 'BITS Hyderabad Campus', footfall: 1200, targetAudience: 'Developers, CS Students', description: '48hr Code Sprint for Innovation with prizes worth ₹5L.', tiers: [
      { name: 'Tech Partner', price: '₹5,00,000', perks: ['API integration', 'Judging panel seat', 'Full branding', 'Hiring access'] },
      { name: 'Track Sponsor', price: '₹2,00,000', perks: ['Own problem statement track', 'Logo on materials', 'Mentoring access'] },
    ], status: 'published', views: 67, saves: 12, interests: 2, city: 'Hyderabad', collegeTier: 'Tier 1', budgetRange: '₹1L – ₹5L', createdAt: '2026-02-10' },
    { id: 'evt5', institutionId: 'inst2', eventName: 'Annual Sports Meet', type: 'Sports', date: '2026-03-10', venue: 'Symbiosis Sports Complex', footfall: 4000, targetAudience: 'Athletes, Sports Enthusiasts', description: 'Inter-College Championship across 12 sports.', tiers: [
      { name: 'Title Sponsor', price: '₹4,00,000', perks: ['Jersey branding', 'Ground branding', 'Trophy presentation rights'] },
      { name: 'Kit Partner', price: '₹1,50,000', perks: ['Branded kits for participants', 'Stall space'] },
    ], status: 'published', views: 55, saves: 8, interests: 1, city: 'Pune', collegeTier: 'Tier 1', budgetRange: '₹75K – ₹4L', createdAt: '2026-02-08' },
  ];

  // Demo messages
  const messages = [
    { id: 'msg1', fromId: 'spon1', toId: 'inst1', fromName: 'Pepsi India', toName: 'IIT Pune', text: 'Hi! We are interested in being the Title Sponsor for TechFest 2025. Can we discuss the package?', time: '2026-02-20T10:30:00', read: true },
    { id: 'msg2', fromId: 'inst1', toId: 'spon1', fromName: 'IIT Pune', toName: 'Pepsi India', text: 'Hello Pepsi team! We\'d be thrilled to have you on board! The Title Sponsor package includes main stage branding, logo on all materials, and a 20x20 stall. Shall we schedule a call?', time: '2026-02-20T11:15:00', read: true },
    { id: 'msg3', fromId: 'spon2', toId: 'inst1', fromName: 'Samsung India', toName: 'IIT Pune', text: 'We would like to explore the Gold Sponsor tier for TechFest 2025. Could you share more details on the tech expo stall?', time: '2026-02-21T09:00:00', read: false },
  ];

  // Demo bookmarks
  const bookmarks = [
    { id: 'bm1', sponsorId: 'spon1', eventId: 'evt1', savedAt: '2026-02-18' },
    { id: 'bm2', sponsorId: 'spon1', eventId: 'evt3', savedAt: '2026-02-19' },
    { id: 'bm3', sponsorId: 'spon2', eventId: 'evt4', savedAt: '2026-02-20' },
  ];

  // Demo interests
  const interests = [
    { id: 'int1', sponsorId: 'spon1', eventId: 'evt1', sponsorName: 'Pepsi India', eventName: 'TechFest 2025', status: 'in-talks', expressedAt: '2026-02-20' },
    { id: 'int2', sponsorId: 'spon2', eventId: 'evt4', sponsorName: 'Samsung India', eventName: 'Hackathon X', status: 'expressed', expressedAt: '2026-02-21' },
    { id: 'int3', sponsorId: 'spon3', eventId: 'evt2', sponsorName: 'Red Bull India', eventName: 'Rhythm DJ Night', status: 'closed', expressedAt: '2026-02-15', dealAmount: '₹1.5L' },
  ];

  // Demo notifications
  const notifications = [
    { id: 'n1', userId: 'inst1', message: '3 sponsors viewed your TechFest 2025 listing today', type: 'info', read: false, time: '2026-02-23T18:00:00' },
    { id: 'n2', userId: 'inst1', message: 'Pepsi India expressed interest in TechFest 2025!', type: 'success', read: false, time: '2026-02-20T10:30:00' },
    { id: 'n3', userId: 'spon1', message: 'New event matching your preference: Culturals Utsav at Delhi University', type: 'info', read: false, time: '2026-02-22T09:00:00' },
    { id: 'n4', userId: 'spon2', message: 'IIT Pune responded to your interest in Hackathon X', type: 'success', read: true, time: '2026-02-21T14:00:00' },
  ];

  // Post-event reports
  const reports = [
    { id: 'rpt1', eventId: 'evt2', eventName: 'Rhythm DJ Night', institutionId: 'inst2', attendance: 2800, socialReach: '45,000 impressions', photos: [], pressCoverage: 'Featured in campus newspaper', impactSummary: 'Massive turnout with 2800+ attendees. Sponsors received great visibility with branded stages and sampling booths.', submittedAt: '2026-03-02' },
  ];

  AppState.set('institutions', institutions);
  AppState.set('sponsors', sponsors);
  AppState.set('events', events);
  AppState.set('messages', messages);
  AppState.set('bookmarks', bookmarks);
  AppState.set('interests', interests);
  AppState.set('notifications', notifications);
  AppState.set('reports', reports);
  AppState.set('seeded', true);
}

seedDemoData();

/* ---------- SIDEBAR COMPONENT ---------- */
function renderSidebar(activeItem = 'home') {
  const session = Session.get();
  const role = session?.role;
  const isInst = role === 'institution';
  const isSpon = role === 'sponsor';
  const userName = session ? (isInst ? session.collegeName : session.companyName) : '';
  const initials = userName ? userName.charAt(0) : 'G';

  const instNav = `
    <a href="/institution/dashboard.html" class="nav-item ${activeItem==='dashboard'?'active':''}"><i class="fa-solid fa-chart-pie"></i><span>Dashboard</span></a>
    <a href="/institution/profile.html" class="nav-item ${activeItem==='profile'?'active':''}"><i class="fa-solid fa-school"></i><span>My Profile</span></a>
    <a href="/institution/create-event.html" class="nav-item ${activeItem==='create-event'?'active':''}"><i class="fa-solid fa-plus-circle"></i><span>Create Event</span></a>
    <a href="/sponsor/messages.html" class="nav-item ${activeItem==='messages'?'active':''}"><i class="fa-solid fa-message"></i><span>Messages</span></a>
    <a href="/institution/post-event-report.html" class="nav-item ${activeItem==='report'?'active':''}"><i class="fa-solid fa-file-lines"></i><span>Post-Event Report</span></a>
  `;
  const sponNav = `
    <a href="/sponsor/dashboard.html" class="nav-item ${activeItem==='dashboard'?'active':''}"><i class="fa-solid fa-chart-pie"></i><span>Dashboard</span></a>
    <a href="/sponsor/profile.html" class="nav-item ${activeItem==='profile'?'active':''}"><i class="fa-solid fa-building"></i><span>My Profile</span></a>
    <a href="/sponsor/discover.html" class="nav-item ${activeItem==='discover'?'active':''}"><i class="fa-solid fa-compass"></i><span>Discover Events</span></a>
    <a href="/sponsor/messages.html" class="nav-item ${activeItem==='messages'?'active':''}"><i class="fa-solid fa-message"></i><span>Messages</span></a>
  `;
  const guestNav = `
    <a href="/" class="nav-item ${activeItem==='home'?'active':''}"><i class="fa-solid fa-house"></i><span>Home</span></a>
    <a href="/auth/login.html" class="nav-item ${activeItem==='login'?'active':''}"><i class="fa-solid fa-right-to-bracket"></i><span>Login</span></a>
    <a href="/auth/register.html" class="nav-item ${activeItem==='register'?'active':''}"><i class="fa-solid fa-user-plus"></i><span>Register</span></a>
  `;

  return `
  <aside class="sidebar" id="sidebar">
    <div class="sidebar-header">
      <a href="/" class="sidebar-logo">
        <div class="logo-mark"><i class="fa-solid fa-bolt"></i></div>
        <span class="logo-text">Sponsoria</span>
      </a>
    </div>
    <nav class="sidebar-nav">
      <a href="/" class="nav-item ${activeItem==='home'?'active':''}"><i class="fa-solid fa-house"></i><span>Home</span></a>
      ${session ? (isInst ? instNav : sponNav) : guestNav}
      <div class="nav-section-label">Other</div>
      <a href="/" class="nav-item"><i class="fa-solid fa-gear"></i><span>Settings</span></a>
      ${session ? `<a href="#" class="nav-item" id="logoutBtn"><i class="fa-solid fa-right-from-bracket"></i><span>Logout</span></a>` : ''}
    </nav>
    <div class="sidebar-bottom">
      ${session ? `<div class="nav-item" style="cursor:default;"><div class="avatar-btn" style="width:28px;height:28px;font-size:0.7rem;">${initials}</div><span style="font-size:0.8rem;font-weight:600;">${userName}</span></div>` : ''}
    </div>
  </aside>
  <div class="sidebar-overlay" id="sidebarOverlay"></div>`;
}

/* ---------- TOPBAR COMPONENT ---------- */
function renderTopbar(searchPlaceholder = 'Search Events & Sponsors') {
  const session = Session.get();
  const notifCount = session ? Notifications.unreadCount(session.id) : 0;
  const initials = session ? (session.role === 'institution' ? session.collegeName?.charAt(0) : session.companyName?.charAt(0)) : 'G';
  return `
  <header class="topbar">
    <button class="topbar-toggle" id="menuToggle"><i class="fa-solid fa-bars"></i></button>
    <div class="search-bar"><i class="fa-solid fa-magnifying-glass"></i><input type="text" placeholder="${searchPlaceholder}" /></div>
    <div class="topbar-right">
      <button class="topbar-btn" title="Notifications" onclick="window.location.href=Session.isLoggedIn()?(Session.role()==='institution'?'/institution/dashboard.html':'/sponsor/dashboard.html'):'/'">
        <i class="fa-regular fa-bell"></i>${notifCount > 0 ? '<span class="notif-dot"></span>' : ''}
      </button>
      ${session ? `<button class="avatar-btn" title="Profile" onclick="window.location.href=Session.role()==='institution'?'/institution/profile.html':'/sponsor/profile.html'">${initials}</button>` : `<a href="/auth/login.html" class="for-business-btn"><i class="fa-solid fa-right-to-bracket"></i><span>Login</span></a>`}
    </div>
  </header>`;
}

/* ---------- INIT SIDEBAR EVENTS ---------- */
function initSidebarEvents() {
  const sidebar = document.getElementById('sidebar');
  const toggle = document.getElementById('menuToggle');
  const overlay = document.getElementById('sidebarOverlay');
  if (toggle) toggle.addEventListener('click', () => { sidebar?.classList.toggle('mobile-open'); overlay?.classList.toggle('active'); });
  if (overlay) overlay.addEventListener('click', () => { sidebar?.classList.remove('mobile-open'); overlay?.classList.remove('active'); });
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) logoutBtn.addEventListener('click', (e) => { e.preventDefault(); Session.logout(); });
}

/* ---------- SCROLL REVEAL ---------- */
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => obs.observe(el));
}

/* ---------- FORMAT HELPERS ---------- */
function formatDate(d) { return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }); }
function timeAgo(d) {
  const s = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return Math.floor(s/60) + 'm ago';
  if (s < 86400) return Math.floor(s/3600) + 'h ago';
  return Math.floor(s/86400) + 'd ago';
}
