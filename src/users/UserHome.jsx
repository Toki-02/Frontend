// src/pages/User/UserHome.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  Book,
  Bell,
  CalendarCheck,
  Bookmark,
  AlertTriangle,
  Clock,
  Info,
} from "lucide-react";
import { gsap } from "gsap";

// ====== SIMPLE RESERVATION STORAGE (LOCALSTORAGE) ======
const RES_KEY = "rp_reservations";
const userEmail = "user@example.com"; // replace with real auth email later

function readReservations() {
  try {
    return JSON.parse(localStorage.getItem(RES_KEY) || "[]");
  } catch {
    return [];
  }
}

function writeReservations(next) {
  localStorage.setItem(RES_KEY, JSON.stringify(next));
}

// Mock user data
const mockUser = {
  name: "Gerald Venico",
  borrowedBooks: [
    { title: "Atomic Habits", due: "2025-11-20" },
    { title: "Rich Dad Poor Dad", due: "2025-11-18" },
  ],
  fines: 150,
  reservations: [
    {
      title: "The Pragmatic Programmer",
      reservedAt: "2025-11-15",
      expiresAt: "2025-11-16",
    },
  ],
  notifications: [
    { text: "You have 1 book due tomorrow", type: "due" },
    {
      text: "Reservation for 'The Pragmatic Programmer' expires in 24h",
      type: "reservation",
    },
    { text: "‘Rich Dad Poor Dad’ is due today", type: "due" },
    {
      text: "New arrivals: Software Engineering & Data Science shelves updated",
      type: "info",
    },
    {
      text: "You have no pending clearance issues. You’re all good!",
      type: "system",
    },
  ],
  recentActivities: [
    { text: "Borrowed 'Atomic Habits'", time: "Today, 9:12 AM" },
    { text: "Returned 'The Pragmatic Programmer'", time: "Yesterday, 3:10 PM" },
    {
      text: "Reserved 'The Pragmatic Programmer'",
      time: "Nov 15, 2025 – 10:01 AM",
    },
    {
      text: "Viewed recommendations for personal development books",
      time: "Nov 14, 2025 – 4:22 PM",
    },
  ],
};

// Suggested books mock with images & description
const suggestedBooks = [
  {
    id: 1,
    title: "Deep Work",
    author: "Cal Newport",
    img: "https://www.karthikchidambaram.com/wp-content/uploads/2022/10/book-cover-3-1024x536.png",
    description:
      "Train your focus and eliminate shallow distractions to do meaningful work that actually moves you forward.",
  },
  {
    id: 2,
    title: "Clean Code",
    author: "Robert C. Martin",
    img: "https://tse1.mm.bing.net/th/id/OIP.mnwAULCuz43upmQWfknlPwHaEK?pid=Api&P=0&h=220",
    description:
      "Learn how to write readable, maintainable code that is easy to debug and extend over time.",
  },
  {
    id: 3,
    title: "The 7 Habits of Highly Effective People",
    author: "Stephen R. Covey",
    img: "https://m.media-amazon.com/images/I/51S19RihhML._SX342_SY445_.jpg",
    description:
      "Build habits that align your daily actions with long-term goals in life, school, and work.",
  },
  {
    id: 4,
    title: "The Lean Startup",
    author: "Eric Ries",
    img: "https://tse3.mm.bing.net/th/id/OIP._PUCjYljiaFUZtIUHxY38gAAAA?pid=Api&P=0&h=220",
    description:
      "Use experimentation and rapid feedback to test ideas and reduce risk when building new products.",
  },
];

function StatCard({ title, value, icon, accent = "sky" }) {
  const accentColor =
    accent === "red" ? "bg-red-500/15 text-red-600" : "bg-sky-500/15 text-sky-600";
  const borderColor = accent === "red" ? "border-red-100" : "border-sky-100";

  return (
    <div
      className={`bg-white/90 border ${borderColor} rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition`}
    >
      <div
        className={`flex-none w-12 h-12 rounded-xl ${accentColor} flex items-center justify-center`}
      >
        {icon}
      </div>
      <div>
        <div className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
          {title}
        </div>
        <div className="text-2xl font-bold mt-1 text-slate-900">{value}</div>
      </div>
    </div>
  );
}

