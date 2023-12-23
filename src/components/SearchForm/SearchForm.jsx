import React, { useState } from 'react';
import './SearchForm.css';

function SearchForm(props) {
  const {
    onSubmit, searchFieldRef, query,
  } = props;

  const [searchError, setSearchError] = useState('');

  const validateQuery = (value) => {
    const trimmedValue = value.trim();
    if (trimmedValue === '') {
      setSearchError('Введите запрос');
    } else if (trimmedValue === ' ') {
      setSearchError('Введите корректный запрос');
    } else {
      setSearchError('');
    }
  };

  const handleChange = (e) => {
    validateQuery(e.target.value);
  };

  return (
    <section className="movies__search">
      <form className="movies__search-form" onSubmit={onSubmit}>
        <input
          className="movies__search-input"
          type="text"
          placeholder="Фильм"
          name="movieSearch"
          ref={searchFieldRef}
          defaultValue={localStorage.getItem(`${query}`) || ''}
          onChange={handleChange}
          required
        />
        <button className="movies__search-btn" type="submit">Найти</button>
      </form>
      <div className="movies__search-input-error">{searchError}</div>
    </section>
  );
}

export default SearchForm;
