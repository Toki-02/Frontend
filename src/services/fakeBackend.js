// src/services/fakeBackend.js

const LS_USERS_KEY = "lib_users_v1";
const LS_BOOKS_KEY = "lib_books_v1";
const LS_FACE_KEY = "lib_face_records_v1";
const LS_LOGS_KEY = "lib_logs_v1";
const LS_TRANSACTIONS = "lib_transactions_v1";
const LS_RESERVATIONS = "lib_reservations_v1";

/* --- INITIAL SEED --- */
function seedData() {
  if (!localStorage.getItem(LS_USERS_KEY)) {
    const users = [
      {
        id: 1,
        name: "Gerald Venico",
        membership: "Student",
        address: "Angono",
        faceId: "user1",
      },
      {
        id: 2,
        name: "Francis Polosco",
        membership: "Employee",
        address: "Binangonan",
        faceId: "user2",
      },
    ];
    localStorage.setItem(LS_USERS_KEY, JSON.stringify(users));
  }

  if (!localStorage.getItem(LS_BOOKS_KEY)) {
    const books = [
      {
        id: 1,
        title: "Venus",
        author: "Sally MacEachern",
        publisher: "Scholastic Library Publishing",
        year: 2004,
        qr: "BOOK-VENUS",
        available: true,
      },
      {
        id: 2,
        title: "Taste and Smell",
        author: "Sally MacEachern",
        publisher: "Scholastic Library Publishing",
        year: 2004,
        qr: "BOOK-TASTE",
        available: true,
      },
    ];
    localStorage.setItem(LS_BOOKS_KEY, JSON.stringify(books));
  }

  if (!localStorage.getItem(LS_FACE_KEY)) localStorage.setItem(LS_FACE_KEY, JSON.stringify([]));
  if (!localStorage.getItem(LS_LOGS_KEY)) localStorage.setItem(LS_LOGS_KEY, JSON.stringify([]));
  if (!localStorage.getItem(LS_TRANSACTIONS)) localStorage.setItem(LS_TRANSACTIONS, JSON.stringify([]));
  if (!localStorage.getItem(LS_RESERVATIONS)) localStorage.setItem(LS_RESERVATIONS, JSON.stringify([]));
}

seedData();

/* --- HELPERS --- */
const readUsers = () => JSON.parse(localStorage.getItem(LS_USERS_KEY) || "[]");
const writeUsers = (arr) => localStorage.setItem(LS_USERS_KEY, JSON.stringify(arr));

export const readBooks = () =>
  JSON.parse(localStorage.getItem(LS_BOOKS_KEY) || "[]");
const writeBooks = (arr) => localStorage.setItem(LS_BOOKS_KEY, JSON.stringify(arr));

const readFaces = () => JSON.parse(localStorage.getItem(LS_FACE_KEY) || "[]");
const writeFaces = (arr) => localStorage.setItem(LS_FACE_KEY, JSON.stringify(arr));

const readLogs = () =>
  JSON.parse(localStorage.getItem(LS_LOGS_KEY) || "[]");
const writeLogs = (arr) => localStorage.setItem(LS_LOGS_KEY, JSON.stringify(arr));

export const readTransactions = () =>
  JSON.parse(localStorage.getItem(LS_TRANSACTIONS) || "[]");
const writeTransactions = (arr) =>
  localStorage.setItem(LS_TRANSACTIONS, JSON.stringify(arr));

export const readReservations = () =>
  JSON.parse(localStorage.getItem(LS_RESERVATIONS) || "[]");
const writeReservations = (arr) =>
  localStorage.setItem(LS_RESERVATIONS, JSON.stringify(arr));

/* --- USERS (Librarian) --- */
export const getUsers = () => readUsers();

export const registerUser = (userData) => {
  const users = readUsers();
  const nextId = (users.length ? Math.max(...users.map((u) => u.id)) : 0) + 1;
  const newUser = { id: nextId, ...userData };
  users.push(newUser);
  writeUsers(users);
  return newUser;
};

/* --- BOOKS (Librarian + User) --- */
export const getBooks = () => readBooks();

export const addBook = (bookData) => {
  const books = readBooks();
  const nextId = (books.length ? Math.max(...books.map((b) => b.id)) : 0) + 1;
  const newBook = { id: nextId, ...bookData, available: true };
  books.push(newBook);
  writeBooks(books);
  return newBook;
};

export const findBookByQR = (qr) =>
  readBooks().find(
    (b) => (b.qr || "").toLowerCase() === (qr || "").toLowerCase()
  );

export const getBookById = (id) => readBooks().find((b) => b.id === id) || null;

/* --- RESERVATIONS (User) --- */
export const cleanupExpiredReservations = () => {
  const now = Date.now();
  const reservations = readReservations();
  let changed = false;

  const active = reservations.filter((r) => {
    if (new Date(r.expiresAt).getTime() <= now) {
      const books = readBooks();
      const bidx = books.findIndex((b) => b.id === r.bookId);
      if (bidx !== -1) {
        books[bidx].available = true;
        writeBooks(books);
      }
      changed = true;
      return false;
    }
    return true;
  });

  if (changed) writeReservations(active);
  return active;
};

