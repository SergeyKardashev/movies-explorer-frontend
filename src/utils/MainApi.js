import mainApiUrl from '../constants/mainApiUrl';
import {
  getToken,
  // setToken,
  // removeToken,
} from './token';
// import THUMB_BASE_URL from '../constants/thumbBaseUrl';
// import LS_KEYS from '../constants/localStorageKeys';

const checkResponse = (res) => {
  if (!res.ok) return Promise.reject(new Error(`Ошибка запроса к главному АПИ: ${res.status}`));
  // 🟡 может не нужен new Error (инстанс класса)? Может достаточно просто (Error())
  return res.json();
};

export const createUserApi = (userData) => {
  const { userEmail, userName, userPassword } = userData;
  return fetch(`${mainApiUrl}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: userEmail,
      name: userName,
      password: userPassword,
    }),
  })
    .then(checkResponse);
};

export const loginApi = (userData) => {
  const { userPassword: password, userEmail: email } = userData;
  return fetch(`${mainApiUrl}/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password, email }),
  })
    .then(checkResponse)
    .then((res) => {
      if (!res.token) {
        return Promise.reject(new Error(`Ошибка отсутствия токена в ответе АПИ: ${res.status}`));
      }
      return res;
    });
};

export const updateUserApi = (userData) => {
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
  })
    .then(checkResponse);
};

// /users/me get - возвращает email и имя
export const getUserApi = () => {
  const jwt = getToken();
  return fetch(`${mainApiUrl}/users/me`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt}`,
    },
  })
    .then(checkResponse);
};

export const getMoviesApi = () => {
  const jwt = getToken();
  return fetch(`${mainApiUrl}/movies`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt}`,
    },
  })
    .then(checkResponse);
};

export const saveMovieApi = (movie) => {
  // создаёт фильм с переданными в теле country, director, duration, year, description, image,
  // trailer, nameRU, nameEN, thumbnail, movieId
  const jwt = getToken();
  return fetch(`${mainApiUrl}/movies`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify(movie),
  })
    .then(checkResponse);
};

// /movies/:_id ‘DELETE’ - удаляет сохранённый фильм по id
// Не требуется ничего, кроме айдишки в ПАРАМЕТРАХ и токена из ЛС
// Из бэка возвращается объект с одним свойством { _id: }
export const deleteMovieApi = (movie) => {
  const jwt = getToken();
  return fetch(`${mainApiUrl}/movies/${movie._id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt}`,
    },
  })
    .then(checkResponse);
};
