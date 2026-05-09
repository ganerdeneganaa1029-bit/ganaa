/* ============================================
   Admin Panel Script — Complete
   ============================================ */

'use strict';

// ===== DEFAULTS =====
const DEFAULT_SOCIAL = [
    { platform: 'Instagram', url: 'https://www.instagram.com/gna_4ev?igsh=MWZmNjNibjNvcWdydQ%3D%3D&utm_source=qr', icon: '📸' },
    { platform: 'Facebook', url: 'https://www.facebook.com/share/1B95qbaU9K/?mibextid=wwXIfr', icon: '👤' },
];

const DEFAULT_SKILLS = [
    { name: 'HTML5 / CSS3', level: 92 },
    { name: 'JavaScript (ES6+)', level: 85 },
    { name: 'React.js', level: 80 },
    { name: 'Node.js', level: 72 },
    { name: 'Bootstrap / Tailwind', level: 88 },
    { name: 'Git / GitHub', level: 82 },
    { name: 'MySQL / MongoDB', level: 68 },
    { name: 'Figma / UI Design', level: 75 },
];

const DEFAULT_PROJECTS = [
    {
        title: 'Portfolio CMS систем',
        desc: 'Динамик portfolio вэбсайт. Admin хэсэгтэй, localStorage ашигласан контент удирдлага, бүрэн responsive дизайн.',
        tech: 'HTML, CSS, JavaScript',
        image: '',
        github: '#',
        demo: '#',
    },
    {
        title: 'Task Manager App',
        desc: 'Хэрэглэгчдэд зориулсан даалгавар хянах систем. Drag & drop, шошго, хугацааны хяналт зэрэг боломжуудтай.',
        tech: 'React, Redux, Firebase',
        image: '',
        github: '#',
        demo: '#',
    },
];

// Seed default data if localStorage is empty or version mismatch
function seedDefaults() {
    const DATA_VERSION = '2';
    const stored = localStorage.getItem('dataVersion');
    if (stored !== DATA_VERSION) {
        localStorage.removeItem('adminProjects');
        localStorage.removeItem('adminSkills');
        localStorage.removeItem('adminSocial');
        localStorage.setItem('dataVersion', DATA_VERSION);
    }
    if (!localStorage.getItem('adminSocial')) {
        setStore('adminSocial', DEFAULT_SOCIAL);
    }
    if (!localStorage.getItem('adminSkills')) {
        setStore('adminSkills', DEFAULT_SKILLS);
    }
    if (!localStorage.getItem('adminProjects')) {
        setStore('adminProjects', DEFAULT_PROJECTS);
    }
}

// ===== LOGIN =====
// Default credentials — admin can change password via Settings (future)
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'admin1234'; // Change this to your preferred password
const SESSION_KEY = 'adminSession';

function checkLogin() {
    const overlay = document.getElementById('loginOverlay');
    if (!overlay) return;

    // Check existing session (expires after 8 hours)
    const session = getStore(SESSION_KEY, null);
    if (session && session.expires > Date.now()) {
        overlay.style.display = 'none';
        return;
    }
    overlay.style.display = 'flex';
}

function doLogin() {
    const username = document.getElementById('loginUsername')?.value.trim();
    const password = document.getElementById('loginPassword')?.value;
    const errEl = document.getElementById('loginError');

    if (username === ADMIN_USER && password === ADMIN_PASS) {
        // Save session for 8 hours
        setStore(SESSION_KEY, { expires: Date.now() + 8 * 60 * 60 * 1000 });
        const overlay = document.getElementById('loginOverlay');
        if (overlay) {
            overlay.style.transition = 'opacity 0.4s';
            overlay.style.opacity = '0';
            setTimeout(() => overlay.style.display = 'none', 400);
        }
        showNotification('✓ Амжилттай нэвтэрлээ!');
    } else {
        if (errEl) {
            errEl.style.display = 'block';
            errEl.textContent = !username || !password
                ? 'Нэвтрэх нэр болон нууц үгийг бөглөнө үү'
                : 'Нэвтрэх нэр эсвэл нууц үг буруу байна';
        }
        // Shake animation
        const pwdInput = document.getElementById('loginPassword');
        if (pwdInput) {
            pwdInput.style.borderColor = '#e53935';
            pwdInput.style.animation = 'shake 0.4s ease';
            setTimeout(() => {
                pwdInput.style.animation = '';
                pwdInput.style.borderColor = 'var(--border)';
            }, 400);
        }
    }
}

