import mainApiUrl from '../../constants/mainApiUrl';

const checkResponse = (res) => {
  if (!res.ok) return Promise.reject(new Error(`Ошибка запроса к главному АПИ: ${res.status}`));
  return res.json();
};
// 🟡 не уверен, что тут нужен new Error. Может ненужно создавать инстанс класса?
// Может достаточно просто (Error())

const createUser = (user) => {
  const { userEmail, userName, userPassword } = user;
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

export default createUser;
