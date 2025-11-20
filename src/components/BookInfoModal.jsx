// src/components/BookInfoModal.jsx
import { motion, AnimatePresence } from 'framer-motion';
import { XCircle } from 'lucide-react';

export default function BookInfoModal({ book, onClose }) {
  return (
    <AnimatePresence>
      {book && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-2xl p-6 w-96 max-h-[80vh] overflow-y-auto relative"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-red-500 hover:text-red-700"
              title="Close"
            >
              <XCircle size={22} />
            </button>

            <img
              src={book.cover || '/default-book.png'}
              alt={book.title}
              className="w-full h-64 object-cover rounded-md mb-4"
            />

            <h2 className="text-xl font-bold text-sky-800">{book.title}</h2>
            <p className="text-sm text-sky-600">{book.author}</p>
            <p className="text-sm text-sky-500 mt-1">{book.category}</p>
            <p className="mt-2 text-sky-700">{book.description}</p>

            <div className="mt-4 flex justify-between items-center">
              <div className={`text-sm font-semibold ${book.available ? 'text-green-600' : 'text-red-500'}`}>
                {book.available ? 'Available' : 'Not Available'}
              </div>
              {book.available && <div className="text-sm text-sky-600 italic">Click to reserve</div>}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
