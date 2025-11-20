import React, { useState } from "react";
import { gsap } from "gsap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/**
 * Browse page — shows books grouped by 3 categories (Fiction, Dystopian, Fantasy).
 * Clicking a card opens full info; from modal you can Add to Cart.
 * Cart stored in localStorage under "rp_cart".
 */

// DO NOT CHANGE LINKS – using exactly what you provided
const BOOKS = [
  // Fiction Category
  {
    id: 1,
    cover: "https://www.themoviedb.org/t/p/original/nwJbVKauPDgJVQgT7SQpVTVN4gA.jpg",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    category: "Fiction",
    year: 1925,
    description: "A novel set in the Jazz Age about Jay Gatsby and Daisy Buchanan.",
    preview: "A novel set in the Jazz Age exploring love, wealth, and tragedy.",
    available: true,
  },
  {
    id: 2,
    cover: "https://m.media-amazon.com/images/I/81qZ5kGMQ1L.jpg",
    title: "1984",
    author: "George Orwell",
    category: "Fiction",
    year: 1949,
    description: "A dystopian novel about totalitarianism and surveillance.",
    preview: "A powerful exploration of a totalitarian regime's control over its citizens.",
    available: true,
  },
  {
    id: 3,
    cover: "https://cdn2.penguin.com.au/covers/original/9780434020485.jpg",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    category: "Fiction",
    year: 1960,
    description: "A story of racial injustice in the American South.",
    preview: "A deep dive into the racial tensions and injustices in the Deep South.",
    available: false,
  },
  {
    id: 4,
    cover: "https://cdn.britannica.com/94/181394-050-2F76F7EE/Reproduction-cover-edition-The-Catcher-in-the.jpg",
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    category: "Fiction",
    year: 1951,
    description: "The story of Holden Caulfield's adventures in New York.",
    preview: "A young man reflects on his alienation and dissatisfaction with the world.",
    available: true,
  },
  {
    id: 5,
    cover: "https://www.tolkienbooks.us/wp-content/uploads/2017/07/1973-us-hob-mmpb-54th-fc.jpg",
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    category: "Fiction",
    year: 1937,
    description: "Bilbo Baggins' journey to the Lonely Mountain.",
    preview: "A tale of adventure and friendship, as Bilbo faces giants and dragons.",
    available: true,
  },
  {
    id: 6,
    cover: "https://m.media-amazon.com/images/I/71ehaxdY6gL._SL1500_.jpg",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    category: "Fiction",
    year: 1813,
    description: "The emotional development of Elizabeth Bennet.",
    preview:
      "A classic romance about love, class, and misunderstandings in early 19th-century England.",
    available: false,
  },
  {
    id: 7,
    cover: "https://mir-s3-cdn-cf.behance.net/project_modules/1400/b10813108999295.5fc9b420aba72.png",
    title: "Moby Dick",
    author: "Herman Melville",
    category: "Fiction",
    year: 1851,
    description: "Captain Ahab's obsessive quest for the white whale.",
    preview: "A complex narrative of obsession, revenge, and the quest for meaning.",
    available: true,
  },
  {
    id: 8,
    cover: "https://m.media-amazon.com/images/I/610lXubhjYL._SL1070_.jpg",
    title: "War and Peace",
    author: "Leo Tolstoy",
    category: "Fiction",
    year: 1869,
    description: "The impact of Napoleon’s invasion of Russia.",
    preview: "An epic tale of love, war, and personal growth against the backdrop of history.",
    available: true,
  },
  {
    id: 9,
    cover: "https://images-na.ssl-images-amazon.com/images/I/71aFt4%2BOTOL.jpg",
    title: "The Alchemist",
    author: "Paulo Coelho",
    category: "Fiction",
    year: 1988,
    description: "Santiago's quest for treasure in Egypt.",
    preview: "A journey of self-discovery and the pursuit of one's personal legend.",
    available: true,
  },
  {
    id: 10,
    cover:
      "http://3.bp.blogspot.com/-mzMGVbURrVU/UVsatlaxEkI/AAAAAAAARe0/c5KXMZSUIjA/s0/Harry+Potter+and+the+Sorcerer's+Stone+2001+poster.jpg",
    title: "Harry Potter and the Sorcerer's Stone",
    author: "J.K. Rowling",
    category: "Fiction",
    year: 1997,
    description: "Harry's first year at Hogwarts School of Witchcraft and Wizardry.",
    preview:
      "A young boy discovers his magical heritage and begins his journey in the wizarding world.",
    available: true,
  },
  {
    id: 11,
    cover: "https://m.media-amazon.com/images/I/91riWhj7E3L.jpg",
    title: "The Da Vinci Code",
    author: "Dan Brown",
    category: "Fiction",
    year: 2003,
    description: "A religious mystery unraveled by a cryptologist.",
    preview: "A fast-paced thriller that mixes art, history, and conspiracy.",
    available: false,
  },
  {
    id: 12,
    cover: "https://cdn1.booknode.com/book_cover/944/full/hunger-games-tome-1-943766.jpg",
    title: "The Hunger Games",
    author: "Suzanne Collins",
    category: "Fiction",
    year: 2008,
    description: "Children are forced to participate in a televised death match.",
    preview: "A dystopian survival story about rebellion and societal control.",
    available: true,
  },

  // Dystopian Category
  {
    id: 13,
    cover: "https://cdn2.penguin.com.au/covers/original/9781784876258.jpg",
    title: "Brave New World",
    author: "Aldous Huxley",
    category: "Dystopian",
    year: 1932,
    description: "A futuristic society based on genetic engineering.",
    available: true,
  },
  {
    id: 14,
    cover: "https://mpd-biblio-covers.imgix.net/9780809051014.jpg",
    title: "Fahrenheit 451",
    author: "Ray Bradbury",
    category: "Dystopian",
    year: 1953,
    description: "A society where books are burned to maintain control.",
    available: true,
  },
  {
    id: 15,
    cover: "https://cdn2.penguin.com.au/covers/original/9781784871444.jpg",
    title: "The Handmaid's Tale",
    author: "Margaret Atwood",
    category: "Dystopian",
    year: 1985,
    description: "A woman in a totalitarian society is forced to be a surrogate mother.",
    available: true,
  },
  {
    id: 16,
    cover: "http://lh3.ggpht.com/_-woJV62rwZs/Sz6nmwcVYiI/AAAAAAAAArg/Eb_pk-xXjwA/s1600/TheRoad.jpg",
    title: "The Road",
    author: "Cormac McCarthy",
    category: "Dystopian",
    year: 2006,
    description: "A father and son struggle to survive in a post-apocalyptic world.",
    available: true,
  },
  {
    id: 17,
    cover:
      "https://images.thalia.media/-/BF2000-2000/58cf1f21538741a98b7304f57655e196/never-let-me-go-taschenbuch-kazuo-ishiguro-englisch.jpeg",
    title: "Never Let Me Go",
    author: "Kazuo Ishiguro",
    category: "Dystopian",
    year: 2005,
    description: "Clones' lives are fated for organ donation.",
    available: false,
  },
  {
    id: 18,
    cover:
      "https://i.cbc.ca/1.4149361.1535143044!/fileImage/httpImage/image.jpg_gen/derivatives/original_1180/book-cover-the-giver-by-lois-lowry.jpg",
    title: "The Giver",
    author: "Lois Lowry",
    category: "Dystopian",
    year: 1993,
    description: "A dystopian society where emotions are suppressed.",
    available: true,
  },
  {
    id: 19,
    cover: "https://www.themoviedb.org/t/p/original/8pf1jKMcmhm0REsYfd0jEJxDS3i.jpg",
    title: "The Maze Runner",
    author: "James Dashner",
    category: "Dystopian",
    year: 2009,
    description: "A group of young people must escape a maze.",
    available: true,
  },
  {
    id: 20,
    cover: "https://cdn.dc5.ro/img-prod/987210661-0.jpeg",
    title: "The Stand",
    author: "Stephen King",
    category: "Dystopian",
    year: 1978,
    description: "A pandemic wipes out most of humanity.",
    available: true,
  },
  {
    id: 21,
    cover:
      "http://library.jodan-design.com/wp-content/uploads/2015/04/The-Forever-War-by-Joe-Haldeman.jpg",
    title: "The Forever War",
    author: "Joe Haldeman",
    category: "Dystopian",
    year: 1974,
    description: "A soldier fights in an interstellar war.",
    available: true,
  },
  {
    id: 22,
    cover:
      "https://media1.popsugar-assets.com/files/thumbor/BlVCWSq2wx5kqJwzewNdQVZyzWE/fit-in/728xorig/filters:format_auto-!!-:strip_icc-!!-/2020/08/17/681/n/44701584/14d968a508b4f53d_91qo_zL-btL/i/Oryx-Crake-by-Margaret-Atwood.jpg",
    title: "Oryx and Crake",
    author: "Margaret Atwood",
    category: "Dystopian",
    year: 2003,
    description: "A man reflects on a world ravaged by genetic engineering.",
    available: true,
  },
  {
    id: 37,
    cover:
      "https://cdn.gramedia.com/uploads/picture_meta/2023/2/14/f2wwzdkqttrbj7xkhnecms.jpg",
    title: "The Power",
    author: "Naomi Alderman",
    category: "Dystopian",
    year: 2016,
    description:
      "In a world where women develop the power to generate electric shocks, society shifts as power dynamics are turned upside down.",
    available: true,
  },
  {
    id: 38,
    cover: "https://m.media-amazon.com/images/I/81ORSMLAPrL._SL1000_.jpg",
    title: "Cloud Atlas",
    author: "David Mitchell",
    category: "Dystopian",
    year: 2004,
    description:
      "A multi-layered story spanning centuries, culminating in a dystopian future shaped by the consequences of humanity's past.",
    available: true,
  },

  // Fantasy Category
  {
    id: 25,
    cover: "https://media.s-bol.com/NPXlqXzol7N/546x840.jpg",
    title: "The Name of the Wind",
    author: "Patrick Rothfuss",
    category: "Fantasy",
    year: 2007,
    description: "The story of Kvothe, a man of many talents and secrets.",
    available: true,
  },
  {
    id: 26,
    cover: "https://media.s-bol.com/qxR4g6PLr0P2/732x1200.jpg",
    title: "The Lies of Locke Lamora",
    author: "Scott Lynch",
    category: "Fantasy",
    year: 2006,
    description: "A thief’s tale in a world of high adventure and crime.",
    available: true,
  },
  {
    id: 27,
    cover:
      "https://cdn.kobo.com/book-images/ae556d3b-0e16-4f8b-93f1-4fc9371cb238/353/569/90/False/mistborn-3.jpg",
    title: "Mistborn",
    author: "Brandon Sanderson",
    category: "Fantasy",
    year: 2006,
    description:
      "A group of rebels with the power of mist-born abilities fight a dark lord.",
    available: true,
  },
  {
    id: 28,
    cover: "https://eisd5zdq43b.exactdn.com/wp-content/uploads/2023/06/the-way-of-kings-667x1024.jpg?strip=all&lossy=1&ssl=1",
    title: "The Way of Kings",
    author: "Brandon Sanderson",
    category: "Fantasy",
    year: 2010,
    description: "The first book in the Stormlight Archives.",
    available: true,
  },
  {
    id: 29,
    cover: "https://media.s-bol.com/qxR4g6PLr0P2/732x1200.jpg",
    title: "The Lies of Locke Lamora",
    author: "Scott Lynch",
    category: "Fantasy",
    year: 2006,
    description: "A thief’s tale in a world of high adventure and crime.",
    available: true,
  },
  {
    id: 30,
    cover:
      "https://cdn.kobo.com/book-images/73a7aebd-0bc0-4d63-a4f7-865af7f48bef/1200/1200/False/a-game-of-thrones-a-song-of-ice-and-fire-book-1.jpg",
    title: "A Game of Thrones",
    author: "George R.R. Martin",
    category: "Fantasy",
    year: 1996,
    description: "Noble families battle for control of the Seven Kingdoms.",
    available: true,
  },
  {
    id: 31,
    cover: "https://m.media-amazon.com/images/I/91zROLPFLbL._SL1500_.jpg",
    title: "The Black Prism",
    author: "Brent Weeks",
    category: "Fantasy",
    year: 2010,
    description: "A master of color battles an empire of dark forces.",
    available: true,
  },
  {
    id: 32,
    cover: "https://illustrationwest.org/56/files/2017/10/Hancock-L-17Spr-ILLU463-Burns-A1-Bookcovers01-SCAD-ATL.jpg",
    title: "The Final Empire",
    author: "Brandon Sanderson",
    category: "Fantasy",
    year: 2006,
    description: "The last remaining survivors of a fallen empire fight for their freedom.",
    available: true,
  },
 {
  id: 33,
  cover: "https://m.media-amazon.com/images/I/91ykeDrPLqL._SL1500_.jpg",
  title: "One Piece, Vol. 1: Romance Dawn",
  author: "Eiichiro Oda",
  category: "Fantasy",
  year: 1997,
  description:
    "The beginning of Monkey D. Luffy’s fearless journey to become King of the Pirates, as he gathers his first crewmates and sets sail toward the Grand Line.",
  preview:
    "Follow Luffy, a boy with a rubber body and an impossible dream, as he leaves his hometown to hunt for the legendary treasure known as the One Piece.",
  available: true,
},
  {
    id: 34,
    cover: "https://m.media-amazon.com/images/I/91NXdVnMoGL._SL1500_.jpg",
    title: "The Priory of the Orange Tree",
    author: "Samantha Shannon",
    category: "Fantasy",
    year: 2019,
    description: "A world of dragons, magic, and forbidden love.",
    available: true,
  },
  {
    id: 35,
    cover: "https://www.blackgate.com/wp-content/uploads/2017/03/City-of-Stairs.jpg",
    title: "City of Stairs",
    author: "Robert Jackson Bennett",
    category: "Fantasy",
    year: 2014,
    description: "A city once ruled by gods now struggles to maintain power.",
    available: true,
  },
  {
    id: 36,
    cover: "https://i.pinimg.com/originals/53/07/33/5307334dd5a7d19bb00357d620bd8138.jpg",
    title: "The Shadow of the Wind",
    author: "Carlos Ruiz Zafón",
    category: "Fantasy",
    year: 2001,
    description:
      "A boy becomes obsessed with a mysterious author whose books are being destroyed.",
    available: true,
  },

  {
  id: 37,
  cover: "https://m.media-amazon.com/images/I/91ykeDrPLqL._SL1500_.jpg",
  title: "One Piece, Vol. 1: Romance Dawn",
  author: "Eiichiro Oda",
  category: "Fiction",
  year: 1997,
  description:
    "The beginning of Monkey D. Luffy’s fearless journey to become King of the Pirates, as he gathers his first crewmates and sets sail toward the Grand Line.",
  preview:
    "Follow Luffy, a boy with a rubber body and an impossible dream, as he leaves his hometown to hunt for the legendary treasure known as the One Piece.",
  available: true,
},


];

