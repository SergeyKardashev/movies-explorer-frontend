import mainApiUrl from '../constants/mainApiUrl';
import {
  getToken,
  setToken,
  // removeToken,
} from './token';
// import THUMB_BASE_URL from '../constants/thumbBaseUrl';
// import LS_KEYS from '../constants/localStorageKeys';

// 🟡🟡🟡🟡 временно заменил функцию на ее инструкции во всех запросах
// const checkResponse = (res) => {
//   if (!res.ok) return Promise.reject(new Error(`Ошибка запроса к главному АПИ: ${res.status}`));
//   return res.json();
// };
// 🟡 может не нужен new Error (инстанс класса)? Может достаточно просто (Error())

export const createUser = (userData) => {
  // console.log('в АПИ в функции регистрации на входе:', userData);
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
    // 🟡 временно заменил функцию на ее инструкции во всех запросах
    // .then(checkResponse);
    .then((res) => {
      if (!res.ok) return Promise.reject(new Error(`Ошибка запроса login к АПИ: ${res.status}`));
      return res.json();
    });
};

export const login = (userData) => {
  // console.log('в АПИ в функции login на входе:', userData);
  const { userPassword: password, userEmail: email } = userData;
  return fetch(`${mainApiUrl}/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password, email }),
  })
    // 🟡 временно заменил функцию на ее инструкции во всех запросах
    // .then(checkResponse)
    .then((res) => {
      if (!res.ok) return Promise.reject(new Error(`Ошибка запроса login к АПИ: ${res.status}`));
      return res.json();
    })
    .then((data) => {
      if (!data.token) console.log('🔆 NO token in response from authorize');
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
  })
    // 🟡 временно заменил функцию на ее инструкции во всех запросах
    // .then(checkResponse);
    .then((res) => {
      if (!res.ok) return Promise.reject(new Error(`Ошибка запроса updateUser к АПИ: ${res.status}`));
      return res.json();
    });
};

// /users/me get - возвращает email и имя
export const getUser = () => {
  console.log('🔆 В апишке стартовала getUser.');
  const jwt = getToken();
  return fetch(`${mainApiUrl}/users/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt}`,
    },
  })
    // 🟡 временно заменил функцию на ее инструкции во всех запросах
    // .then(checkResponse);
    .then((res) => {
      console.log('🔆 В апишке пришел ответ от getUser.');
      if (!res.ok) {
        console.log('🔴 🔆 В ответе от getUser лажа.');
        return Promise.reject(new Error(`Ошибка запроса getUser к АПИ: ${res.status}`));
      }
      return res.json();
    });
};

export const getMovies = () => {
  const jwt = getToken();
  console.log('🔆 В апишке стартовала getMovies.');
  return fetch(`${mainApiUrl}/movies`, {
    // method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt}`,
    },
  })
    // 🟡 временно заменил функцию на ее инструкции во всех запросах
    // .then(checkResponse)
    .then((res) => {
      console.log('🔆 В getMovies пришел ответ');
      if (!res.ok) {
        console.log('🔴 🔆 В ответе лажа случилась. Статус НЕ ок');
        return Promise.reject(new Error(`Ошибка запроса getMovies к АПИ: ${res.status}`));
      }
      return res.json();
    })
    .then((res) => {
      console.log('🔆 В getMovies получил сохранёнки', res);
      return res;
    });
};

export const saveMovie = (movie) => {
  console.log('🔆 в апишке movie:', movie);
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
    // 🟡 временно заменил функцию на ее инструкции во всех запросах
    // .then(checkResponse)
    .then((res) => {
      if (!res.ok) return Promise.reject(new Error(`Ошибка запроса getMovies к АПИ: ${res.status}`));
      return res.json();
    })
    .then((res) => {
      console.log('🔆 получил сохранёнку обратно', res);
      return res;
    });
};

// /movies/:_id ‘DELETE’ - удаляет сохранённый фильм по id
// Не требуется ничего, кроме айдишки в ПАРАМЕТРАХ и токена из ЛС
// Из бэка возвращается объект с одним свойством { _id: }
export const deleteMovie = (movie) => {
  const jwt = getToken();
  console.log('🔆 фильм для удаления: ', movie);
  return fetch(`${mainApiUrl}/movies/${movie._id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt}`,
    },
  })
    // 🟡 временно заменил функцию на ее инструкции во всех запросах
    // .then(checkResponse);
    .then((res) => {
      if (!res.ok) return Promise.reject(new Error(`Ошибка запроса deleteMovie к АПИ: ${res.status}`));
      return res.json();
    })
    .then((res) => {
      console.log('🔆 получил после удаления из апи:', res);
      return res;
    });
};