function togglePwd() {
    const el = document.getElementById('loginPassword');
    if (el) el.type = el.type === 'password' ? 'text' : 'password';
}

function doLogout() {
    localStorage.removeItem(SESSION_KEY);
    location.reload();
}


function escHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function getStore(key, fallback = null) {
    try {
        const val = localStorage.getItem(key);
        return val ? JSON.parse(val) : fallback;
    } catch { return fallback; }
}

function setStore(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); return true; }
    catch { return false; }
}

function showNotification(msg, type = 'success') {
    const el = document.getElementById('notification');
    if (!el) return;
    el.innerHTML = `<div class="alert alert-${type}">${msg}</div>`;
    clearTimeout(el._timer);
    el._timer = setTimeout(() => el.innerHTML = '', 4000);
}

function emptyState(msg = 'Жагсаалт хоосон байна') {
    return `<div class="empty-state">${msg}</div>`;
}

// ===== PAGE NAVIGATION =====
function switchPage(name) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.sidebar-nav a').forEach(a => a.classList.remove('active'));

    const page = document.getElementById(name);
    if (page) page.classList.add('active');

    const link = document.querySelector(`.sidebar-nav a[data-page="${name}"]`);
    if (link) link.classList.add('active');

    const titles = {
        dashboard: 'Dashboard',
        profile: 'Профайл',
        education: 'Боловсрол',
        skills: 'Ур чадвар',
        projects: 'Төслүүд',
        social: 'Сошиал линкүүд',
        messages: 'Мессежүүд',
    };
    const titleEl = document.getElementById('topbarTitle');
    if (titleEl) titleEl.textContent = titles[name] || 'Admin';

    // Load data
    const loaders = {
        dashboard: loadDashboard,
        profile: loadProfile,
        education: loadEducationList,
        skills: loadSkillsList,
        projects: loadProjectsList,
        social: loadSocialList,
        messages: loadMessagesList,
    };
    if (loaders[name]) loaders[name]();
}

// ===== DASHBOARD =====
function loadDashboard() {
    const messages = getStore('contactMessages', []);
    const skills = getStore('adminSkills', []);
    const projects = getStore('adminProjects', []);
    const education = getStore('adminEducation', []);

    setText('statMessages', messages.length);
    setText('statSkills', skills.length);
    setText('statProjects', projects.length);
    setText('statEducation', education.length);

    // Message badge
    const badge = document.getElementById('msgBadge');
    if (badge) {
        badge.textContent = messages.length;
        badge.style.display = messages.length > 0 ? 'inline' : 'none';
    }

    const container = document.getElementById('dashMessages');
    if (!container) return;

    const recent = messages.slice(-5).reverse();
    if (recent.length === 0) {
        container.innerHTML = emptyState('Мессеж ирээгүй байна');
        return;
    }
    container.innerHTML = recent.map(m => `
        <div class="item-card">
            <strong>${escHtml(m.subject)}</strong>
            <small> · ${escHtml(m.name)} · ${escHtml(m.email)}</small>
            <p style="margin-top:4px;">${escHtml((m.message || '').substring(0, 80))}...</p>
            <small style="color:var(--text-dim);">${escHtml(m.timestamp)}</small>
        </div>
    `).join('');
}

function setText(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
}

// ===== PROFILE =====
function loadProfile() {
    const p = getStore('adminProfile', {});
    const fields = {
        profileName: p.name || 'Монхбаяр',
        profileShortBio: p.shortBio || 'Full Stack Developer',
        profileBio: p.bio || '',
        profileEmail: p.email || 'munkbayar@example.mn',
        profilePhone: p.phone || '+976 9900 1122',
        profileLocation: p.location || 'Улаанбаатар, Монгол',
        profileYears: p.years ?? 2,
        profileProjectsCount: p.projects ?? 8,
        profileTechCount: p.tech ?? 10,
    };
    Object.entries(fields).forEach(([id, val]) => {
        const el = document.getElementById(id);
        if (el) el.value = val;
    });

    const preview = document.getElementById('profileImgPreview');
    if (preview && p.image) {
        preview.innerHTML = `<img src="${p.image}" alt="Profile">`;
    }
}

