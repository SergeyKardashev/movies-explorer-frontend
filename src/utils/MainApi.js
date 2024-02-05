import mainApiUrl from '../constants/mainApiUrl';
import { getToken } from './token'; // setToken, // removeToken,

const checkResponse = (res) => {
  if (!res.ok) {
    return res.json() // Парсю ответ в JSON чтоб достать данные ошибки, а не только статус
      .then((errData) => {
        // Создаю новую ошибку, включающую статус и сообщение от API
        // 🟡 нужен new Error(), а не просто Error(). Хорошая практика. Вернет стек вызовов.
        const error = new Error(`Ошибка ${res.status}, описание: ${errData.message}`);
        // Добавляю к объекту ошибки доп свойства. Это не обязательно, но
        // полезно для расширенного анализа и обработки ошибок
        error.status = res.status; // статус-код ответа (он же код ошибки)
        error.errData = errData; // целиком ответ, преобразованный в JSON
        // Отклоняю промис с новой ошибкой
        return Promise.reject(error);
      });
  }
  return res.json(); // Если res.ok === true, просто возвращаю результат в формате JSON
};

// функция принимает объект с полями { userEmail, userName, userPassword и что угодно еще }
// преобразовывает в JSON вида { email, name, password } и отправляет в АПИ
// Возвращает объект с полями {email, name, _id}
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
export const getTokenApi = (userData) => fetch(`${mainApiUrl}/signin`, {
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
