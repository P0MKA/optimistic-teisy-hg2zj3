import axios from "axios";
import {TOKEN_URL} from "./consts";
import Cookies from "universal-cookie";

export function getToken(username, password, setToken) {
    axios.post(TOKEN_URL, {username: username, password: password})
        .then(response => {
              console.log(response.data)
              const cookies = new Cookies();
              cookies.set('token', response.data['access']);
              cookies.set('refresh', response.data['refresh']);
              setToken(response.data['access']);
        }).catch(error => {
            console.error(error);
    })
}

export function logout(setToken) {
  const cookies = new Cookies();
  cookies.set('token', '');
  cookies.set('refresh', '');
  setToken('');
}

export function getTokenFromStorage(setToken) {
  const cookies = new Cookies();
  const token = cookies.get('token');
  setToken(token);
}