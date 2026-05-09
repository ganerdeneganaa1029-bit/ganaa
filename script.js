/* ============================================
   Portfolio Script — Full Featured
   ============================================ */

'use strict';

// ========== DATA VERSION ==========
// Bump this number whenever DEFAULT_DATA changes — forces localStorage reset on all visitors
const DATA_VERSION = '2';

function migrateData() {
    const stored = localStorage.getItem('dataVersion');
    if (stored !== DATA_VERSION) {
        // Clear only app data, keep adminSession
        ['adminProjects', 'adminSkills', 'adminSocial'].forEach(k => localStorage.removeItem(k));
        localStorage.setItem('dataVersion', DATA_VERSION);
    }
}

// ========== CONFIG ==========
const DEFAULT_DATA = {
    profile: {
        name: 'Ган Эрдэнэ',
        shortBio: 'Full Stack Developer',
        bio: 'Full Stack Developer — веб технологийг ашиглан өндөр чанарын, ашиглахад хялбар шийдлүүд бүтээдэг. Техникийн нарийн бүтэц болон нүдний дизайн хосолсон бүтээлч хөгжүүлэгч.',
        email: 'ganerdeneganaa1029@gmail.com',
        phone: '+976 8558 1847',
        location: 'Улаанбаатар, Монгол',
        years: 2,
        projects: 2,
        tech: 10,
        image: '',
    },
    skills: [
        { name: 'HTML5 / CSS3', level: 92 },
        { name: 'JavaScript (ES6+)', level: 85 },
        { name: 'React.js', level: 80 },
        { name: 'Node.js', level: 72 },
        { name: 'Bootstrap / Tailwind', level: 88 },
        { name: 'Git / GitHub', level: 82 },
        { name: 'MySQL / MongoDB', level: 68 },
        { name: 'Figma / UI Design', level: 75 },
    ],
    projects: [
        {
            title: 'Portfolio CMS систем',
            desc: 'Динамик portfolio вэбсайт. Admin хэсэгтэй, localStorage ашигласан контент удирдлага, бүрэн responsive дизайн.',
            tech: 'HTML, CSS, JavaScript',
            image: 'https://via.placeholder.com/600x300/111/c9a84c?text=Portfolio+CMS',
            github: '#',
            demo: '#',
        },
        {
            title: 'Task Manager App',
            desc: 'Хэрэглэгчдэд зориулсан даалгавар хянах систем. Drag & drop, шошго, хугацааны хяналт зэрэг боломжуудтай.',
            tech: 'React, Redux, Firebase',
            image: 'https://via.placeholder.com/600x300/111/c9a84c?text=Task+Manager',
            github: '#',
            demo: '#',
        },
    ],
    social: [
        { platform: 'Instagram', url: 'https://www.instagram.com/gna_4ev?igsh=MWZmNjNibjNvcWdydQ%3D%3D&utm_source=qr', icon: '📸' },
        { platform: 'Facebook', url: 'https://www.facebook.com/share/1B95qbaU9K/?mibextid=wwXIfr', icon: '👤' },
    ],
};

const TYPED_STRINGS = [
    'Full Stack Developer',
    'UI/UX Enthusiast',
    'JavaScript хөгжүүлэгч',
    'React Developer',
    'Бүтээлч программист',
];

// ========== LOADER ==========
function initLoader() {
    const loader = document.getElementById('loader');
    const progress = document.getElementById('loaderProgress');
    const loadText = document.getElementById('loaderText');
    if (!loader) return;

    let pct = 0;
    const messages = ['Ачааллаж байна...', 'Мэдээлэл татаж байна...', 'Бэлэн болж байна...', 'Тавтай морил!'];
    let msgIdx = 0;

    const interval = setInterval(() => {
        pct += Math.random() * 18 + 5;
        if (pct >= 100) pct = 100;
        progress.style.width = pct + '%';

        const mi = Math.floor((pct / 100) * messages.length);
        if (mi !== msgIdx && mi < messages.length) {
            msgIdx = mi;
            loadText.textContent = messages[msgIdx];
        }

        if (pct >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                loader.classList.add('done');
                document.body.style.overflow = '';
                startAnimations();
            }, 300);
        }
    }, 80);

    document.body.style.overflow = 'hidden';
}

