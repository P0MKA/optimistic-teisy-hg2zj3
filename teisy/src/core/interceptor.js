import axios from 'axios';
import Cookies from "universal-cookie";
import {TOKEN_REFRESH_URL} from "./consts";

const axiosInstance = axios.create();
// создаем инстанс axios, который будем использовать только для загрузки данных с бека
// делаем так, чтобы не изменять поведение всего модуля axios
const cookies = new Cookies()

const refreshAccessToken = () => {
  // функция для обновления access токена (короткосрочного) с помощью refresh токена (долгосрочного)
  const refresh = cookies.get('refresh');
  // получаем токен из cookies
  const data = {refresh: refresh}

  return axios.post(TOKEN_REFRESH_URL, data);
  // возвращаем промис, который в случае успешного разрешения вернет нам новый access токен
};

axiosInstance.interceptors.response.use(
  (response) => response,
  // интерцептор - тоже промис, в случае успешного результата, ничего не делаем, просто возвращаем результат
  // дальше его будет обрабатывать .then или в случае await присвоим response в переменную
  (error) => {
  // а вот если ошибка - придется поработать
    const originalRequest = error.config;
      // получаем config запроса, для нас config - это прежде всего URL, headers и data,
      // можешь побросать config в консоль и там его посмотреть
    const token = cookies.get('token')
      // получаем token из cookies

    if (token && error.response && error.response.status === 401 && !originalRequest._retry) {
      // сперва проверяем, что в куках вообще сохранен токен - это token
      // что какой-то ответ пришел, а не просто network error и что-то с connections - error.response
      // что проблема с авторизацией - статус 401
      // что это первая попытка и у запроса еще не навешен атрибут _retry - это !originalRequest._retry
      originalRequest._retry = true;
      // помечаем, что мы уже пытались авторизоваться, для потомков

      return refreshAccessToken()
        .then((response) => {
          cookies.set('token', response.data.access);
          originalRequest.headers['Authorization'] = `Bearer ${response.data.access}`;
          // дергаем функцию обновления токена, если приходит ответ с токеном, пишем его в куки
          // и подставляем токен в заголовки headers нового запроса, который тянет нам данные c бекенда
          // и снова возвращаем промис, но у этого уже меньше шансов получить 401
          return axios(originalRequest);
        })
        .catch((refreshError) => {
          return Promise.reject(refreshError);
          // если токен не получилось обновить, возвращаем промис разрешенный в ошибку,
          // он будет обрабатываться сразу в .cath или в блоке try {...} catch {refreshError}
        });
    }

    return Promise.reject(error);
    // еще один промис с ошибкой, если не выполнено одно из условий для обновления токена,
    // например если в куках нет токена, просто отдаем 401 дальше в .catch
    // или если ошибка не связана с авторизацией
  }
);

export default axiosInstance;
