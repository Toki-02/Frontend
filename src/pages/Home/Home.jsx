// src/pages/Home/Home.jsx
import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, FileText, PlusSquare, UserPlus, Sparkles } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();
  const guideRef = useRef(null);

  const scrollToGuide = () => {
    guideRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fadeIn = (delay = 0) => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { delay, duration: 0.6, ease: "easeOut" },
    },
  });

  const cards = [
    {
      title: "Borrow / Return",
      description: "Scan face + book QR to borrow or return instantly.",
      path: "/borrow-return",
      icon: <BookOpen size={44} className="text-sky-600" />,
    },
    {
      title: "View Logs",
      description: "Scan registered faces or use manual entry to log attendance and transactions.",
      path: "/face-recognition",
      icon: <FileText size={44} className="text-sky-600" />,
    },
    {
      title: "Add New Book",
      description: "Add book entry and generate printable QR.",
      path: "/add-book",
      icon: <PlusSquare size={44} className="text-sky-600" />,
    },
    {
      title: "Register New User",
      description: "Register user details and capture face.",
      path: "/register-face",
      icon: <UserPlus size={44} className="text-sky-600" />,
    },
  ];

  const guides = [
    {
      img: "https://analyticsindiamag.com/wp-content/uploads/2020/04/Learn-Facial-Recognition-scaled.jpg",
      title: "Borrow / Return",
      text: "Scan the patron’s face and then scan the book QR to borrow or return. The system instantly updates inventory and logs the transaction automatically, making the process fast and efficient.",
    },
    {
      img: "https://media.qrtiger.com/blog/2023/08/books-on-qr-codejpg_800_89.jpeg",
      title: "View Logs",
      text: "Use face scan for registered users to automatically log attendance or transactions. For visitors or unregistered users, manual logging is available to keep track of all activities seamlessly.",
    },
    {
      img: "https://as2.ftcdn.net/v2/jpg/08/77/46/17/1000_F_877461743_Xu9Tjajx67CoWhn97BWfRfSe9XPXZ60z.jpg",
      title: "Register a New User",
      text: "Librarians add the new user’s details and capture a face image. The face template is securely stored for quick identity checks during future loans.",
    },
    {
      img: "https://www.teachermagazine.com/assets/images/teacher/_1200x630_crop_center-center_82_none/Most_borrowed_books_1.jpg?mtime=1594271876",
      title: "Add New Books & QR Codes",
      text: "Create book records and generate printable QR codes. Each copy gets a unique code for accurate copy-level tracking and fast checkout.",
    },
  ];

  return (
    <div className="min-h-screen w-full relative overflow-x-hidden bg-gradient-to-b from-[#EAF2FB] via-[#E2ECFA] to-[#D8E6F8] text-[#1E3A5F]">
      {/* HERO */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={fadeIn(0.2)}
        className="relative z-10 w-full px-6 sm:px-12 lg:px-24 pt-24 pb-12 text-center"
      >
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-sky-700 drop-shadow-md leading-tight">
          Library Face Recognition System
        </h1>
        <p className="mt-6 text-xl sm:text-2xl text-sky-900/80 mx-auto leading-relaxed max-w-3xl">
          A modern library system using{" "}
          <span className="text-sky-600 font-semibold">facial recognition</span> and{" "}
          <span className="text-sky-600 font-semibold">QR automation</span> for faster and smarter management.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <button
            onClick={scrollToGuide}
            className="inline-flex items-center gap-2 border border-sky-400 text-sky-700 px-6 py-2 rounded-lg hover:bg-sky-50 transition"
          >
            <Sparkles size={18} /> Learn More
          </button>
        </div>
      </motion.section>

      {/* FEATURE CARDS */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="relative z-10 w-full px-6 sm:px-12 lg:px-24 mb-20"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {cards.map((card, idx) => (
            <motion.div
              key={idx}
              variants={fadeIn(idx * 0.15)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover={{ scale: 1.04, transition: { duration: 0.2 } }}
              className="cursor-pointer bg-white/90 backdrop-blur-sm border border-sky-100 rounded-3xl p-8 flex flex-col items-start justify-center hover:shadow-[0_18px_60px_rgba(56,189,248,0.15)] transition-all"
              onClick={() => navigate(card.path)}
            >
              <div className="mb-4">{card.icon}</div>
              <h3 className="text-2xl font-semibold text-sky-700 mb-2">{card.title}</h3>
              <p className="text-sky-900/80">{card.description}</p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(card.path);
                }}
                className="mt-4 text-sm text-sky-600 hover:underline"
              >
                Open
              </button>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* GUIDE SECTIONS */}
      <section ref={guideRef} className="relative z-10 w-full px-6 sm:px-12 lg:px-24 pb-32">
        <motion.h2
          variants={fadeIn(0.2)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl font-bold text-sky-700 mb-8 text-center"
        >
          How the Library System Works
        </motion.h2>
        <motion.p
          variants={fadeIn(0.3)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-sky-900/70 text-center max-w-3xl mx-auto mb-12 leading-relaxed text-lg"
        >
          A step-by-step look at registration, tagging, borrowing, returning, and logging — made simple and efficient.
        </motion.p>

        <div className="space-y-20">
          {guides.map((g, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.6 }}
              className={`flex flex-col md:flex-row items-center gap-10 ${i % 2 ? "md:flex-row-reverse" : ""}`}
            >
              <div className="md:w-1/2 w-full overflow-hidden rounded-2xl shadow-xl relative group">
                <img
                  src={g.img}
                  alt={g.title}
                  className="object-cover w-full h-72 md:h-[420px] rounded-2xl transform transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="md:w-1/2 w-full text-center md:text-left">
                <h3 className="text-2xl font-semibold text-sky-700 mb-4">{g.title}</h3>
                <p className="text-sky-900/80 leading-relaxed text-lg">{g.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <footer className="relative z-10 w-full py-8 bg-sky-50 text-sky-900/70 text-sm text-center border-t border-sky-100">
        © {new Date().getFullYear()} Rizal Provincial Library and Information System
      </footer>
    </div>
  );
}
