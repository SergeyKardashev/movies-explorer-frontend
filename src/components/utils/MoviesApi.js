import BEATFILM_URL from '../../constants/beatFilmsUrl';

function checkResponse(res) {
  if (!res.ok) return Promise.reject(Error(`Ошибка запроса к ${BEATFILM_URL}: ${res.status}`));
  return res.json();
}
// 🟡 фетч с ошибочным урлом для тестирования ошибок
// function getInitialMoviesData() {
//   console.log('запускаю фетч с ошибочным урлом');
//   return fetch('https://api.nomoreparties.co/beatfilm-moviessssss')
//     .then(checkResponse);
// }

function getInitialMoviesData() {
  return fetch(BEATFILM_URL)
    .then(checkResponse);
}

export default getInitialMoviesData;