// ========== CURSOR ==========
function initCursor() {
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursorFollower');
    if (!cursor || !follower) return;

    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
    });

    function animateFollower() {
        followerX += (mouseX - followerX) * 0.12;
        followerY += (mouseY - followerY) * 0.12;
        follower.style.left = followerX + 'px';
        follower.style.top = followerY + 'px';
        requestAnimationFrame(animateFollower);
    }
    animateFollower();

    document.querySelectorAll('a, button, .skill-card, .project-card, .edu-card').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(2)';
            follower.style.transform = 'translate(-50%, -50%) scale(1.5)';
            follower.style.opacity = '0.3';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            follower.style.transform = 'translate(-50%, -50%) scale(1)';
            follower.style.opacity = '0.5';
        });
    });
}

// ========== NAVBAR ==========
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    window.addEventListener('scroll', () => {
        navbar?.classList.toggle('scrolled', window.scrollY > 50);
        updateActiveNav();
    });

    hamburger?.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks?.classList.toggle('open');
    });

    // Close menu on nav link click
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger?.classList.remove('active');
            navLinks?.classList.remove('open');
        });
    });
}

function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[data-section]');
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.scrollY >= sectionTop) current = section.id;
    });

    navLinks.forEach(link => {
        link.classList.toggle('active', link.dataset.section === current);
    });
}

// ========== TYPED TEXT ==========
let typedIdx = 0, charIdx = 0, isDeleting = false;

function runTyped() {
    const el = document.getElementById('typedText');
    if (!el) return;

    const current = TYPED_STRINGS[typedIdx];
    el.textContent = isDeleting ? current.substring(0, charIdx--) : current.substring(0, charIdx++);

    let delay = isDeleting ? 50 : 100;

    if (!isDeleting && charIdx > current.length) {
        isDeleting = true;
        delay = 2000;
    } else if (isDeleting && charIdx < 0) {
        isDeleting = false;
        typedIdx = (typedIdx + 1) % TYPED_STRINGS.length;
        delay = 400;
    }

    setTimeout(runTyped, delay);
}

// ========== COUNTER ANIMATION ==========
function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count') || el.textContent) || 0;
    const duration = 1500;
    const start = performance.now();

    function update(time) {
        const elapsed = time - start;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(ease * target);
        if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
}

// ========== SCROLL REVEAL ==========
function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-delay') || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                    // Animate counters
                    entry.target.querySelectorAll('[data-count]').forEach(animateCounter);
                    // Animate skill bars
                    entry.target.querySelectorAll('.skill-fill').forEach(bar => {
                        bar.style.width = bar.getAttribute('data-width') + '%';
                    });
                }, parseInt(delay));
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .edu-card, .skill-card, .project-card').forEach(el => {
        observer.observe(el);
    });
}

// ========== LOAD DATA FROM STORAGE ==========
function getProfile() {
    const saved = localStorage.getItem('adminProfile');
    return saved ? { ...DEFAULT_DATA.profile, ...JSON.parse(saved) } : DEFAULT_DATA.profile;
}
function getSkills() {
    const saved = localStorage.getItem('adminSkills');
    return saved ? JSON.parse(saved) : DEFAULT_DATA.skills;
}
function getProjects() {
    const saved = localStorage.getItem('adminProjects');
    return saved ? JSON.parse(saved) : DEFAULT_DATA.projects;
}
function getSocial() {
    const saved = localStorage.getItem('adminSocial');
    return saved ? JSON.parse(saved) : DEFAULT_DATA.social;
}