document.getElementById('profileForm')?.addEventListener('submit', function (e) {
    e.preventDefault();
    const existing = getStore('adminProfile', {});
    const profile = {
        ...existing,
        name: val('profileName'),
        shortBio: val('profileShortBio'),
        bio: val('profileBio'),
        email: val('profileEmail'),
        phone: val('profilePhone'),
        location: val('profileLocation'),
        years: parseInt(val('profileYears')) || 2,
        projects: parseInt(val('profileProjectsCount')) || 8,
        tech: parseInt(val('profileTechCount')) || 10,
    };
    setStore('adminProfile', profile);
    showNotification('✓ Профайл хадгалагдлаа!');
});

function uploadProfileImage() {
    const file = document.getElementById('profileImageFile')?.files[0];
    if (!file) { showNotification('Зураг сонгоно уу', 'danger'); return; }
    if (file.size > 5 * 1024 * 1024) { showNotification('Зурагний хэмжээ 5MB-ээс хэтрэхгүй байх ёстой', 'danger'); return; }

    const reader = new FileReader();
    reader.onload = function (e) {
        const profile = getStore('adminProfile', {});
        profile.image = e.target.result;
        setStore('adminProfile', profile);

        const preview = document.getElementById('profileImgPreview');
        if (preview) preview.innerHTML = `<img src="${e.target.result}" alt="Profile">`;
        showNotification('✓ Зураг хадгалагдлаа!');
    };
    reader.readAsDataURL(file);
}

// ===== EDUCATION =====
document.getElementById('educationForm')?.addEventListener('submit', function (e) {
    e.preventDefault();
    const name = val('eduDegree');
    if (!name) { showNotification('Нэр оруулна уу', 'danger'); return; }

    const list = getStore('adminEducation', []);
    list.push({
        year: val('eduYear'),
        degree: name,
        school: val('eduSchool'),
        desc: val('eduDesc'),
        tags: val('eduTags'),
        icon: val('eduIcon') || '🎓',
    });
    setStore('adminEducation', list);
    this.reset();
    document.getElementById('eduIcon').value = '🎓';
    loadEducationList();
    showNotification('✓ Боловсрол нэмэгдлээ!');
});

function loadEducationList() {
    const container = document.getElementById('educationList');
    if (!container) return;
    const list = getStore('adminEducation', []);

    if (list.length === 0) {
        container.innerHTML = emptyState('Боловсрол нэмээгүй байна');
        return;
    }
    container.innerHTML = list.map((edu, i) => `
        <div class="item-card">
            <div style="display:flex;justify-content:space-between;align-items:start;">
                <div>
                    <strong>${escHtml(edu.icon)} ${escHtml(edu.degree)}</strong><br>
                    <small style="color:var(--gold);">${escHtml(edu.school)}</small><br>
                    <small>${escHtml(edu.year)}</small>
                </div>
                <div class="actions">
                    <button class="btn btn-sm btn-warning" onclick="editEducation(${i})">✎</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteEducation(${i})">🗑</button>
                </div>
            </div>
        </div>
    `).join('');
}

function deleteEducation(i) {
    if (!confirm('Устгахдаа итгэлтэй байна уу?')) return;
    const list = getStore('adminEducation', []);
    list.splice(i, 1);
    setStore('adminEducation', list);
    loadEducationList();
    showNotification('✓ Устгагдлаа!');
}

function editEducation(i) {
    const list = getStore('adminEducation', []);
    const edu = list[i];
    setVal('eduYear', edu.year);
    setVal('eduDegree', edu.degree);
    setVal('eduSchool', edu.school);
    setVal('eduDesc', edu.desc);
    setVal('eduTags', edu.tags);
    setVal('eduIcon', edu.icon);
    list.splice(i, 1);
    setStore('adminEducation', list);
    loadEducationList();
}

// ===== SKILLS =====
document.getElementById('skillLevel')?.addEventListener('input', function () {
    setText('skillLevelDisplay', this.value);
});

document.getElementById('skillForm')?.addEventListener('submit', function (e) {
    e.preventDefault();
    const name = val('skillName');
    if (!name) { showNotification('Нэр оруулна уу', 'danger'); return; }

    const skills = getStore('adminSkills', []);
    skills.push({ name, level: parseInt(val('skillLevel')) || 75 });
    setStore('adminSkills', skills);
    this.reset();
    document.getElementById('skillLevel').value = 75;
    setText('skillLevelDisplay', 75);
    loadSkillsList();
    showNotification('✓ Ур чадвар нэмэгдлээ!');
});

