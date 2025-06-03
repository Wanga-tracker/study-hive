// student.js

import { dailyFacts } from "./facts.js";

// ─────────────────────────────────────────────────────────────────
// 1) Initialize Firebase (Compat SDKs)
//    (Replace config with your own Edu Sync Hub Africa project)
const firebaseConfig = {
  apiKey: "AIzaSyAcqZKghgyzk1ghfP-l8dwlHOVRNeG1TAk",
  authDomain: "edu-sync-hub-africa.firebaseapp.com",
  projectId: "edu-sync-hub-africa",
  storageBucket: "edu-sync-hub-africa.appspot.com",
  messagingSenderId: "625120725619",
  appId: "1:625120725619:web:0a373d5201cd9a87333806",
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// ──────────────── 2) DOM ELEMENTS ────────────────
const hamburger = document.getElementById("hamburger");
const sidebar = document.getElementById("sidebar");
const bellIcon = document.getElementById("bellIcon");
const notificationBar = document.getElementById("notificationBar");
const closeNotif = document.getElementById("closeNotif");
const notificationText = document.getElementById("notificationText");

const sections = document.querySelectorAll(".section");
const sideLinks = document.querySelectorAll(".sidebar a[data-section]");
const quickBtns = document.querySelectorAll(".quick-actions .action-btn");

const userNameElem = document.getElementById("userName");
const coinsElem = document.getElementById("coins");
const referralsElem = document.getElementById("referrals");
const refLinkElem = document.getElementById("refLink");
const quoteElem = document.getElementById("quote");

const profilePicDisplay = document.getElementById("profilePicDisplay");
const profilePicInput = document.getElementById("profilePicInput");
const profileName = document.getElementById("profileName");
const profileUsername = document.getElementById("profileUsername");
const profilePhone = document.getElementById("profilePhone");
const profileCounty = document.getElementById("profileCounty");
const profileReferral = document.getElementById("profileReferral");
const profileCoins = document.getElementById("profileCoins");
const saveProfileBtn = document.getElementById("saveProfileBtn");

const assignmentList = document.getElementById("assignmentList");
const funFactElem = document.getElementById("funFact");
const likeFactBtn = document.getElementById("likeFactBtn");

const aiTabBtns = document.querySelectorAll(".ai-tabs .tab-btn");
const aiPanels = document.querySelectorAll(".ai-panel");
const elijahChatWindow = document.getElementById("elijahChatWindow");
const elijahInput = document.getElementById("elijahInput");
const elijahSendBtn = document.getElementById("elijahSendBtn");
const wangaInput = document.getElementById("careerGoalInput");
const wangaSendBtn = document.getElementById("wangaSendBtn");
const wangaResult = document.getElementById("wangaResult");
const emmaInput = document.getElementById("talentInput");
const emmaSendBtn = document.getElementById("emmaSendBtn");
const emmaResult = document.getElementById("emmaResult");

const diaryPIN = document.getElementById("diaryPIN");
const unlockDiaryBtn = document.getElementById("unlockDiaryBtn");
const diaryContent = document.getElementById("diaryContent");
const saveDiaryBtn = document.getElementById("saveDiaryBtn");
const scheduleEventInput = document.getElementById("scheduleEventInput");
const addScheduleBtn = document.getElementById("addScheduleBtn");
const scheduleList = document.getElementById("scheduleList");

const chatList = document.getElementById("chatList");
const chatInput = document.getElementById("chatInput");
const chatSendBtn = document.getElementById("chatSendBtn");

const projectTitle = document.getElementById("projectTitle");
const projectDesc = document.getElementById("projectDesc");
const submitProjectBtn = document.getElementById("submitProjectBtn");
const projectList = document.getElementById("projectList");

const youtubeSearchInput = document.getElementById("youtubeSearchInput");
const youtubeSearchBtn = document.getElementById("youtubeSearchBtn");
const youtubeResults = document.getElementById("youtubeResults");

const driveUploadInput = document.getElementById("driveUploadInput");
const driveUploadBtn = document.getElementById("driveUploadBtn");
const driveFileList = document.getElementById("driveFileList");

const gcRedirectBtn = document.getElementById("gcRedirectBtn");
const gcalRedirectBtn = document.getElementById("gcalRedirectBtn");
const gsheetsRedirectBtn = document.getElementById("gsheetsRedirectBtn");

const feedbackBtn = document.getElementById("feedbackBtn");
const feedbackModal = document.getElementById("feedbackModal");
const closeFeedbackModal = document.getElementById("closeFeedbackModal");
const feedbackText = document.getElementById("feedbackText");
const submitFeedbackBtn = document.getElementById("submitFeedbackBtn");

const welcomeSim = document.getElementById("welcomeSim");
const factDisplay = document.getElementById("fact");

// ――――――――― Utility Functions ―――――――――
function showSection(sectionId) {
  sections.forEach(sec => {
    if (sec.id === sectionId) {
      sec.classList.add("active");
    } else {
      sec.classList.remove("active");
    }
  });
}

function toggleSidebar() {
  sidebar.classList.toggle("active");
}

function showNotification(message) {
  notificationText.textContent = message;
  notificationBar.classList.add("active");
  setTimeout(() => {
    notificationBar.classList.remove("active");
  }, 5000);
}

function rotateFacts() {
  const idx = Math.floor(Math.random() * dailyFacts.length);
  factDisplay.textContent = dailyFacts[idx];
}

// ――――――――― 3) Sidebar & Quick Action Listeners ―――――――――
hamburger.addEventListener("click", toggleSidebar);

sideLinks.forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    const section = link.getAttribute("data-section");
    showSection(section);
    toggleSidebar();
  });
});

quickBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    const section = btn.getAttribute("data-section");
    showSection(section);
  });
});

// Close notification when “X” clicked
closeNotif.addEventListener("click", () => {
  notificationBar.classList.remove("active");
});

// ――――――――― 4) Profile Section Logic ―――――――――
async function loadUserProfile(uid) {
  try {
    const userDoc = await db.collection("users").doc(uid).get();
    if (!userDoc.exists) return;
    const data = userDoc.data();
    profileName.value = data.name || "";
    profileUsername.value = data.username || "";
    profilePhone.value = data.phone || "";
    profileCounty.value = data.county || "";
    profileReferral.value = data.referral || "";
    profileCoins.value = data.coins || 0;
    referralsElem.textContent = data.referrals || 0;
    refLinkElem.textContent = `edusync.com/ref/${data.referral || ""}`;

    // Load profile picture if exists
    if (data.profilePicURL) {
      profilePicDisplay.src = data.profilePicURL;
    }
  } catch (err) {
    console.error("Error loading profile:", err);
  }
}

profilePicInput.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const user = auth.currentUser;
  const storageRef = storage.ref(`profiles/${user.uid}/${file.name}`);
  await storageRef.put(file);
  const url = await storageRef.getDownloadURL();
  profilePicDisplay.src = url;
  await db.collection("users").doc(user.uid).update({ profilePicURL: url });
});

saveProfileBtn.addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user) return;
  try {
    await db.collection("users").doc(user.uid).update({
      name: profileName.value.trim(),
      username: profileUsername.value.trim(),
      phone: profilePhone.value.trim(),
      county: profileCounty.value.trim(),
    });
    showNotification("Profile updated successfully!");
  } catch (err) {
    console.error("Error saving profile:", err);
    showNotification("Error updating profile.");
  }
});

// ――――――――― 5) Academics Section (Assignments + Fun Study) ―――――――――
async function loadAssignments(uid) {
  const snapshot = await db.collection("assignments")
    .where("assignedTo", "==", uid)
    .orderBy("dueDate", "asc")
    .get();
  assignmentList.innerHTML = "";
  if (snapshot.empty) {
    assignmentList.innerHTML = "<p>No assignments assigned.</p>";
    return;
  }
  snapshot.forEach(doc => {
    const data = doc.data();
    const li = document.createElement("div");
    li.classList.add("assignment-item");
    li.innerHTML = `
      <p><strong>${data.title}</strong> – Due: ${new Date(data.dueDate.seconds * 1000).toLocaleDateString()}</p>
      <button class="action-btn" onclick="submitAssignment('${doc.id}')">Submit</button>
    `;
    assignmentList.appendChild(li);
  });
}

