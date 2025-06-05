// js/student.js

// Import Firebase utilities and dailyFacts
import { auth, db } from "./firebase.js";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  setDoc,
  serverTimestamp,
  onSnapshot,
  updateDoc
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";
import { dailyFacts } from "./facts.js";

////////////////////////////////////////////////////////////////////////////////
// 1. Sidebar Toggle (Mobile)
////////////////////////////////////////////////////////////////////////////////
const menuToggle = document.getElementById("menuToggle");
const sidebar = document.getElementById("sidebar");

menuToggle.addEventListener("click", () => {
  sidebar.classList.toggle("active");
});

////////////////////////////////////////////////////////////////////////////////
// 2. Routing Logic: Show/Hide Sections
////////////////////////////////////////////////////////////////////////////////
const links = document.querySelectorAll(".menu-link");
const sections = document.querySelectorAll(".section");

links.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const targetId = link.getAttribute("href");
    document.querySelector(".section.active")?.classList.remove("active");
    document.querySelector(targetId)?.classList.add("active");
    sidebar.classList.remove("active");
  });
});

// Default: show “#home”
document.querySelector("#home").classList.add("active");

////////////////////////////////////////////////////////////////////////////////
// 3. Firebase Auth State Handling
////////////////////////////////////////////////////////////////////////////////
auth.onAuthStateChanged(async (user) => {
  if (!user) {
    window.location.href = "../login.html";
    return;
  }
  try {
    const userDocRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userDocRef);
    if (!userSnap.exists()) return;
    const data = userSnap.data();

    document.getElementById("studentName").textContent = data.username || data.name || "Student";
    document.getElementById("coins").textContent = data.coins ?? 0;
    document.getElementById("refCode").textContent = data.referral || "—";
    document.getElementById("dailyQuote").textContent =
      data.dailyQuote || '"Keep learning. Keep growing."';

    buildProfileSection(data, user.uid);
  } catch (err) {
    console.error("Error fetching user data:", err);
  }
});

////////////////////////////////////////////////////////////////////////////////
// 4. Facts Rotation (Home)
////////////////////////////////////////////////////////////////////////////////
const factBox = document.getElementById("factBox");
let factIndex = 0;

function rotateFacts() {
  if (dailyFacts && dailyFacts.length > 0) {
    factBox.textContent = dailyFacts[factIndex];
    factIndex = (factIndex + 1) % dailyFacts.length;
  } else {
    factBox.textContent = "💡 No facts available right now.";
  }
}

window.addEventListener("DOMContentLoaded", () => {
  rotateFacts();
  setInterval(rotateFacts, 30000);
});

////////////////////////////////////////////////////////////////////////////////
// 5. Logout Button
////////////////////////////////////////////////////////////////////////////////
const logoutBtn = document.getElementById("logout");
logoutBtn.addEventListener("click", async () => {
  if (!confirm("Are you sure you want to log out?")) return;
  try {
    await auth.signOut();
    window.location.href = "../login.html";
  } catch (err) {
    alert("Logout failed: " + err.message);
  }
});

