const TOKEN_KEY = 'jwt';

export function setToken(jwt) {
  localStorage.setItem(TOKEN_KEY, jwt);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
}
