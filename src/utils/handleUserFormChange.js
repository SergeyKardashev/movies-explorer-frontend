const inputsValidator = (name, value) => {
  const regExpName = /^[A-Za-z0-9а-яА-Я_-]+$/;
  if (name === 'userName'
    && (
      (value.length < 2)
      || (value.length > 40)
      || (!regExpName.test(value))
    )) {
    return 'Введите имя. 2-40 знаков. Буквы, цифры, символы -_';
  }

  const regExpEmail = /^\S+@\S+\.\S+$/;
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
  return '';
};

const handleUserFormChange = (event, userState, setUserState, errorsState, setErrorsState) => {
  if (event.target instanceof HTMLInputElement && event.target.name) {
    setUserState({ ...userState, [event.target.name]: event.target.value });
  }
  const errorMessage = inputsValidator(event.target.name, event.target.value);
  setErrorsState({ ...errorsState, [event.target.name]: errorMessage });
};

export default handleUserFormChange;
