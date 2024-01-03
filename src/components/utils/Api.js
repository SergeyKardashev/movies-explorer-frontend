class Api {
  constructor(options) {
    this.options = options;
    this.baseUrl = options.baseUrl;
  }

  _checkResponse(res) {
    if (!res.ok) return Promise.reject(Error(`Ошибка запроса к ${this.baseUrl}: ${res.status}`));
    return res.json();
  }

  getInitialMoviesData() {
    return fetch(this.baseUrl)
      .then(this._checkResponse);
  }
}

const BEATFILM_URL = 'https://api.nomoreparties.co/beatfilm-movies';

const api = new Api({
  baseUrl: BEATFILM_URL,
});

export default api;