////////////////////////////////////////////////////////////////////////////////
// 6. Build “Profile” Section
////////////////////////////////////////////////////////////////////////////////
function buildProfileSection(data, uid) {
  const profileSection = document.getElementById("profile");
  profileSection.innerHTML = `
    <div class="profile-container">
      <h2>👤 My Profile</h2>
      <div class="profile-grid">
        <div class="avatar-preview">
          <img id="avatarImg" src="${data.profilePic || "https://via.placeholder.com/100"}" alt="Profile Picture" />
          <input type="file" id="avatarInput" accept="image/*" />
        </div>
        <div class="profile-fields">
          <label>Username (read‐only)</label>
          <input type="text" id="profileUsername" value="${data.username || ""}" disabled />

          <label>Full Name</label>
          <input type="text" id="profileName" value="${data.name || ""}" />

          <label>Email (read‐only)</label>
          <input type="email" id="profileEmail" value="${data.email || ""}" disabled />

          <label>Phone</label>
          <input type="tel" id="profilePhone" value="${data.phone || ""}" />

          <label>County</label>
          <input type="text" id="profileCounty" value="${data.county || ""}" />

          <label>Coins</label>
          <input type="number" id="profileCoins" value="${data.coins ?? 0}" disabled />

          <label>Referral Code</label>
          <input type="text" id="profileReferral" value="${data.referral || ""}" disabled />

          <button id="saveProfileBtn" class="action-btn">Save Changes</button>
        </div>
      </div>
      <div id="profileMessage" class="profile-message"></div>
    </div>
  `;

  const avatarInput = document.getElementById("avatarInput");
  avatarInput.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > 2 * 1024 * 1024) {
      alert("Please select an image under 2MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = async () => {
      document.getElementById("avatarImg").src = reader.result;
      await updateDoc(doc(db, "users", uid), { profilePic: reader.result });
      document.getElementById("profileMessage").textContent = "Profile picture updated!";
      setTimeout(() => (document.getElementById("profileMessage").textContent = ""), 3000);
    };
    reader.readAsDataURL(file);
  });

  const saveBtn = document.getElementById("saveProfileBtn");
  saveBtn.addEventListener("click", async () => {
    const newName = document.getElementById("profileName").value.trim();
    const newPhone = document.getElementById("profilePhone").value.trim();
    const newCounty = document.getElementById("profileCounty").value.trim();

    if (!newName || !newPhone || !newCounty) {
      document.getElementById("profileMessage").textContent = "All fields are required.";
      return;
    }
    try {
      await updateDoc(doc(db, "users", uid), {
        name: newName,
        phone: newPhone,
        county: newCounty,
        updatedAt: serverTimestamp()
      });
      document.getElementById("profileMessage").textContent = "Profile updated successfully!";
      setTimeout(() => (document.getElementById("profileMessage").textContent = ""), 3000);
    } catch (err) {
      document.getElementById("profileMessage").textContent = "Update failed: " + err.message;
    }
  });
}

////////////////////////////////////////////////////////////////////////////////
// 7. Build “Academy” Section
////////////////////////////////////////////////////////////////////////////////
const academySection = document.getElementById("academy");
academySection.innerHTML = `
  <div class="section-header">
    <h2>📚 Academy</h2>
    <p>All your academic resources, assignments, and study materials will appear here.</p>
  </div>
  <div class="academy-content">
    <p>• View and download PDFs</p>
    <p>• Access quizzes and exercises</p>
    <p>• Link to Google Classroom (coming soon)</p>
    <p>• Browse tutorial videos</p>
  </div>
`;

////////////////////////////////////////////////////////////////////////////////
// 8. Build “AI Zone” Section (Locked)
////////////////////////////////////////////////////////////////////////////////
const aiZoneSection = document.getElementById("ai-zone");
aiZoneSection.innerHTML = `
  <div class="section-header">
    <h2>🤖 AI Zone</h2>
    <p>Elijah, Wanga & Emma are premium AI features.</p>
  </div>
  <div class="ai-locked">
    <p>🔒 Unlock Elijah (Ask AI), Wanga (Career Plan), and Emma (Talent Strategy).</p>
    <p>Cost: 50 coins/day or 50 KES/week per service.</p>
    <button class="action-btn" disabled style="opacity: 0.6;">Unlock Now (Coming Soon)</button>
  </div>
`;