function loadSkillsList() {
    const container = document.getElementById('skillsList');
    if (!container) return;
    const skills = getStore('adminSkills', []);

    if (skills.length === 0) {
        container.innerHTML = emptyState('Ур чадвар нэмээгүй байна');
        return;
    }
    container.innerHTML = skills.map((s, i) => `
        <div class="item-card">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                <strong>${escHtml(s.name)}</strong>
                <div class="actions">
                    <button class="btn btn-sm btn-warning" onclick="editSkill(${i})">✎</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteSkill(${i})">🗑</button>
                </div>
            </div>
            <div class="progress">
                <div class="progress-bar" style="width:${s.level}%"></div>
            </div>
            <small style="color:var(--gold);">${s.level}%</small>
        </div>
    `).join('');
}

function resetSkillsToDefaults() {
    if (!confirm('Default ур чадваруудыг сэргээхүү? Одоогийн жагсаалт устана.')) return;
    setStore('adminSkills', DEFAULT_SKILLS);
    loadSkillsList();
    showNotification('✓ Default ур чадваруудыг сэргэгдлээ!');
}

function deleteSkill(i) {
    if (!confirm('Устгахдаа итгэлтэй байна уу?')) return;
    const skills = getStore('adminSkills', []);
    skills.splice(i, 1);
    setStore('adminSkills', skills);
    loadSkillsList();
    showNotification('✓ Устгагдлаа!');
}

function editSkill(i) {
    const skills = getStore('adminSkills', []);
    const s = skills[i];
    setVal('skillName', s.name);
    setVal('skillLevel', s.level);
    setText('skillLevelDisplay', s.level);
    skills.splice(i, 1);
    setStore('adminSkills', skills);
    loadSkillsList();
}

// ===== PROJECTS =====
document.getElementById('projectForm')?.addEventListener('submit', function (e) {
    e.preventDefault();
    const title = val('projectTitle');
    if (!title) { showNotification('Нэр оруулна уу', 'danger'); return; }

    const projects = getStore('adminProjects', []);
    projects.push({
        title,
        desc: val('projectDesc'),
        tech: val('projectTech'),
        image: val('projectImage'),
        github: val('projectGithub'),
        demo: val('projectDemo'),
    });
    setStore('adminProjects', projects);
    this.reset();
    loadProjectsList();
    showNotification('✓ Төсөл нэмэгдлээ!');
});

function loadProjectsList() {
    const container = document.getElementById('projectsList');
    if (!container) return;
    const projects = getStore('adminProjects', []);

    if (projects.length === 0) {
        container.innerHTML = emptyState('Төсөл нэмээгүй байна');
        return;
    }
    container.innerHTML = projects.map((p, i) => `
        <div class="item-card">
            <div style="display:flex;justify-content:space-between;align-items:start;">
                <div>
                    <strong>${escHtml(p.title)}</strong><br>
                    <small>${escHtml((p.desc || '').substring(0, 60))}...</small><br>
                    <small style="color:var(--gold);">${escHtml(p.tech)}</small>
                </div>
                <div class="actions">
                    <button class="btn btn-sm btn-warning" onclick="editProject(${i})">✎</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteProject(${i})">🗑</button>
                </div>
            </div>
        </div>
    `).join('');
}

function resetProjectsToDefaults() {
    if (!confirm('Default төслүүдийг сэргээхүү? Одоогийн жагсаалт устана.')) return;
    setStore('adminProjects', DEFAULT_PROJECTS);
    loadProjectsList();
    showNotification('✓ Default төслүүд сэргэгдлээ!');
}

function deleteProject(i) {
    if (!confirm('Устгахдаа итгэлтэй байна уу?')) return;
    const projects = getStore('adminProjects', []);
    projects.splice(i, 1);
    setStore('adminProjects', projects);
    loadProjectsList();
    showNotification('✓ Устгагдлаа!');
}

function editProject(i) {
    const projects = getStore('adminProjects', []);
    const p = projects[i];
    setVal('projectTitle', p.title);
    setVal('projectDesc', p.desc);
    setVal('projectTech', p.tech);
    setVal('projectImage', p.image);
    setVal('projectGithub', p.github);
    setVal('projectDemo', p.demo);
    projects.splice(i, 1);
    setStore('adminProjects', projects);
    loadProjectsList();
}