window.submitAssignment = async function(assignmentId) {
  const user = auth.currentUser;
  if (!user) return;
  // For simplicity: prompt for a short text submission
  const answer = prompt("Enter your assignment answer (text):");
  if (!answer) return;
  try {
    await db.collection("submissions").add({
      assignmentId: assignmentId,
      submittedBy: user.uid,
      answerText: answer,
      submittedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    showNotification("Assignment submitted!");
  } catch (err) {
    console.error("Error submitting:", err);
    showNotification("Submission failed.");
  }
};

// Like a fact (award coin)
likeFactBtn.addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user) return;
  try {
    await db.collection("users").doc(user.uid).update({
      coins: firebase.firestore.FieldValue.increment(1)
    });
    let current = parseInt(coinsElem.textContent, 10) || 0;
    coinsElem.textContent = current + 1;
    showNotification("You earned 1 coin for liking a fact!");
  } catch (err) {
    console.error("Error liking fact:", err);
  }
});

// ――――――――― 6) AI Zone Logic ―――――――――
aiTabBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    aiTabBtns.forEach(b => b.classList.remove("active"));
    aiPanels.forEach(panel => panel.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(btn.getAttribute("data-ai")).classList.add("active");
  });
});

// Elijah Chat
elijahSendBtn.addEventListener("click", async () => {
  const user = auth.currentUser;
  const question = elijahInput.value.trim();
  if (!user || !question) return;
  // Append user question locally
  const userMsg = document.createElement("p");
  userMsg.textContent = `You: ${question}`;
  elijahChatWindow.appendChild(userMsg);
  elijahInput.value = "";

  // Simulate AI call (replace with your Firebase Function / Genkit call)
  const aiResponse = await mockElijahResponse(question);
  const botMsg = document.createElement("p");
  botMsg.textContent = `Elijah: ${aiResponse}`;
  elijahChatWindow.appendChild(botMsg);

  // Scroll to bottom
  elijahChatWindow.scrollTop = elijahChatWindow.scrollHeight;
});

// Mock function for Elijah (replace with real Gemini API call)
async function mockElijahResponse(prompt) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(`(Simulated AI answer to "${prompt}")`);
    }, 1200);
  });
}

// Wanga Career Plan
wangaSendBtn.addEventListener("click", async () => {
  const careerGoal = wangaInput.value.trim();
  if (!careerGoal) return;
  wangaResult.textContent = "Generating career plan…";
  // Simulate AI call
  const plan = await mockWangaResponse(careerGoal);
  wangaResult.innerHTML = `<p>${plan}</p>`;
});

// Mock Wanga
async function mockWangaResponse(goal) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(
        `Steps to become a ${goal}:\n1. Research required degrees.\n2. Join related clubs.\n3. Practice daily.\n…`
      );
    }, 1500);
  });
}

// Emma Talent Strategy
emmaSendBtn.addEventListener("click", async () => {
  const talent = emmaInput.value.trim();
  if (!talent) return;
  emmaResult.textContent = "Generating talent strategy…";
  const tips = await mockEmmaResponse(talent);
  emmaResult.innerHTML = `<p>${tips}</p>`;
});

// Mock Emma
async function mockEmmaResponse(talent) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(
        `Tips to improve in ${talent}:\n• Practice 1 hour daily.\n• Find a mentor.\n• Join competitions.\n…`
      );
    }, 1500);
  });
}

// ――――――――― 7) Planner Logic ―――――――――
// Diary PIN & Save
unlockDiaryBtn.addEventListener("click", async () => {
  const user = auth.currentUser;
  const pin = diaryPIN.value.trim();
  if (!user || pin.length !== 4) {
    alert("Enter a 4-digit PIN.");
    return;
  }
  // Verify PIN from Firestore (assuming you saved hashed PIN in users collection)
  const userDoc = await db.collection("users").doc(user.uid).get();
  const data = userDoc.data();
  if (data.diaryPIN !== pin) { // In practice, store a hashed PIN
    alert("Invalid PIN.");
    return;
  }
  diaryContent.disabled = false;
  saveDiaryBtn.disabled = false;
  // Load existing diary (if any)
  const diaryDoc = await db.collection("diaries").doc(user.uid).get();
  if (diaryDoc.exists) {
    diaryContent.value = diaryDoc.data().content;
  }
});

