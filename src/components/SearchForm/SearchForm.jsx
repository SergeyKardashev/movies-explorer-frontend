// import React from 'react';
import React, { useState } from 'react';
import './SearchForm.css';
import ERR_MSG from '../../constants/errorMessages';

function SearchForm(props) {
  const {
    onSubmit, searchFieldRef, query,
  } = props;

  const [searchError, setSearchError] = useState('');

  // const validateQueryLive = (value) => {
  //   const trimmedValue = value.trim();
  //   if (trimmedValue === '') {
  //     setSearchError('Введите запрос');
  //   } else if (trimmedValue === ' ') {
  //     setSearchError('Введите корректный запрос');
  //   } else {
  //     setSearchError('');
  //   }
  // };

  // const handleChange = (e) => {
  //   validateQueryLive(e.target.value);
  // };

  // const validateQuery2 = (value) => {
  //   const trimmedValue = value.trim();
  //   if ((trimmedValue === '') || (trimmedValue === ' ')) {
  //     setSearchError('Нужно ввести ключевое слово');
  //   } else {
  //     setSearchError('');
  //   }
  // };

  // const validateQueryToSubmit = (value) => {
  //   const trimmedValue = value.trim();
  //   if ((trimmedValue === '') || (trimmedValue === ' ')) {
  //     setSearchError('Нужно ввести ключевое слово');
  //   } else {
  //     setSearchError('');
  //   }
  // };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   onSubmit();
  //   // при сабмите таргет - форма. Проверять не форму, а ее поля.
  //   // validateQueryToSubmit(searchFieldRef.current.value);
  // };

  return (
    <div className="movies__search">
      <form className="movies__search-form" onSubmit={onSubmit}>
        <input
          className="movies__search-input"
          type="text"
          placeholder="Фильм"
          name="movieSearch"
          ref={searchFieldRef}
          defaultValue={localStorage.getItem(`${query}`) || ''}
          onInvalid={() => setSearchError(ERR_MSG.searchInputOnInvalid)}
          onInput={() => setSearchError('')}
          required
        />
        <button className="movies__search-btn" type="submit">Найти</button>
      </form>
      <div className="movies__search-input-error">{searchError}</div>

    </div>
  );
}

// return (
//   <div className="movies__search">
//     <form className="movies__search-form" onSubmit={onSubmit}>
//       <input
//         className="movies__search-input"
//         type="text"
//         placeholder="Фильм"
//         name="movieSearch"
//         ref={searchFieldRef}
//         defaultValue={localStorage.getItem(`${query}`) || ''}
//         onInvalid={() => alert('Нужно ввести ключевое слово')}
//         onChange={handleChange}
//         pattern=".*\S.*"
//         required
//       />
//       <button className="movies__search-btn" type="submit">Найти</button>
//     </form>
//     <div className="movies__search-input-error">{searchError}</div>
//   </div>
// );
// }

export default SearchForm;
