import BEATFILM_URL from '../constants/beatFilmsUrl';

function checkResponse(res) {
  if (!res.ok) return Promise.reject(Error(`Ошибка запроса к ${BEATFILM_URL}: ${res.status}`));
  return res.json();
}

function getAllMoviesFromApi() {
  // 🟡 ниже фетч с ошибочным урлом для тестирования ошибок
  // return fetch('https://wrong-url')
  return fetch(BEATFILM_URL)
    .then(checkResponse);
}

export default getAllMoviesFromApi;
