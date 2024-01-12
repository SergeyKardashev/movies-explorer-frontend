import mainApiUrl from '../constants/mainApiUrl';
import {
  getToken,
  setToken,
  // removeToken,
} from './token';

const checkResponse = (res) => {
  if (!res.ok) return Promise.reject(new Error(`Ошибка запроса к главному АПИ: ${res.status}`));
  return res.json();
};
// 🟡 может не нужен new Error (инстанс класса)? Может достаточно просто (Error())

export const createUser = (userData) => {
  const { userEmail, userName, userPassword } = userData;
  return fetch(`${mainApiUrl}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: userEmail,
      name: userName,
      password: userPassword,
    }),
  }).then((res) => checkResponse(res));
};

export const login = (userData) => {
  const { userPassword: password, userEmail: email } = userData;
  return fetch(`${mainApiUrl}/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password, email }),
  })
    .then(checkResponse)
    .then((data) => {
      if (!data.token) console.log('NO token in response from authorize');
      setToken(data.token);
      return data;
    });
};

export const updateUser = (userData) => {
  const jwt = getToken();
  return fetch(`${mainApiUrl}/users/me`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify({
      email: userData.userEmail,
      name: userData.userName,
    }),
  }).then((res) => checkResponse(res));
};
