// src/librarian/AddBook.jsx
import React, { useState } from "react";
import QRGenerator from "../components/QRGenerator";
import { addBook } from "../services/fakeBackend";

export default function AddBook() {
  const [form, setForm] = useState({
    title: "",
    author: "",
    publisher: "",
    year: "",
    category: "",
    description: "",
    copies: "",
  });
  const [bookId, setBookId] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.title || !form.author) {
      alert("Please fill out the Title and Author fields.");
      return;
    }

    const newBook = addBook(form);
    setBookId(newBook.id);

    alert(`✅ Book "${form.title}" added successfully!`);
    setForm({
      title: "",
      author: "",
      publisher: "",
      year: "",
      category: "",
      description: "",
      copies: "",
    });
  };

  return (
    <div className="min-h-screen w-full px-6 md:px-10 py-10 overflow-y-auto bg-gradient-to-b from-[#EAF2FB] via-[#E2ECFA] to-[#D8E6F8] text-[#1E3A5F]">
      {/* HEADER */}
      <div className="max-w-6xl mx-auto mb-10">
        <h2 className="text-3xl md:text-4xl font-extrabold text-sky-700 drop-shadow-sm">
          Add New Book
        </h2>
        <p className="text-sky-800/70 text-sm md:text-base mt-1">
          Encode a new title, then generate a QR code that can be used during
          borrowing and inventory.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 max-w-6xl mx-auto"
      >
        {/* LEFT COLUMN */}
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-semibold text-sky-800 mb-1 uppercase tracking-wide">
              Book Title *
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g., The Great Gatsby"
              required
              className="w-full p-3 rounded-xl bg-white/60 border border-white/40 text-sky-900 placeholder-sky-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-400 backdrop-blur-sm transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-sky-800 mb-1 uppercase tracking-wide">
              Author *
            </label>
            <input
              type="text"
              name="author"
              value={form.author}
              onChange={handleChange}
              placeholder="e.g., F. Scott Fitzgerald"
              required
              className="w-full p-3 rounded-xl bg-white/60 border border-white/40 text-sky-900 placeholder-sky-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-400 backdrop-blur-sm transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-sky-800 mb-1 uppercase tracking-wide">
              Publisher
            </label>
            <input
              type="text"
              name="publisher"
              value={form.publisher}
              onChange={handleChange}
              placeholder="e.g., Penguin Random House"
              className="w-full p-3 rounded-xl bg-white/60 border border-white/40 text-sky-900 placeholder-sky-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-400 backdrop-blur-sm transition"
            />
          </div>
        </div>

        {/* MIDDLE COLUMN */}
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-semibold text-sky-800 mb-1 uppercase tracking-wide">
              Year Published
            </label>
            <input
              type="number"
              name="year"
              value={form.year}
              onChange={handleChange}
              placeholder="e.g., 2023"
              className="w-full p-3 rounded-xl bg-white/60 border border-white/40 text-sky-900 placeholder-sky-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-400 backdrop-blur-sm transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-sky-800 mb-1 uppercase tracking-wide">
              Category
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-white/60 border border-white/40 text-sky-900 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-400 backdrop-blur-sm transition"
            >
              <option value="">Select Category</option>
              <option>Computer Science</option>
              <option>Fiction</option>
              <option>Non-Fiction</option>
              <option>Science</option>
              <option>History</option>
              <option>Education</option>
              <option>Business</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-sky-800 mb-1 uppercase tracking-wide">
              Copies Available
            </label>
            <input
              type="number"
              name="copies"
              value={form.copies}
              onChange={handleChange}
              placeholder="e.g., 5"
              className="w-full p-3 rounded-xl bg-white/60 border border-white/40 text-sky-900 placeholder-sky-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-400 backdrop-blur-sm transition"
            />
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6 flex flex-col justify-between">
          <div>
            <label className="block text-xs font-semibold text-sky-800 mb-1 uppercase tracking-wide">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="7"
              placeholder="Write a short description about the book..."
              className="w-full p-3 rounded-xl bg-white/60 border border-white/40 text-sky-900 placeholder-sky-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-400 backdrop-blur-sm transition resize-none"
            />
          </div>

          <div className="text-center mt-auto">
            <h3 className="text-lg font-semibold text-sky-700 mb-3">
              Book QR Code
            </h3>
            {bookId ? (
              <div className="inline-block bg-white/70 p-4 rounded-xl border border-sky-500/30 backdrop-blur-sm shadow-md">
                <QRGenerator value={`BOOK:${bookId}`} />
                <p className="text-sm text-sky-900/70 mt-2">Book ID: {bookId}</p>
              </div>
            ) : (
              <p className="text-sky-700/60 text-sm">
                QR preview will appear after saving.
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-700 font-semibold text-white transition mt-4 shadow-lg"
          >
            Save Book
          </button>
        </div>
      </form>
    </div>
  );
}