export const getAvailableBooks = () => {
  cleanupExpiredReservations();
  return readBooks().filter((b) => b.available);
};

export const getReservationsForUser = (userEmail) => {
  cleanupExpiredReservations();
  return readReservations().filter((r) => r.userEmail === userEmail);
};

export const reserveBook = (userEmail, bookId) => {
  cleanupExpiredReservations();
  const books = readBooks();
  const bookIdx = books.findIndex((b) => b.id === bookId);
  if (bookIdx === -1) return { success: false, message: "Book not found." };
  if (!books[bookIdx].available) return { success: false, message: "Book not available." };

  const allRes = readReservations();
  const now = Date.now();
  const existing = allRes.find(
    (r) =>
      r.userEmail === userEmail &&
      r.bookId === bookId &&
      new Date(r.reservedAt).getTime() + 24 * 60 * 60 * 1000 > now
  );
  if (existing)
    return { success: false, message: "Already reserved this book in 24h." };

  const reservedAt = new Date();
  const expiresAt = new Date(reservedAt.getTime() + 24 * 60 * 60 * 1000);
  const newRes = {
    id: Math.floor(Math.random() * 1000000),
    userEmail,
    bookId,
    reservedAt: reservedAt.toISOString(),
    expiresAt: expiresAt.toISOString(),
  };

  allRes.push(newRes);
  writeReservations(allRes);

  books[bookIdx].available = false;
  writeBooks(books);

  return { success: true, reservation: newRes };
};

export const cancelReservation = (reservationId, userEmail) => {
  const reservations = readReservations();
  const idx = reservations.findIndex(
    (r) => r.id === reservationId && r.userEmail === userEmail
  );
  if (idx === -1)
    return { success: false, message: "Reservation not found." };

  const removed = reservations.splice(idx, 1)[0];
  writeReservations(reservations);

  const books = readBooks();
  const bidx = books.findIndex((b) => b.id === removed.bookId);
  if (bidx !== -1) {
    books[bidx].available = true;
    writeBooks(books);
  }

  return { success: true };
};

/* --- FACE RECORDS (Staff) --- */
export const getFaceRecords = () => readFaces();

export const addFaceRecord = ({ name, photo, address }) => {
  const faces = readFaces();
  const id = Date.now() + Math.floor(Math.random() * 999);
  const rec = {
    id,
    name,
    photo,
    address,
    timestamp: new Date().toISOString(),
  };
  faces.unshift(rec);
  writeFaces(faces);
  return rec;
};

export const clearFaceRecords = () => {
  localStorage.removeItem(LS_FACE_KEY);
  return true;
};

/* --- LOGS (Staff) --- */
export const getLogs = () => readLogs();

export const saveLog = (
  name,
  status = "Guest",
  action = "Time In",
  extra = {}
) => {
  const logs = readLogs();
  const entry = {
    id: Date.now() + Math.floor(Math.random() * 999),
    name,
    status,
    action,
    timestamp: new Date().toISOString(),
    ...extra,
  };
  logs.unshift(entry);
  writeLogs(logs);
  return entry;
};

export const clearLogs = () => {
  localStorage.removeItem(LS_LOGS_KEY);
  return true;
};

/* --- TRANSACTIONS (Borrow/Return) --- */
export const getTransactions = () => readTransactions();

export const addTransaction = (tx) => {
  const arr = readTransactions();
  arr.unshift({ id: Date.now(), ...tx, timestamp: new Date().toISOString() });
  writeTransactions(arr);
  return arr[0];
};

export const clearTransactions = () => {
  localStorage.removeItem(LS_TRANSACTIONS);
  return true;
};

/* --- REPORTS / STATS --- */
export const getReportSummary = () => {
  const tx = getTransactions();
  return {
    totalUsers: readUsers().length,
    totalBooks: readBooks().length,
    borrowedBooks: tx.filter((t) => t.type === "borrow").length,
    totalLogs: readLogs().length,
  };
};

export const getTopBooks = () =>
  readBooks()
    .slice(0, 5)
    .map((b) => ({
      title: b.title,
      category: b.category || "General",
      borrowed: Math.floor(Math.random() * 20 + 1),
    }));

export const getTopCategories = () => [
  { category: "Computer Science", count: 45 },
  { category: "Fiction", count: 25 },
  { category: "Business", count: 12 },
];

export const getMonthlyStats = () => [
  { month: "May", borrowed: 120 },
  { month: "Jun", borrowed: 190 },
  { month: "Jul", borrowed: 150 },
  { month: "Aug", borrowed: 220 },
  { month: "Sep", borrowed: 260 },
  { month: "Oct", borrowed: 198 },
];