////////////////////////////////////////////////////////////////////////////////
// 9. Build “Planner” Section (Diary + Schedule)
////////////////////////////////////////////////////////////////////////////////
const plannerSection = document.getElementById("planner");
plannerSection.innerHTML = `
  <div class="section-header">
    <h2>🗓️ Planner</h2>
    <p>Keep track of your diary entries and daily schedule.</p>
  </div>
  <div class="planner-flex">
    <!-- Diary -->
    <div class="planner-card">
      <h3>📓 My Diary</h3>
      <input type="password" id="diaryPin" placeholder="Enter 4‐digit PIN" maxlength="4" />
      <textarea id="diaryText" placeholder="Write your private notes..." rows="6" disabled></textarea>
      <button id="saveDiaryBtn" class="action-btn" disabled>Save Diary</button>
      <p id="diaryMsg" class="small-text"></p>
    </div>
    <!-- Schedule -->
    <div class="planner-card">
      <h3>📅 My Schedule</h3>
      <input type="text" id="scheduleEvent" placeholder="Event title" />
      <input type="datetime-local" id="scheduleTime" />
      <button id="addScheduleBtn" class="action-btn">Add to Schedule</button>
      <div id="scheduleList" class="schedule-list"></div>
      <p id="scheduleMsg" class="small-text"></p>
    </div>
  </div>
`;

const diaryPinInput = document.getElementById("diaryPin");
const diaryText = document.getElementById("diaryText");
const saveDiaryBtn = document.getElementById("saveDiaryBtn");
const diaryMsg = document.getElementById("diaryMsg");

diaryPinInput.addEventListener("input", () => {
  if (diaryPinInput.value.length === 4) {
    diaryText.disabled = false;
    saveDiaryBtn.disabled = false;
    diaryMsg.textContent = "PIN verified! You may write your diary.";
  } else {
    diaryText.disabled = true;
    saveDiaryBtn.disabled = true;
    diaryMsg.textContent = "";
  }
});

saveDiaryBtn.addEventListener("click", async () => {
  const text = diaryText.value.trim();
  if (!text) {
    diaryMsg.textContent = "Diary entry cannot be empty.";
    return;
  }
  try {
    const user = auth.currentUser;
    await setDoc(doc(db, "diaries", user.uid), {
      text,
      pin: diaryPinInput.value,
      updatedAt: serverTimestamp(),
    });
    diaryMsg.textContent = "Diary saved successfully!";
    diaryText.value = "";
    setTimeout(() => (diaryMsg.textContent = ""), 3000);
  } catch (err) {
    diaryMsg.textContent = "Error saving diary: " + err.message;
  }
});

const scheduleEventInput = document.getElementById("scheduleEvent");
const scheduleTimeInput = document.getElementById("scheduleTime");
const addScheduleBtn = document.getElementById("addScheduleBtn");
const scheduleList = document.getElementById("scheduleList");
const scheduleMsg = document.getElementById("scheduleMsg");

addScheduleBtn.addEventListener("click", async () => {
  const title = scheduleEventInput.value.trim();
  const time = scheduleTimeInput.value;
  if (!title || !time) {
    scheduleMsg.textContent = "Both title and time are required.";
    return;
  }
  try {
    const user = auth.currentUser;
    await addDoc(collection(db, "schedules", user.uid, "events"), {
      title,
      time: new Date(time),
      createdAt: serverTimestamp(),
    });
    scheduleMsg.textContent = "Event added!";
    scheduleEventInput.value = "";
    scheduleTimeInput.value = "";
    setTimeout(() => (scheduleMsg.textContent = ""), 3000);
  } catch (err) {
    scheduleMsg.textContent = "Error adding event: " + err.message;
  }
});

auth.onAuthStateChanged((user) => {
  if (!user) return;
  const eventsCol = collection(db, "schedules", user.uid, "events");
  onSnapshot(eventsCol, (snapshot) => {
    scheduleList.innerHTML = "";
    snapshot.docs.forEach((docSnap) => {
      const ev = docSnap.data();
      const li = document.createElement("div");
      li.classList.add("schedule-item");
      li.textContent = `• ${ev.title} @ ${new Date(ev.time.seconds * 1000).toLocaleString()}`;
      scheduleList.appendChild(li);
    });
  });
});