const CART_KEY = "rp_cart";

export default function UserBrowseBooks() {
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    } catch {
      return [];
    }
  });

  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");

  const saveCart = (next) => {
    setCart(next);
    localStorage.setItem(CART_KEY, JSON.stringify(next));
  };

  const addToCart = (book) => {
    if (!book.available) {
      toast.warn("Book not available");
      return;
    }
    const exists = cart.find((c) => c.id === book.id);
    if (exists) {
      toast.info("Already in cart");
      return;
    }
    const next = [...cart, { ...book }];
    saveCart(next);
    toast.success(`Added "${book.title}" to cart`);
  };

  const filterByCategory = (category) => {
    const q = search.trim().toLowerCase();
    return BOOKS.filter((book) => {
      if (book.category !== category) return false;
      if (!q) return true;

      const haystack = `
        ${book.title || ""}
        ${book.author || ""}
        ${book.category || ""}
        ${book.description || ""}
        ${book.preview || ""}
      `.toLowerCase();

      return haystack.includes(q);
    });
  };

  const fictionBooks = filterByCategory("Fiction");
  const dystopianBooks = filterByCategory("Dystopian");
  const fantasyBooks = filterByCategory("Fantasy");

  const renderCategoryRow = (label, books) => (
    <div className="mb-6">
      <h3 className="text-xl font-semibold text-sky-700 mb-4">{label}</h3>
      {books.length === 0 ? (
        <div className="text-sky-600 text-sm">No books match your search in this category.</div>
      ) : (
        <div className="flex gap-6 overflow-x-auto pb-6">
          {books.map((book) => (
            <div
              key={book.id}
              className="group relative flex flex-col min-w-[250px] h-[350px] rounded-xl overflow-hidden border-2 border-sky-700 cursor-pointer transition-transform duration-300 hover:-translate-y-1"
              onClick={() => setSelected(book)}
            >
              <img
                src={book.cover}
                alt={book.title}
                className="w-full h-full object-cover rounded-lg transform transition duration-300 ease-in-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black opacity-40" />
              <div className="p-3 text-white flex-1 flex flex-col justify-between relative z-10">
                <div>
                  <h3 className="text-lg font-semibold line-clamp-2">{book.title}</h3>
                  <p className="text-sm opacity-80">{book.category}</p>
                  {book.preview && (
                    <p className="text-xs mt-2 line-clamp-3">{book.preview}</p>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(book);
                  }}
                  className="mt-2 px-3 py-1 rounded-md bg-white/10 border border-white/30 text-white text-sm hover:bg-white/20"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="p-6 min-h-screen">
      <ToastContainer />

      {/* Header with search (same line) */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
        <h2 className="text-2xl font-bold text-sky-700">Browse Books</h2>

        <div className="w-full sm:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, author, or category..."
            className="w-full rounded-full border border-sky-200 bg-white/80 px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
          />
        </div>
      </div>

      {/* Fiction */}

      {renderCategoryRow("Fiction", fictionBooks)}

      {/* Dystopian */}
      {renderCategoryRow("Dystopian", dystopianBooks)}

      {/* Fantasy */}
      {renderCategoryRow("Fantasy", fantasyBooks)}

      {/* Full Info Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-start overflow-auto z-50 pt-10 pb-10">
          <div className="bg-white rounded-xl w-[560px] max-w-[95%] p-6 relative">
            <button
              onClick={() => setSelected(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-900 text-xl font-bold"
            >
              &times;
            </button>
            <img
              src={selected.cover}
              alt={selected.title}
              className="w-full h-64 object-cover rounded-md mb-4"
            />
            <h3 className="text-2xl font-bold mb-2">{selected.title}</h3>
            <p className="mb-1">
              <span className="font-semibold">Author:</span> {selected.author}
            </p>
            <p className="mb-1">
              <span className="font-semibold">Category:</span> {selected.category}
            </p>
            <p className="mb-1">
              <span className="font-semibold">Year:</span> {selected.year}
            </p>
            <p className="mb-3">{selected.description}</p>
            {selected.preview && (
              <p className="mb-3 text-sm text-gray-600">
                <strong>Preview:</strong> {selected.preview}
              </p>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => {
                  addToCart(selected);
                  setSelected(null);
                }}
                className={`px-4 py-2 rounded-md text-white font-semibold ${
                  selected.available ? "bg-green-600 hover:bg-green-700" : "bg-gray-400"
                }`}
                disabled={!selected.available}
              >
                {selected.available ? "Add to Cart" : "Not Available"}
              </button>

              <button
                onClick={() => setSelected(null)}
                className="px-4 py-2 rounded-md border border-sky-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