// ========== APPLY PROFILE ==========
function applyProfile() {
    const p = getProfile();

    const setEl = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.textContent = val;
    };
    const setInput = (id, val) => {
        const el = document.getElementById(id);
        if (el && el.tagName === 'INPUT') el.value = val;
    };

    setEl('heroName', p.name);
    setEl('heroBio', p.bio);
    setEl('aboutBioText', p.bio);
    setEl('contactEmail', p.email);
    setEl('contactPhone', p.phone);
    setEl('contactLocation', p.location);
    setEl('footerEmail', p.email);
    setEl('footerPhone', p.phone);
    setEl('footerLocation', p.location);

    // Links
    ['contactEmail', 'footerEmail'].forEach(id => {
        const el = document.getElementById(id);
        if (el && el.tagName === 'A') el.href = 'mailto:' + p.email;
    });

    // Stats
    const setStatNum = (id, count) => {
        const el = document.getElementById(id);
        if (el) { el.setAttribute('data-count', count); el.textContent = '0'; }
    };
    setStatNum('heroYears', p.years);
    setStatNum('heroProjects', p.projects);
    setStatNum('heroTech', p.tech);

    const setAbout = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.textContent = val + '+';
    };
    setAbout('aboutYears', p.years);
    setAbout('aboutProjects', p.projects);
    setAbout('aboutTech', p.tech);

    // Profile image
    if (p.image) {
        const img = document.getElementById('heroProfileImg');
        if (img) img.src = p.image;
    }
}

// ========== RENDER SKILLS ==========
function renderSkills() {
    const container = document.getElementById('skillsContainer');
    if (!container) return;
    const skills = getSkills();

    container.innerHTML = skills.map((s, i) => `
        <div class="skill-card reveal-up" style="transition-delay:${i * 60}ms">
            <div class="skill-header">
                <span class="skill-name">${escHtml(s.name)}</span>
                <span class="skill-pct">${s.level}%</span>
            </div>
            <div class="skill-bar">
                <div class="skill-fill" data-width="${s.level}" style="width:0%"></div>
            </div>
        </div>
    `).join('');

    // Re-observe new elements
    setTimeout(initScrollReveal, 50);
}

// ========== RENDER PROJECTS ==========
function renderProjects() {
    const container = document.getElementById('projectsContainer');
    if (!container) return;
    const projects = getProjects();

    container.innerHTML = projects.map((p, i) => `
        <div class="project-card reveal-up" style="transition-delay:${i * 100}ms">
            <img class="project-img" src="${p.image || 'https://via.placeholder.com/600x300/111/c9a84c?text=' + encodeURIComponent(p.title)}" alt="${escHtml(p.title)}" loading="lazy">
            <div class="project-body">
                <h3 class="project-title">${escHtml(p.title)}</h3>
                <p class="project-desc">${escHtml(p.desc)}</p>
                <div class="project-tech">
                    ${p.tech.split(',').map(t => `<span>${escHtml(t.trim())}</span>`).join('')}
                </div>
                <div class="project-links">
                    ${p.github ? `<a href="${p.github}" target="_blank" rel="noopener" class="project-link">GitHub →</a>` : ''}
                    ${p.demo ? `<a href="${p.demo}" target="_blank" rel="noopener" class="project-link">Demo →</a>` : ''}
                </div>
            </div>
        </div>
    `).join('');

    setTimeout(initScrollReveal, 50);
}

// ========== RENDER SOCIAL ==========
function renderSocial() {
    const social = getSocial();
    const p = getProfile();

    // Hero social
    const heroSocial = document.getElementById('heroSocial');
    if (heroSocial) {
        heroSocial.innerHTML = social.map(s => `
            <a href="${s.url}" target="_blank" rel="noopener" class="social-link">
                ${escHtml(s.icon)} ${escHtml(s.platform)}
            </a>
        `).join('');
    }

    // Contact social
    const contactSocial = document.getElementById('contactSocialLinks');
    if (contactSocial) {
        contactSocial.innerHTML = social.map(s => `
            <a href="${s.url}" target="_blank" rel="noopener" class="cs-link">${escHtml(s.icon)} ${escHtml(s.platform)} →</a>
        `).join('');
    }

    // Footer social
    const footerSocial = document.getElementById('footerSocial');
    if (footerSocial) {
        footerSocial.innerHTML = social.map(s => `
            <a href="${s.url}" target="_blank" rel="noopener" class="footer-social-link">${escHtml(s.platform.substring(0, 2).toUpperCase())}</a>
        `).join('');
    }

    // Contact email/phone links
    const setHref = (id, href) => {
        const el = document.getElementById(id);
        if (el) el.href = href;
    };
    setHref('contactEmail', 'mailto:' + p.email);
    setHref('footerEmail', 'mailto:' + p.email);
}

