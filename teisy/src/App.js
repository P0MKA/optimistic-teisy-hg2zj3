import { useState, useEffect } from "react";
import BooksList from "./components/books-list";
import AuthorsList from "./components/authors-list";
import AuthorBookList from "./components/author-books-list";
import NotFound404 from "./components/not-found";
import { BrowserRouter, Route, Routes, Link, Navigate } from "react-router-dom";
import LoginForm from "./components/auth";
import {getToken, getTokenFromStorage, logout} from "./core/actions";
import axiosInstance from "./core/interceptor";


export default function App() {
  const [authors, setAuthors] = useState([]);
  const [books, setBooks] = useState([]);
  const [token, setToken] = useState('')

  const getHeaders = () => {
    let headers = {
      'Content-Type': 'application/json'
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token['access']}`
    }

    return headers
  }

  const loadData = () => {
    const headers = getHeaders();

    axiosInstance.get('http://127.0.0.1:8000/api/authors/',{headers})
      .then(response => {
        setAuthors(response.data);
      }).catch(error => {
        // console.error(error);
        setAuthors([]);
    })
    axiosInstance.get('http://127.0.0.1:8000/api/books/',{headers})
      .then(response => {
        setBooks(response.data);
      }).catch(error => {
        // console.error(error);
        setBooks([]);
      })
  }

  useEffect(() => {
    getTokenFromStorage(setToken);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [] );

  useEffect(() => {
    loadData();
  }, [token]);

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
            <li>
              {(token)
                  ? <button onClick={() => logout(setToken)}>Logout</button>
                  : <Link to='/login'>Login</Link>}
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Navigate to="authors"/>}/>
          <Route path="authors" element={<AuthorsList items={authors} />} />
          <Route path="author/:id" element={<AuthorBookList items={books} />} />
          <Route path="books" element={<BooksList items={books} />} />
          <Route path='login' element={<LoginForm
                                          getToken={getToken}
                                          setToken={setToken}
                                      />}
          />
          <Route path="*" element={<NotFound404 />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