function SuggestedBookCard({ book, onReserve }) {
  return (
    <article className="group relative rounded-2xl overflow-hidden min-h-[260px] flex flex-col justify-end border border-sky-100 bg-slate-900/40 shadow-sm hover:shadow-xl transition-shadow duration-300">
      {/* Background image */}
      <img
        src={book.img}
        alt={book.title}
        className="absolute inset-0 w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/55 to-transparent" />

      {/* Content */}
      <div className="relative z-10 p-4 flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center px-2 py-0.5 text-[0.7rem] font-semibold rounded-full bg-sky-500/25 text-sky-100 border border-sky-400/40">
            Recommended
          </span>
          <span className="text-[0.7rem] text-slate-200/80">
            For focused study
          </span>
        </div>
        <h3 className="font-semibold text-white text-base line-clamp-2">
          {book.title}
        </h3>
        <p className="text-sky-100/90 text-xs">by {book.author}</p>
        <p className="text-[0.78rem] text-slate-100/95 line-clamp-3">
          {book.description}
        </p>
        <button
          onClick={() => onReserve(book)}
          className="mt-3 inline-flex items-center justify-center gap-2 w-full py-2 rounded-xl bg-sky-500/90 hover:bg-sky-500 text-white text-xs font-semibold tracking-wide border border-sky-300/60 transition"
        >
          Reserve this book
        </button>
      </div>
    </article>
  );
}

function NotificationIcon({ type }) {
  if (type === "due") {
    return <AlertTriangle size={16} className="text-red-600" />;
  }
  if (type === "reservation") {
    return <Clock size={16} className="text-amber-600" />;
  }
  if (type === "system") {
    return <Info size={16} className="text-emerald-600" />;
  }
  return <Bell size={16} className="text-sky-600" />;
}

function NotificationItem({ notification }) {
  const base =
    notification.type === "due"
      ? "bg-red-50 text-red-800 border-red-100"
      : notification.type === "reservation"
      ? "bg-amber-50 text-amber-900 border-amber-100"
      : notification.type === "system"
      ? "bg-emerald-50 text-emerald-900 border-emerald-100"
      : "bg-sky-50 text-sky-900 border-sky-100";

  return (
    <div
      className={`flex items-start gap-3 p-3 rounded-xl border text-xs mb-2 ${base}`}
    >
      <div className="mt-0.5">
        <NotificationIcon type={notification.type} />
      </div>
      <p className="leading-snug">{notification.text}</p>
    </div>
  );
}