////////////////////////////////////////////////////////////////////////////////
// 10. Build “Projects” Section
////////////////////////////////////////////////////////////////////////////////
const projectsSection = document.getElementById("projects");
projectsSection.innerHTML = `
  <div class="section-header">
    <h2>🧪 My Projects</h2>
    <p>Share your ideas — we’ll review and help you bring them to life!</p>
  </div>
  <div class="projects-form">
    <input type="text" id="projectTitle" placeholder="Project Title" />
    <textarea id="projectDesc" placeholder="Describe your project idea..." rows="4"></textarea>
    <button id="submitProjectBtn" class="action-btn">Submit Idea</button>
    <p id="projectMsg" class="small-text"></p>
  </div>
  <div id="projectList" class="project-list"></div>
`;

const submitProjectBtn = document.getElementById("submitProjectBtn");
const projectTitleInput = document.getElementById("projectTitle");
const projectDescInput = document.getElementById("projectDesc");
const projectMsg = document.getElementById("projectMsg");
const projectList = document.getElementById("projectList");

submitProjectBtn.addEventListener("click", async () => {
  const title = projectTitleInput.value.trim();
  const desc = projectDescInput.value.trim();
  if (!title || !desc) {
    projectMsg.textContent = "Both title and description are required.";
    return;
  }
  try {
    const user = auth.currentUser;
    await addDoc(collection(db, "projects", user.uid, "ideas"), {
      title,
      desc,
      status: "pending",
      createdAt: serverTimestamp(),
    });
    projectMsg.textContent = "Project idea submitted!";
    projectTitleInput.value = "";
    projectDescInput.value = "";
    setTimeout(() => (projectMsg.textContent = ""), 3000);
  } catch (err) {
    projectMsg.textContent = "Error submitting idea: " + err.message;
  }
});

auth.onAuthStateChanged((user) => {
  if (!user) return;
  const ideasCol = collection(db, "projects", user.uid, "ideas");
  onSnapshot(ideasCol, (snapshot) => {
    projectList.innerHTML = "";
    snapshot.docs.forEach((docSnap) => {
      const idea = docSnap.data();
      const div = document.createElement("div");
      div.classList.add("project-item");
      div.innerHTML = `
        <p><strong>${idea.title}</strong> (${idea.status})</p>
        <p>${idea.desc}</p>
      `;
      projectList.appendChild(div);
    });
  });
});

////////////////////////////////////////////////////////////////////////////////
// 11. Build “Competitions”, “Chatroom”, “Extras” Sections (Placeholders)
////////////////////////////////////////////////////////////////////////////////
const competitionsSection = document.getElementById("competitions");
competitionsSection.innerHTML = `
  <div class="section-header">
    <h2>🏆 Competitions</h2>
    <p>Participate in quizzes and contests to earn coins!</p>
  </div>
  <div class="competitions-content">
    <p>• Weekly quiz: “General Knowledge”</p>
    <p>• Monthly math challenge</p>
    <p>• Science fair submission (coming soon!)</p>
  </div>
`;

const chatSection = document.getElementById("chat");
chatSection.innerHTML = `
  <div class="section-header">
    <h2>💬 Chatroom</h2>
    <p>Connect with classmates and teachers (coming soon!).</p>
  </div>
  <div class="chat-placeholder">
    <p>Real‐time chat will be available in a future update.</p>
  </div>
`;

const extrasSection = document.getElementById("extras");
extrasSection.innerHTML = `
  <div class="section-header">
    <h2>✨ Extras</h2>
    <p>Additional tools, resources, and fun stuff coming soon!</p>
  </div>
`;

////////////////////////////////////////////////////////////////////////////////
// 12. Home Quick Links Behavior
////////////////////////////////////////////////////////////////////////////////
const quickButtons = document.querySelectorAll(".quick-links button");
quickButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const target = btn.getAttribute("data-target");
    document.querySelector(".section.active")?.classList.remove("active");
    document.querySelector(target)?.classList.add("active");
  });
});
