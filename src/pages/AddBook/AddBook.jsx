import React, { useState } from "react";
import QRGenerator from "../../components/QRGenerator";
import { addBook } from "../../services/fakeBackend";

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
    <div className="min-h-screen w-full px-10 py-12 overflow-y-auto bg-gradient-to-b from-[#EAF2FB] via-[#E2ECFA] to-[#D8E6F8] text-[#1E3A5F]">
      {/* HEADER */}
      <h2 className="text-4xl font-extrabold text-sky-700 mb-10 text-center drop-shadow-md">
        Add New Book
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 max-w-7xl mx-auto"
      >
        {/* LEFT COLUMN */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm text-sky-800 mb-1">Book Title *</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g., The Great Gatsby"
              required
              className="w-full p-3 rounded-xl bg-white/50 border border-white/40 text-sky-900 placeholder-sky-500 focus:outline-none focus:border-sky-500 backdrop-blur-sm transition"
            />
          </div>

          <div>
            <label className="block text-sm text-sky-800 mb-1">Author *</label>
            <input
              type="text"
              name="author"
              value={form.author}
              onChange={handleChange}
              placeholder="e.g., F. Scott Fitzgerald"
              required
              className="w-full p-3 rounded-xl bg-white/50 border border-white/40 text-sky-900 placeholder-sky-500 focus:outline-none focus:border-sky-500 backdrop-blur-sm transition"
            />
          </div>

          <div>
            <label className="block text-sm text-sky-800 mb-1">Publisher</label>
            <input
              type="text"
              name="publisher"
              value={form.publisher}
              onChange={handleChange}
              placeholder="e.g., Penguin Random House"
              className="w-full p-3 rounded-xl bg-white/50 border border-white/40 text-sky-900 placeholder-sky-500 focus:outline-none focus:border-sky-500 backdrop-blur-sm transition"
            />
          </div>
        </div>

        {/* MIDDLE COLUMN */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm text-sky-800 mb-1">Year Published</label>
            <input
              type="number"
              name="year"
              value={form.year}
              onChange={handleChange}
              placeholder="e.g., 2023"
              className="w-full p-3 rounded-xl bg-white/50 border border-white/40 text-sky-900 placeholder-sky-500 focus:outline-none focus:border-sky-500 backdrop-blur-sm transition"
            />
          </div>

          <div>
            <label className="block text-sm text-sky-800 mb-1">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-white/50 border border-white/40 text-sky-900 placeholder-sky-500 focus:outline-none focus:border-sky-500 backdrop-blur-sm transition"
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
            <label className="block text-sm text-sky-800 mb-1">Copies Available</label>
            <input
              type="number"
              name="copies"
              value={form.copies}
              onChange={handleChange}
              placeholder="e.g., 5"
              className="w-full p-3 rounded-xl bg-white/50 border border-white/40 text-sky-900 placeholder-sky-500 focus:outline-none focus:border-sky-500 backdrop-blur-sm transition"
            />
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6 flex flex-col justify-between">
          <div>
            <label className="block text-sm text-sky-800 mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="7"
              placeholder="Write a short description about the book..."
              className="w-full p-3 rounded-xl bg-white/50 border border-white/40 text-sky-900 placeholder-sky-500 focus:outline-none focus:border-sky-500 backdrop-blur-sm transition"
            />
          </div>

          <div className="text-center mt-auto">
            <h3 className="text-lg font-semibold text-sky-700 mb-3">Book QR Code</h3>
            {bookId ? (
              <div className="inline-block bg-white/50 p-4 rounded-xl border border-sky-500/30 backdrop-blur-sm">
                <QRGenerator value={`BOOK:${bookId}`} />
                <p className="text-sm text-sky-900/70 mt-2">Book ID: {bookId}</p>
              </div>
            ) : (
              <p className="text-sky-700/50 text-sm">QR preview will appear after saving.</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-700 font-semibold text-white transition mt-6 shadow-lg"
          >
            Save Book
          </button>
        </div>
      </form>
    </div>
  );
}