// ===== SOCIAL =====
document.getElementById('socialForm')?.addEventListener('submit', function (e) {
    e.preventDefault();
    const platform = val('socialPlatform');
    const url = val('socialUrl');
    if (!platform) { showNotification('Платформ оруулна уу', 'danger'); return; }

    // Validate URL — must start with http:// or https://
    if (url && !url.match(/^https?:\/\/.+/)) {
        showNotification('URL нь https:// -ээр эхэлсэн байх ёстой', 'danger');
        return;
    }

    const social = getStore('adminSocial', []);
    social.push({ platform, url: url || '#', icon: val('socialIcon') || '🔗' });
    setStore('adminSocial', social);
    this.reset();
    loadSocialList();
    showNotification('✓ Сошиал нэмэгдлээ!');
});

function resetSocialToDefaults() {
    if (!confirm('Default сошиал линкүүдийг сэргээхүү? Одоогийн жагсаалт устана.')) return;
    setStore('adminSocial', DEFAULT_SOCIAL);
    loadSocialList();
    showNotification('✓ Default сошиал линкүүд сэргэгдлээ!');
}

function loadSocialList() {
    const container = document.getElementById('socialList');
    if (!container) return;
    const social = getStore('adminSocial', []);

    if (social.length === 0) {
        container.innerHTML = emptyState('Сошиал нэмээгүй байна');
        return;
    }
    container.innerHTML = social.map((s, i) => `
        <div class="item-card">
            <div style="display:flex;justify-content:space-between;align-items:center;">
                <div>
                    <strong>${escHtml(s.icon)} ${escHtml(s.platform)}</strong><br>
                    <small><a href="${escHtml(s.url)}" target="_blank" rel="noopener" style="color:var(--gold);">${escHtml(s.url)}</a></small>
                </div>
                <button class="btn btn-sm btn-danger" onclick="deleteSocial(${i})">🗑</button>
            </div>
        </div>
    `).join('');
}

function deleteSocial(i) {
    if (!confirm('Устгахдаа итгэлтэй байна уу?')) return;
    const social = getStore('adminSocial', []);
    social.splice(i, 1);
    setStore('adminSocial', social);
    loadSocialList();
    showNotification('✓ Устгагдлаа!');
}

// ===== MESSAGES =====
function loadMessagesList() {
    const container = document.getElementById('messagesList');
    if (!container) return;
    const messages = getStore('contactMessages', []);

    if (messages.length === 0) {
        container.innerHTML = emptyState('Мессеж ирээгүй байна');
        return;
    }
    container.innerHTML = messages.map((m, i) => `
        <div class="item-card">
            <div style="display:flex;justify-content:space-between;align-items:start;">
                <div style="flex:1;">
                    <strong>${escHtml(m.subject)}</strong><br>
                    <small><b>Нэр:</b> ${escHtml(m.name)}</small>
                    <small> · <b>Имэйл:</b> <a href="mailto:${escHtml(m.email)}" style="color:var(--gold);">${escHtml(m.email)}</a></small><br>
                    <small style="color:var(--text-dim);">${escHtml(m.timestamp)}</small>
                    <p style="margin-top:8px;font-size:0.85rem;color:var(--text-muted);">${escHtml(m.message)}</p>
                </div>
                <button class="btn btn-sm btn-danger" onclick="deleteMessage(${i})" style="margin-left:10px;">🗑</button>
            </div>
        </div>
    `).join('');
}

function deleteMessage(i) {
    if (!confirm('Устгахдаа итгэлтэй байна уу?')) return;
    const messages = getStore('contactMessages', []);
    messages.splice(i, 1);
    setStore('contactMessages', messages);
    loadMessagesList();
    loadDashboard();
    showNotification('✓ Мессеж устгагдлаа!');
}

function deleteAllMessages() {
    if (!confirm('Бүх мессежийг устгахдаа итгэлтэй байна уу?')) return;
    setStore('contactMessages', []);
    loadMessagesList();
    loadDashboard();
    showNotification('✓ Бүх мессеж устгагдлаа!');
}

// ===== UTILS =====
function val(id) {
    const el = document.getElementById(id);
    return el ? el.value.trim() : '';
}
function setVal(id, v) {
    const el = document.getElementById(id);
    if (el) el.value = v ?? '';
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    checkLogin();
    seedDefaults();
    loadDashboard();
});