// src/services/fakeBackend.js
// Fake backend + persistent log helpers (localStorage)

const LS_LOGS_KEY = "lib_logs_v1";

// --- Seed / sample data (won't overwrite logs in localStorage) ---
let users = [
  { id: 1, name: "Gerald Venico", membership: "Student", faceId: "user1" },
  { id: 2, name: "Francis Polosco", membership: "Employee", faceId: "user2" },
];

let books = [
  { id: 1, title: "AI Fundamentals", category: "Computer Science", available: true },
  { id: 2, title: "Data Structures 101", category: "Computer Science", available: false },
  { id: 3, title: "Marketing 101", category: "Business", available: true },
  { id: 4, title: "Teaching in Modern Age", category: "Education", available: true },
  { id: 5, title: "Space & Science", category: "Science", available: true },
];

let faceRecords = JSON.parse(localStorage.getItem("lib_face_records_v1") || "[]");

// Get all face records
export function getFaceRecords() {
  return faceRecords;
}

// Add a new face record
export function addFaceRecord({ id, name, photo }) {
  // id = auto increment, or UUID
  // name = user name
  // photo = base64 image string or URL (depends on your Register Face page)
  const newRecord = {
    id: id ?? Date.now(),
    name,
    photo,
    timestamp: new Date().toISOString(),
  };
  faceRecords.push(newRecord);
  localStorage.setItem("lib_face_records_v1", JSON.stringify(faceRecords));
  return newRecord;
}

// Optional: delete a face record
export function deleteFaceRecord(recordId) {
  faceRecords = faceRecords.filter(r => r.id !== recordId);
  localStorage.setItem("lib_face_records_v1", JSON.stringify(faceRecords));
}

// Optional: clear all records
export function clearFaceRecords() {
  faceRecords = [];
  localStorage.setItem("lib_face_records_v1", JSON.stringify(faceRecords));
}

// --- Init Seed / Sample Logs ---
export function initSeed() {
  if (!localStorage.getItem(LS_LOGS_KEY)) {
    const sample = [
      {
        id: Date.now() - 1000 * 60 * 60 * 24,
        name: "Gerald Venico",
        status: "Registered",
        action: "Time In",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      },
      {
        id: Date.now() - 1000 * 60 * 60 * 23,
        name: "Gerald Venico",
        status: "Registered",
        action: "Time Out",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23).toISOString(),
      },
    ];
    localStorage.setItem(LS_LOGS_KEY, JSON.stringify(sample));
  }
  return true;
}

// --- Logs persistence helpers ---
export function getLogs() {
  try {
    const raw = JSON.parse(localStorage.getItem(LS_LOGS_KEY) || "[]");
    return Array.isArray(raw) ? raw.slice().sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1)) : [];
  } catch (e) {
    console.error("fakeBackend.getLogs parse error", e);
    return [];
  }
}

/**
 * saveLog(name, status, action)
 * - name: string
 * - status: "Registered" | "Guest"
 * - action: "Time In" | "Time Out"
 */
export function saveLog(name, status = "Guest", action = "Time In") {
  const logs = getLogs();
  const entry = {
    id: Date.now() + Math.floor(Math.random() * 999),
    name,
    status,
    action,
    timestamp: new Date().toISOString(),
  };
  logs.unshift(entry);
  try {
    localStorage.setItem(LS_LOGS_KEY, JSON.stringify(logs));
  } catch (e) {
    console.error("fakeBackend.saveLog write error", e);
  }
  return entry;
}

// small utility to clear logs (dev only)
export function clearLogs() {
  localStorage.removeItem(LS_LOGS_KEY);
  return true;
}

// --- Users / Books helpers ---
export function getUsers() {
  return users.slice();
}

export function getBooks() {
  return books.slice();
}

// --- Reports helpers ---
export function getReportSummary() {
  const logs = getLogs();
  return {
    totalUsers: users.length,
    totalBooks: books.length,
    totalLogs: logs.length,
    recentLog: logs[0] || null,
  };
}

export function getMonthlyStats() {
  return [
    { month: "May", borrowed: 120 },
    { month: "Jun", borrowed: 190 },
    { month: "Jul", borrowed: 150 },
    { month: "Aug", borrowed: 220 },
    { month: "Sep", borrowed: 260 },
    { month: "Oct", borrowed: 198 },
  ];
}

// --- Optional: addBook helper (for AddBook.jsx) ---
export function addBook(bookData) {
  const nextIdNumber = books.length + 1;
  const newBook = {
    id: nextIdNumber,
    title: bookData.title,
    author: bookData.author || "Unknown Author",
    publisher: bookData.publisher || "Unknown Publisher",
    year: bookData.year || "N/A",
    category: bookData.category || "Uncategorized",
    description: bookData.description || "No description available.",
    copies: parseInt(bookData.copies || 1),
    available: true,
    dateAdded: new Date().toISOString(),
  };
  books.push(newBook);
  return newBook;
}

export function registerUser(userData) {
  const nextId = users.length + 1;
  const newUser = {
    id: nextId,
    name: userData.name,
    membership: userData.membership || "Guest",
    faceId: userData.faceId || `user${nextId}`,
  };
  users.push(newUser);
  return newUser;
}

// src/services/fakeBackend.js

export function getTopBooks() {
  return [
    { title: "Book A", category: "Fiction", borrowed: 10 },
    { title: "Book B", category: "Science", borrowed: 8 },
  ];
}

export function getTopCategories() {
  return [
    { category: "Fiction", count: 15 },
    { category: "Science", count: 10 },
  ];
}

// =======================
// FACE RECORD INTEGRATION
// =======================

// Helper to generate sequential IDs (000001, 000002, ...)
function nextFaceRecordId() {
  const all = JSON.parse(localStorage.getItem("lib_face_records_v1") || "[]");
  const max = all.reduce((m, it) => {
    const n = parseInt(String(it.id).replace(/^0+/, "") || "0", 10);
    return Number.isNaN(n) ? m : Math.max(m, n);
  }, 0);
  return String(max + 1).padStart(6, "0");
}

/**
 * registerFaceUser(name, photo)
 * Adds a new user face record + registers in users if not exists
 */
export function registerFaceUser(name, photo) {
  if (!name || !name.trim()) {
    return { success: false, message: "Invalid name" };
  }

  const trimmedName = name.trim();
  // check duplicate
  const exists = users.find((u) => u.name.toLowerCase() === trimmedName.toLowerCase());
  if (exists) {
    return { success: false, message: "User already registered" };
  }

  // add to user list
  const newUser = registerUser({
    name: trimmedName,
    membership: "Student",
    faceId: `face_${Date.now()}`,
  });

  // add to face record
  const faceRecords = JSON.parse(localStorage.getItem("lib_face_records_v1") || "[]");
  const newRecord = {
    id: nextFaceRecordId(),
    name: trimmedName,
    photo: photo || null,
    timestamp: new Date().toISOString(),
  };
  faceRecords.push(newRecord);
  localStorage.setItem("lib_face_records_v1", JSON.stringify(faceRecords));

  // save log
  saveLog(trimmedName, "Registered", "Face Registered");

  return { success: true, user: newUser, record: newRecord };
}

/**
 * resetFaceRecords()
 * Clears all face records (1-time reset)
 */
export function resetFaceRecords() {
  localStorage.removeItem("lib_face_records_v1");
  return { success: true, message: "All face records cleared" };
}
