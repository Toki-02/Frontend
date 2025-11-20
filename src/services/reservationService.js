// src/services/reservationService.js
const BOOKS_KEY = "rp_library_books";
const RES_KEY = "rp_library_reservations";

function seedBooksIfNeeded() {
  if (!localStorage.getItem(BOOKS_KEY)) {
    const seed = [
      { id:1, title:"Atomic Habits", author:"James Clear", cover:"https://images-na.ssl-images-amazon.com/images/I/51-uspgqWIL._SX329_BO1,204,203,200_.jpg", description:"Tiny changes, remarkable results.", isbn:"9780735211292", category:"Self-help", year:2018, pages:320, available:true },
      { id:2, title:"The Pragmatic Programmer", author:"Andrew Hunt, David Thomas", cover:"https://images-na.ssl-images-amazon.com/images/I/41as+WafrFL._SX396_BO1,204,203,200_.jpg", description:"Classic pragmatic advice on software craftsmanship.", isbn:"9780201616224", category:"Programming", year:1999, pages:352, available:true },
      { id:3, title:"Clean Code", author:"Robert C. Martin", cover:"https://images-na.ssl-images-amazon.com/images/I/41xShlnTZTL._SX374_BO1,204,203,200_.jpg", description:"A handbook of agile software craftsmanship.", isbn:"9780132350884", category:"Programming", year:2008, pages:464, available:true },
      { id:4, title:"The Lean Startup", author:"Eric Ries", cover:"https://images-na.ssl-images-amazon.com/images/I/41gKZB8J35L._SX331_BO1,204,203,200_.jpg", description:"Continuous innovation for successful businesses.", isbn:"9780307887894", category:"Business", year:2011, pages:336, available:true },
    ];
    localStorage.setItem(BOOKS_KEY, JSON.stringify(seed));
  }
}

function readBooks() { seedBooksIfNeeded(); return JSON.parse(localStorage.getItem(BOOKS_KEY) || "[]"); }
function writeBooks(arr) { localStorage.setItem(BOOKS_KEY, JSON.stringify(arr)); }

function readReservations() { return JSON.parse(localStorage.getItem(RES_KEY) || "[]"); }
function writeReservations(arr) { localStorage.setItem(RES_KEY, JSON.stringify(arr)); }

export function getBooks() { cleanupExpiredReservations(); return readBooks(); }
export function getAvailableBooks() { cleanupExpiredReservations(); return readBooks().filter(b => b.available); }
export function getBookById(id) { return readBooks().find(b => b.id === id) || null; }

export function reserveBook(userEmail, bookId) {
  cleanupExpiredReservations();
  const books = readBooks();
  const bookIdx = books.findIndex(b => b.id === bookId);
  if(bookIdx===-1) return {success:false, message:"Book not found."};
  if(!books[bookIdx].available) return {success:false, message:"Book not available."};

  const allRes = readReservations();
  const now = Date.now();
  const existing = allRes.find(r=>r.userEmail===userEmail && r.bookId===bookId && new Date(r.reservedAt).getTime() + 24*60*60*1000 > now);
  if(existing) return {success:false, message:"You already reserved this book within 24h."};

  const reservedAt = new Date();
  const expiresAt = new Date(reservedAt.getTime() + 24*60*60*1000);
  const newRes = { id:Math.floor(Math.random()*1000000), userEmail, bookId, reservedAt:reservedAt.toISOString(), expiresAt:expiresAt.toISOString() };

  allRes.push(newRes); writeReservations(allRes);
  books[bookIdx].available = false; writeBooks(books);

  return {success:true, reservation:newRes};
}

export function cleanupExpiredReservations() {
  const now = Date.now();
  const res = readReservations();
  let changed = false;
  const stillActive = res.filter(r => {
    if(new Date(r.expiresAt).getTime() <= now){
      const books = readBooks();
      const idx = books.findIndex(b => b.id===r.bookId);
      if(idx!==-1){ books[idx].available=true; writeBooks(books); }
      changed=true; return false;
    }
    return true;
  });
  if(changed) writeReservations(stillActive);
  return stillActive;
}
