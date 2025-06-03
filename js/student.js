// student.js

// Sidebar navigation toggle
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');
const menuLinks = document.querySelectorAll('.menu-link');
const sections = document.querySelectorAll('.section');

menuToggle.addEventListener('click', () => {
  sidebar.classList.toggle('active');
});

menuLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const target = link.getAttribute('href');
    sections.forEach(section => {
      section.classList.remove('active');
    });
    const targetSection = document.querySelector(target);
    if (targetSection) {
      targetSection.classList.add('active');
    }

    // Load content dynamically based on ID
    switch (target) {
      case '#profile': loadProfileSection(); break;
      case '#academy': loadAcademySection(); break;
      case '#ai-zone': loadAiZoneSection(); break;
      case '#planner': loadPlannerSection(); break;
      case '#projects': loadProjectsSection(); break;
      case '#competitions': loadCompetitionsSection(); break;
      case '#chat': loadChatSection(); break;
      case '#extras': loadExtrasSection(); break;
    }
  });
});

// Section loaders
function loadProfileSection() {
  const el = document.getElementById('profile');
  el.innerHTML = `
    <h2 style="color: #00DDEB">👤 My Profile</h2>
    <p><strong>Name:</strong> Elijah Wanga</p>
    <p><strong>Email:</strong> elijah@example.com</p>
    <p><strong>Phone:</strong> +2547XXXXXXX</p>
    <p><strong>Level:</strong> High School</p>
    <button>Edit Profile</button>
  `;
}

function loadAcademySection() {
  const el = document.getElementById('academy');
  el.innerHTML = `
    <h2 style="color: #FFAA00">📚 Academy Zone</h2>
    <p>Assignments, quizzes and learning materials will be here.</p>
  `;
}

function loadAiZoneSection() {
  const el = document.getElementById('ai-zone');
  el.innerHTML = `
    <h2 style="color: #FF007A">🤖 Ask AI (Elijah, Wanga, Emma)</h2>
    <p>This feature will connect to Gemini API or ChatGPT. For now, it's under construction.</p>
    <input placeholder="Ask anything..." disabled />
    <p style="color: #ccc">⚠️ This feature is currently locked. Upgrade to access AI tools.</p>
  `;
}

function loadPlannerSection() {
  const el = document.getElementById('planner');
  el.innerHTML = `
    <h2 style="color: #00FF88">🗓️ My Planner</h2>
    <p>Organize your tasks and study goals.</p>
    <p>🛠 Google Calendar API will be integrated here later.</p>
  `;
}

function loadProjectsSection() {
  const el = document.getElementById('projects');
  el.innerHTML = `
    <h2 style="color: #00A1FF">🧪 My Projects</h2>
    <p>Submit your ideas, track progress and collaborate.</p>
    <button>Create Project</button>
  `;
}

function loadCompetitionsSection() {
  const el = document.getElementById('competitions');
  el.innerHTML = `
    <h2 style="color: #FFC300">🏆 Competitions</h2>
    <p>Earn points, badges, and get ranked.</p>
  `;
}

function loadChatSection() {
  const el = document.getElementById('chat');
  el.innerHTML = `
    <h2 style="color: #FF44AA">💬 Chatroom</h2>
    <p>Chat with friends, ask for help, or join study groups.</p>
  `;
}

function loadExtrasSection() {
  const el = document.getElementById('extras');
  el.innerHTML = `
    <h2 style="color: #BB00FF">✨ Extras</h2>
    <p>Fun study, trivia, and surprise features here!</p>
  `;
}

// Logout button
const logoutBtn = document.getElementById('logout');
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    if (confirm("Are you sure you want to logout?")) {
      window.location.href = '../login.html';
    }
  });
}

// Update user display name (demo)
document.getElementById('studentName').textContent = 'Elijah';