saveDiaryBtn.addEventListener("click", async () => {
  const user = auth.currentUser;
  const content = diaryContent.value.trim();
  if (!user) return;
  await db.collection("diaries").doc(user.uid).set({
    content,
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  });
  showNotification("Diary entry saved!");
});

// Schedule: Add & Load
addScheduleBtn.addEventListener("click", async () => {
  const user = auth.currentUser;
  const event = scheduleEventInput.value.trim();
  if (!user || !event) return;
  await db.collection("schedules").add({
    userId: user.uid,
    event,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });
  scheduleEventInput.value = "";
  loadSchedule(user.uid);
  showNotification("Event added to schedule!");
});

async function loadSchedule(uid) {
  const snapshot = await db.collection("schedules")
    .where("userId", "==", uid)
    .orderBy("createdAt", "desc")
    .get();
  scheduleList.innerHTML = "";
  if (snapshot.empty) {
    scheduleList.innerHTML = "<p>No scheduled events.</p>";
    return;
  }
  snapshot.forEach(doc => {
    const data = doc.data();
    const p = document.createElement("p");
    p.textContent = `${new Date(data.createdAt.seconds * 1000).toLocaleString()}: ${data.event}`;
    scheduleList.appendChild(p);
  });
}

// ――――――――― 8) Chatroom Logic ―――――――――
chatSendBtn.addEventListener("click", async () => {
  const user = auth.currentUser;
  const text = chatInput.value.trim();
  if (!user || !text) return;
  await db.collection("messages").add({
    from: user.uid,
    text,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  });
  chatInput.value = "";
});

// Listen for new messages
db.collection("messages").orderBy("timestamp", "asc")
  .onSnapshot(snapshot => {
    chatList.innerHTML = "";
    snapshot.forEach(doc => {
      const msg = doc.data();
      const p = document.createElement("p");
      p.textContent = `${msg.from}: ${msg.text}`;
      chatList.appendChild(p);
    });
    chatList.scrollTop = chatList.scrollHeight;
  });

// ――――――――― 9) Projects Logic ―――――――――
submitProjectBtn.addEventListener("click", async () => {
  const user = auth.currentUser;
  const title = projectTitle.value.trim();
  const desc = projectDesc.value.trim();
  if (!user || !title || !desc) return;
  await db.collection("projects").add({
    userId: user.uid,
    title,
    description: desc,
    status: "Pending",
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });
  projectTitle.value = "";
  projectDesc.value = "";
  loadProjects(user.uid);
  showNotification("Project idea submitted – awaiting review!");
});

async function loadProjects(uid) {
  const snapshot = await db.collection("projects")
    .where("userId", "==", uid)
    .orderBy("createdAt", "desc")
    .get();
  projectList.innerHTML = "";
  if (snapshot.empty) {
    projectList.innerHTML = "<p>No projects submitted yet.</p>";
    return;
  }
  snapshot.forEach(doc => {
    const data = doc.data();
    const div = document.createElement("div");
    div.classList.add("project-item");
    div.innerHTML = `
      <p><strong>${data.title}</strong> – ${data.status}</p>
      <p>${data.description}</p>
    `;
    projectList.appendChild(div);
  });
}

