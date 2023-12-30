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

const handleUserFormChange = (event, formData, setFormData, errors, setErrors) => {
  const { name: inputName, value: inputValue } = event.target; // считываю значение поля.
  // Убеждаюсь что target - input с атрибутом name
  if (event.target instanceof HTMLInputElement && event.target.name) {
    setFormData({ ...formData, [inputName]: inputValue }); // обновляю стейт юзера
  }
  const errorMessage = inputsValidator(inputName, inputValue); // Валидация и...
  setErrors({ ...errors, [inputName]: errorMessage }); // ... и обновление ошибок
};

export default handleUserFormChange;