function BorrowedList({ borrowedBooks }) {
  if (!borrowedBooks.length) return null;

  return (
    <div className="bg-white/90 border border-sky-100 rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-sky-800 flex items-center gap-2">
          <Book size={16} />
          Borrowed books & due dates
        </h3>
      </div>
      <ul className="space-y-2 text-xs">
        {borrowedBooks.map((b, idx) => (
          <li
            key={idx}
            className="flex items-center justify-between rounded-xl bg-sky-50/60 px-3 py-2"
          >
            <span className="font-medium text-slate-900 truncate max-w-[60%]">
              {b.title}
            </span>
            <span className="text-[0.7rem] text-sky-700 font-semibold">
              Due: {b.due}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function UserHome() {
  const [user, setUser] = useState(mockUser);
  const [openNotifications, setOpenNotifications] = useState(false);
  const notifRef = useRef(null);
  const pageRef = useRef(null);

  // Close notification panel when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setOpenNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Simple entrance animation
  useEffect(() => {
    if (!pageRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".fade-up", {
        y: 16,
        opacity: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: "power2.out",
      });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  // ====== HANDLE RESERVATION FROM SUGGESTED BOOK ======
  const handleReserveSuggested = (book) => {
    const now = new Date();
    const expires = new Date(now);
    expires.setDate(expires.getDate() + 1); // 1 day expiry demo

    // read current reservations
    const all = readReservations();

    // push new reservation object (compatible with your other pages)
    const newReservation = {
      id: Date.now(),
      userEmail,
      book: {
        title: book.title,
        category: "Suggested",
        cover: book.img,
      },
      reservedAt: now.toISOString(),
      expiresAt: expires.toISOString(),
      status: "active",
    };

    const next = [...all, newReservation];
    writeReservations(next);

    // update local user state so the "Active reservations" stat increases
    setUser((prev) => ({
      ...prev,
      reservations: [
        ...prev.reservations,
        {
          title: book.title,
          reservedAt: now.toISOString(),
          expiresAt: expires.toISOString(),
        },
      ],
      notifications: [
        {
          text: `You reserved '${book.title}' from suggestions.`,
          type: "reservation",
        },
        ...prev.notifications,
      ],
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-slate-50 to-sky-100/60 px-4 py-6">
      {/* 90% width container */}
      <div
  ref={pageRef}
  className="w-[95%] mx-auto space-y-8 fade-up"
>
        {/* Topbar / Hero */}
        <header className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between fade-up">
          <div>
            <p className="text-xs font-semibold tracking-wide text-sky-600 uppercase mb-1">
              User dashboard
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
              Welcome back,{" "}
              <span className="text-sky-700">{user.name}</span> 👋
            </h1>
            <p className="mt-2 text-sm text-slate-600 max-w-xl">
              Track your borrowed books, reservations, and activity in one
              place. You can quickly see what’s due, what’s reserved, and what
              to read next.
            </p>
          </div>

          {/* Notification bell */}
          <div className="relative self-start sm:self-auto" ref={notifRef}>
            <button
              onClick={() => setOpenNotifications(!openNotifications)}
              className="relative flex items-center gap-2 px-3 py-2 rounded-full bg-white/80 backdrop-blur-md border border-sky-100 hover:bg-white shadow-sm hover:shadow-md transition"
            >
              {/* icon wrapper so badge doesn't overlap label */}
              <div className="relative">
                <Bell size={20} className="text-sky-700" />
                {user.notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                )}
              </div>
              <span className="hidden text-xs font-medium text-slate-700 sm:inline">
                Notifications
              </span>
            </button>

{openNotifications && (
  <div className="absolute right-0 mt-3 w-80 max-w-[85vw] bg-white/95 border border-sky-100 rounded-2xl shadow-xl p-4 z-[60]">
    <div className="flex items-center justify-between mb-2">
      <h3 className="font-semibold text-sky-800 text-sm">Notifications</h3>
      <span className="text-[0.7rem] text-slate-500">
        {user.notifications.length} unread
      </span>
    </div>

    <div className="max-h-64 overflow-y-auto pr-1">
      {user.notifications.length === 0 && (
        <p className="text-sky-600 text-xs">No new notifications</p>
      )}
      {user.notifications.map((n, idx) => (
        <NotificationItem key={idx} notification={n} />
      ))}
    </div>

  </div>
)}

          </div>
        </header>

        {/* Stats Row */}
          <section
            className={`relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 fade-up transition-all duration-300 ${
              openNotifications ? "mt-20" : "mt-6"
            }`}
          >
          <StatCard
            title="Books borrowed"
            value={user.borrowedBooks.length}
            icon={<Book size={18} />}
          />
          <StatCard
            title="Active reservations"
            value={3}
            icon={<Bookmark size={18} />}
          />
          <StatCard
            title="Outstanding fines"
            value={`₱${user.fines}`}
            icon={<CalendarCheck size={18} />}
            accent={user.fines > 0 ? "red" : "sky"}
          />
          <StatCard
            title="Unread notifications"
            value={user.notifications.length}
            icon={<Bell size={18} />}
          />
        </section>


        {/* Middle: Borrowed + Suggested */}
        <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-6 fade-up">
          {/* Left column – borrowed & quick info */}
          <div className="space-y-4">
            <BorrowedList borrowedBooks={user.borrowedBooks} />

            <div className="bg-sky-900 rounded-2xl p-4 text-sky-50 shadow-sm">
              <h3 className="text-sm font-semibold mb-1">
                Quick tip for avoiding overdue fines
              </h3>
              <p className="text-xs text-sky-100/95">
                Try to return or renew your books at least <b>one day</b>{" "}
                before the due date. Most libraries allow renewals online if
                there are no pending reservations on the book.
              </p>
            </div>
          </div>

          {/* Right column – suggested cards */}
          <div>
            <h2 className="text-sm font-semibold text-sky-800 mb-3">
              Suggested for you
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {suggestedBooks.map((book) => (
                <SuggestedBookCard
                  key={book.id}
                  book={book}
                  onReserve={handleReserveSuggested}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Recent Activity */}
        <section className="fade-up">
          <h2 className="text-sm font-semibold text-sky-800 mb-3">
            Recent activity
          </h2>
          <div className="bg-white/90 border border-sky-100 rounded-3xl p-4 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-sky-50/70 border-b border-sky-100 text-[0.7rem] text-sky-700 uppercase tracking-wide">
                    <th className="py-2.5 px-4">Activity</th>
                    <th className="py-2.5 px-4 w-40">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {user.recentActivities.map((r, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-sky-50/70 transition border-b last:border-b-0 border-slate-100"
                    >
                      <td className="py-2.5 px-4 text-slate-900 text-xs">
                        {r.text}
                      </td>
                      <td className="py-2.5 px-4 text-slate-600 text-[0.72rem]">
                        {r.time}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
