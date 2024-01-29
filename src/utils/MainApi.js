import mainApiUrl from '../constants/mainApiUrl';
import { getToken } from './token'; // setToken, // removeToken,

const checkResponse = (res) => {
  if (!res.ok) return Promise.reject(new Error(`Ошибка запроса к главному АПИ: ${res.status}`));
  // 🟡 может не нужен new Error (инстанс класса)? Может достаточно просто (Error())
  return res.json();
};

// функция принимает объект с полями { userEmail, userName, userPassword и что угодно еще }
// преобразовывает в JSON вида { email, name, password } и отправляет в АПИ
export const createUserApi = (userData) => fetch(`${mainApiUrl}/signup`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: userData.userEmail,
    name: userData.userName,
    password: userData.userPassword,
  }),
})
  .then(checkResponse);

// функция принимает объект с полями { userEmail, userPassword и что угодно еще }
// преобразовывает в JSON вида { email, password } и отправляет в АПИ
export const loginApi = (userData) => fetch(`${mainApiUrl}/signin`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: userData.userEmail,
    password: userData.userPassword,
  }),
})
  .then(checkResponse);

// функция принимает объект с полями { userEmail, userName, и что угодно еще }
// преобразовывает в JSON вида { email, name, } и отправляет в АПИ
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

// тестовый роут возвращает ошибку
export const updateUserApiError = (userData) => {
  const jwt = getToken();
  return fetch(`${mainApiUrl}/users/update-error`, {
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
  // работает только когда есть токен
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
