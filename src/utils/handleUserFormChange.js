const inputsValidator = (name, value) => {
  // const regExpName = /^[A-Za-z0-9а-яА-Я_-]+$/;
  // Используем позитивный просмотр вперёд, чтобы убедиться,
  // что есть хотя бы один не пробельный символ
  const regExpName = /^(?=.*[A-Za-z0-9а-яА-Я_-])[A-Za-z0-9а-яА-Я_-\s]+$/;

  if (name === 'userName'
    && (
      (value.length < 2)
      || (value.length > 40)
      || (!regExpName.test(value))
    )) {
    return 'Введите имя. 2-40 знаков. Буквы, цифры, символы -_';
  }

  // const regExpEmail = /^\S+@\S+\.\S+$/; // заменил т.к. пропускал русские буквы в имени почты
  const regExpEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (name === 'userEmail' && (!regExpEmail.test(value))) {
    return 'Введите корректный e-mail.';
  }

  const regExpPassword = /^[A-Za-z0-9!@#$%&*()\-_=+{}[\]?;:,.]+$/;

  if (name === 'userPassword' && value.length < 4) {
    return 'Длина пароля должна быть не менее 4 символов';
  }
  if (name === 'userPassword' && (!regExpPassword.test(value))) {
    return 'Допустимы: латиница, цифры, символы !@#$%&*()-_=+[]{}?;:';
  }

  // если ошибок в трёх полях нет, то возвращаю пустую строку
  return '';
};

const handleUserFormChange = (event, userState, setUserState, errorsState, setErrorsState) => {
  if (event.target instanceof HTMLInputElement && event.target.name) {
    const newUserState = { ...userState, [event.target.name]: event.target.value };

    setUserState(newUserState);
  }
  const errorMessage = inputsValidator(event.target.name, event.target.value);
  setErrorsState({ ...errorsState, [event.target.name]: errorMessage });
};

export default handleUserFormChange;
