import axios from "axios";
import {TOKEN_REFRESH_URL, TOKEN_URL} from "./consts";
import Cookies from "universal-cookie";
import { toast } from 'react-toastify';

function storeToken(access, refresh, setToken) {
  // функция для записи JWT-токенов в cookies и в state
  const cookies = new Cookies();
  cookies.set('token', access);
  cookies.set('refresh', refresh);
  setToken(access);
}

export function getToken(username, password, setToken) {
  // получаем jwt-token с бекенда, передавая username и password
  // в твоем случае email и password
  axios.post(TOKEN_URL, {username: username, password: password})
    .then(response => {
      toast('Так поднимем же бокалы 🥂 детского шампанского за успешную авторизацию 🎉')
      storeToken(response.data.access, response.data.refresh, setToken);
    }).catch(error => {
      toast('Походу 🤨 надо было подучить клингонский 🤬')
      console.error(error);
  })
}

export function logout(setToken) {
  // разлогиниваем пользователя, стирая токены из state и cookies
  storeToken('','', setToken);
}

export function getTokenFromStorage(setToken) {
  // эту функцию дергаем при перезагрузке страницы
  // так как state при перезагрузке стирается, чтобы убедиться, что пользователь авторизован,
  // надо лезть в cookies и искать там, но токены из cookies могут хранится протухшими,
  // поэтому берём refresh и пытаемся по нему получить access, если удалось - отлично
  // нет - просто разлогиниваем пользователя
  const cookies = new Cookies();
  const refresh = cookies.get('refresh');
  const data = {refresh: refresh};
  axios.post(TOKEN_REFRESH_URL, data)
    .then(response => {
      storeToken(response.data.access, refresh, setToken);
  })
    .catch(error => {
      storeToken('','', setToken);
    });
}