// ========== CONTACT FORM ==========
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const fields = ['name', 'email', 'subject', 'message'];

    // Real-time validation
    fields.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.addEventListener('blur', () => validateField(id));
        el.addEventListener('input', () => {
            el.classList.remove('error');
            const errEl = document.getElementById(id + 'Error');
            if (errEl) errEl.textContent = '';
        });
    });

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        let valid = true;
        fields.forEach(id => { if (!validateField(id)) valid = false; });
        if (!valid) return;

        const btn = document.getElementById('submitBtn');
        const btnText = btn.querySelector('.btn-text');
        if (btnText) btnText.textContent = 'Илгээж байна...';
        btn.disabled = true;

        // Simulate sending
        setTimeout(() => {
            const data = {
                name: document.getElementById('name').value.trim(),
                email: document.getElementById('email').value.trim(),
                subject: document.getElementById('subject').value.trim(),
                message: document.getElementById('message').value.trim(),
                timestamp: new Date().toLocaleString('mn-MN'),
            };

            const messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
            messages.push(data);
            localStorage.setItem('contactMessages', JSON.stringify(messages));

            showFormMessage('success', '✓ Мессеж амжилттай илгээгдлээ! Тантай удахгүй холбогдоно.');
            form.reset();
            if (btnText) btnText.textContent = 'Илгээх';
            btn.disabled = false;
        }, 1200);
    });
}

function validateField(id) {
    const el = document.getElementById(id);
    const errEl = document.getElementById(id + 'Error');
    if (!el) return true;

    const val = el.value.trim();
    let msg = '';

    if (!val) {
        msg = 'Энэ талбарыг бөглөнө үү.';
    } else if (id === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        msg = 'Зөв имэйл хаяг оруулна уу.';
    } else if (id === 'name' && val.length < 2) {
        msg = 'Нэр хамгийн багадаа 2 тэмдэгт байх ёстой.';
    } else if (id === 'message' && val.length < 10) {
        msg = 'Мессеж хамгийн багадаа 10 тэмдэгт байх ёстой.';
    }

    if (msg) {
        el.classList.add('error');
        if (errEl) errEl.textContent = msg;
        return false;
    }

    el.classList.remove('error');
    if (errEl) errEl.textContent = '';
    return true;
}

function showFormMessage(type, msg) {
    const el = document.getElementById('formMessage');
    if (!el) return;
    el.innerHTML = `<div class="form-message ${type}">${msg}</div>`;
    setTimeout(() => el.innerHTML = '', 5000);
}

// ========== SMOOTH SCROLL ==========
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                window.scrollTo({ top: target.offsetTop - 72, behavior: 'smooth' });
            }
        });
    });
}

// ========== ADMIN MODE ==========
function enableAdminMode() {
    window.location.href = 'admin.html';
}

function toggleAdminMode() {
    window.location.href = 'admin.html';
}

// ========== ESCAPE HTML ==========
function escHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

// ========== START ANIMATIONS ==========
function startAnimations() {
    runTyped();
    initScrollReveal();

    // Animate hero counters after short delay
    setTimeout(() => {
        document.querySelectorAll('.hero-stats [data-count]').forEach(animateCounter);
    }, 300);
}

// ========== INIT ==========
document.addEventListener('DOMContentLoaded', () => {
    migrateData(); // ← clear stale cache if data version changed
    initLoader();
    initCursor();
    initNavbar();
    initSmoothScroll();
    applyProfile();
    renderSkills();
    renderProjects();
    renderSocial();
    initContactForm();
});