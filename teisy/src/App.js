// Знаю, что ты уже всё перечитала вдоль и поперек, но добавлю немного комментариев, на всякий
// по-прежнему идем по методичке с той разницей, что используем компоненты на функциях, jwt-токены
// и обновляем просроченный access =)
// поэтому индивидуалки, но методичку читаем, чтобы понять, что вообще должно происходить

import { useState, useEffect } from "react";
import BooksList from "./components/books-list";
import AuthorsList from "./components/authors-list";
import AuthorBookList from "./components/author-books-list";
import NotFound404 from "./components/not-found";
import { BrowserRouter, Route, Routes, Link, Navigate } from "react-router-dom";
import LoginForm from "./components/auth";
import {getToken, getTokenFromStorage, logout} from "./core/actions";
import axiosInstance from "./core/interceptor";
import Cookies from "universal-cookie";  // не забываем npm install universal-cookie
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
  const [authors, setAuthors] = useState([]);
  const [books, setBooks] = useState([]);
  const [token, setToken] = useState('')
  // токен по задумке методички нужен, чтобы проверять залогинился пользователь или нет =)
  // но мы будем ещё использовать его в useEffect в качестве зависимости dependencies
  // когда токен меняется, применяется эффект и стягиваются данные с бекенда


  const getHeaders = () => {
    // функция получения заголовков для axios
    // если в куках записан токен, добавляем его в заголовки,
    // если нет то увы =)
    const cookies = new Cookies();
    const jwtToken = cookies.get('token');

    let headers = {
      'Content-Type': 'application/json'
    }

    if (jwtToken) {
      headers['Authorization'] = `Bearer ${jwtToken}`
    }

    return headers
  }

  async function loadData() {
    // неявный промис отправляем асинхронно запросы на бекенд
    // ждем ответы или ошибки с полюбившимся синтаксисом async / await
    // У тебя эта функция должна содержать вызовы fetchData ;)
    // пиши как тебе хочется, это главное
    const headers = getHeaders();

    try {
      // открываем блок try, вдруг response прилетит с ошибкой
      const response = await axiosInstance.get(
          'http://127.0.0.1:8000/api/authors/',{headers}
      )
      // как обычно await'им результат промиса и присваиваем его в переменную
      setAuthors(response.data);
    } catch (error) {
      // а это JS аналог except =)
      setAuthors([]);
    }

    try {
      const response = await axiosInstance.get(
          'http://127.0.0.1:8000/api/books/',{headers}
      )
      setBooks(response.data);
    } catch (error) {
      setBooks([]);
    }
  }

  useEffect(() => {
    // теперь вместо загрузки данных с бека мы пытаемся получить токен, записанный в cookies
    getTokenFromStorage(setToken);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [] );

  useEffect(() => {
    // а если удалось получить токен, то грузим данные.
    // Пытаемся грузить данные при любом изменении token, так как он в deps=[token] (условие применения эффекта)
    // если мы разлогинимся, какие-то API могут стать для нас недоступными

    loadData().then();
    // .then() нужен так как loadData теперь асинхронная функция и возвращает промис неявно
    // .then можно убрать, но будет ругаться линтер IDE
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <div className="App">
      <ToastContainer/>
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
                  : <Link to='/login'>Login</Link>
              // любимые тернарники ;)
              }
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
                                          token={token}
                                      />}
          />
          <Route path="*" element={<NotFound404 />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
