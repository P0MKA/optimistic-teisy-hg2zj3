import { useState, useEffect } from "react";
import BooksList from "./components/books-list";
import AuthorsList from "./components/authors-list";
import AuthorBookList from "./components/author-books-list";
import NotFound404 from "./components/not-found";
import { BrowserRouter, Route, Routes, Link, Navigate } from "react-router-dom";

export default function App() {
  const author1 = { id: 1, name: "Грин", birthdayYear: 1880 };
  const author2 = { id: 2, name: "Пушкин", birthdayYear: 1799 };
  const [authors, setAuthors] = useState([]);
  const book1 = { id: 1, name: "Алые паруса", author: author1 };
  const book2 = { id: 2, name: "Золотая цепь", author: author1 };
  const book3 = { id: 3, name: "Пиковая дама", author: author2 };
  const book4 = { id: 4, name: "Руслан и Людмила", author: author2 };
  const [books, setBooks] = useState([]);

  useEffect(() => {
    setAuthors([author1, author2]);
    setBooks([book1, book2, book3, book4]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [] );

  return (
    <div className="App">
      <h1>Hello ❤️ teisy</h1>
      <h2>Start editing to see some magic happen!</h2>

      <BrowserRouter>
        <nav>
          <ul>
            <li>
              <Link to="/">Authors</Link>
            </li>
            <li>
              <Link to="/books">Books</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Navigate to="authors" />} />
          <Route path="authors" element={<AuthorsList items={authors} />} />
          <Route path="author/:id" element={<AuthorBookList items={books} />} />
          <Route path="books" element={<BooksList items={books} />} />
          <Route path="*" element={<NotFound404 />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}




