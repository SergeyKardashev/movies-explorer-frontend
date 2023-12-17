class Api {
  constructor(filmUrl) {
    this.filmUrl = filmUrl;
  }

  getInitialCards() {
    return fetch(this.filmUrl, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }).then((res) => {
      if (!res.ok) return Promise.reject(new Error(`Ошибка: ${res.status}`));
      // eslint-disable-next-line no-console
      console.log(res);
      return res.json();
    });
  }
}

const filmUrl = 'https://api.nomoreparties.co/beatfilm-movies';
const api = new Api(filmUrl);

export default api;
