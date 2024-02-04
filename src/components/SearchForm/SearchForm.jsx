import React, { useState } from 'react';
import './SearchForm.css';
import ERR_MSG from '../../constants/errorMessages';

function SearchForm(props) {
  const { onSubmit, searchFieldRef, query } = props;

  const [searchError, setSearchError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault(); // Предотвратить стандартную отправку формы
    const inputValue = searchFieldRef.current.value; // Получаю нынешнее значение инпута

    if (!inputValue.trim()) { // Если значение (с учетом пробелов) пустое, то...
      setSearchError(ERR_MSG.searchInputOnInvalid); // ... устанавливаю сообщение об ошибке
    } else {
      setSearchError(''); // если инпут заполнен - очищаю сообщение об ошибке.
      onSubmit(event); // Вызываю родительский onSubmit из пропсов чтоб обработать данные формы
    }
  };

  return (
    <div className="movies__search">
      <form className="movies__search-form" onSubmit={handleSubmit} noValidate>
        <input
          className="movies__search-input"
          type="text"
          placeholder="Фильм"
          name="movieSearch"
          ref={searchFieldRef} // устанавливаю ссылку на инпут
          defaultValue={localStorage.getItem(`${query}`) || ''}
          onInput={() => setSearchError('')} // Очищаю ОШИБКУ при вводе
        />
        <button className="movies__search-btn" type="submit">Найти</button>
      </form>
      <div className="movies__search-input-error">{searchError}</div>

    </div>
  );
}

export default SearchForm;