// ――――――――― 10) Extras Logic (YouTube, Drive, Classroom, Calendar, Sheets) ―――――――――
// YouTube Search (placeholder using YouTube Data API v3)
youtubeSearchBtn.addEventListener("click", async () => {
  const query = youtubeSearchInput.value.trim();
  if (!query) return;
  youtubeResults.innerHTML = "<p>Searching YouTube…</p>";
  try {
    // TODO: Replace 'YOUR_API_KEY' with your actual YouTube Data API key
    const apiKey = "YOUR_YOUTUBE_API_KEY";
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=5&q=${encodeURIComponent(query)}&key=${apiKey}`
    );
    const data = await response.json();
    youtubeResults.innerHTML = "";
    data.items.forEach(item => {
      const vidId = item.id.videoId;
      const title = item.snippet.title;
      const thumbnail = item.snippet.thumbnails.default.url;
      const div = document.createElement("div");
      div.classList.add("yt-result");
      div.innerHTML = `
        <img src="${thumbnail}" alt="${title}" />
        <a href="https://www.youtube.com/watch?v=${vidId}" target="_blank">${title}</a>
      `;
      youtubeResults.appendChild(div);
    });
  } catch (err) {
    console.error("YouTube search error:", err);
    youtubeResults.innerHTML = "<p>Search failed.</p>";
  }
});

// Google Drive Upload (placeholder logic)
driveUploadBtn.addEventListener("click", async () => {
  const user = auth.currentUser;
  const files = driveUploadInput.files;
  if (!user || files.length === 0) return;
  driveFileList.innerHTML = "<p>Uploading to Google Drive…</p>";
  // TODO: Integrate with Google Drive API (OAuth2 + gapi.client) to upload files
  setTimeout(() => {
    driveFileList.innerHTML = "<p>Uploaded to Google Drive (simulated).</p>";
    driveUploadInput.value = "";
  }, 2000);
});

// Google Classroom Redirect
gcRedirectBtn.addEventListener("click", () => {
  // TODO: Replace with your Google Classroom link or integration
  window.open("https://classroom.google.com", "_blank");
});

// Google Calendar Redirect
gcalRedirectBtn.addEventListener("click", () => {
  // TODO: Replace with your Google Calendar link or integration
  window.open("https://calendar.google.com", "_blank");
});

// Google Sheets Redirect
gsheetsRedirectBtn.addEventListener("click", () => {
  // TODO: Replace with your Google Sheets link or integration
  window.open("https://docs.google.com/spreadsheets", "_blank");
});

// ――――――――― 11) Feedback Modal Logic ―――――――――
feedbackBtn.addEventListener("click", () => {
  feedbackModal.style.display = "flex";
});

closeFeedbackModal.addEventListener("click", () => {
  feedbackModal.style.display = "none";
});

submitFeedbackBtn.addEventListener("click", async () => {
  const user = auth.currentUser;
  const text = feedbackText.value.trim();
  if (!user || !text) return;
  await db.collection("feedback").add({
    userId: user.uid,
    message: text,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });
  feedbackText.value = "";
  feedbackModal.style.display = "none";
  showNotification("Thank you for your feedback!");
});

// ――――――――― 12) Logout Logic ―――――――――
document.getElementById("logoutBtn").addEventListener("click", async () => {
  if (confirm("Are you sure you want to log out?")) {
    await auth.signOut();
    window.location.href = "../login.html";
  }
});

// ――――――――― 13) Authentication State & Initial Load ―――――――――
auth.onAuthStateChanged(async user => {
  if (!user) {
    window.location.href = "../login.html";
    return;
  }
  // Load basic user data
  const userDoc = await db.collection("users").doc(user.uid).get();
  if (!userDoc.exists) {
    window.location.href = "../signup.html";
    return;
  }
  const data = userDoc.data();
  userNameElem.textContent = data.name || data.username || data.email;
  coinsElem.textContent = data.coins || 0;
  referralsElem.textContent = data.referrals || 0;
  profileReferral.value = data.referral || "";
  refLinkElem.textContent = `edusync.com/ref/${data.referral || ""}`;

  // Load Profile
  loadUserProfile(user.uid);

  // Load Assignments
  loadAssignments(user.uid);

  // Load Schedule
  loadSchedule(user.uid);

  // Load Projects
  loadProjects(user.uid);

  // Start rotating facts every 30s
  rotateFacts();
  setInterval(rotateFacts, 30000);

  // Auto-show welcome simulation for 5 minutes
  setTimeout(() => {
    if (welcomeSim) welcomeSim.style.display = "none";
  }, 300000);

  // Show a simulated notification every 10 minutes
  setInterval(() => {
    showNotification("📢 Tip: Check your assignments and earn coins today!");
  }, 600000);
});

// End of student.js
