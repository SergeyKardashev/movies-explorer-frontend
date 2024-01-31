import React, { useState } from 'react';
import './SearchForm.css';
import ERR_MSG from '../../constants/errorMessages';

function SearchForm(props) {
  const { onSubmit, searchFieldRef, query } = props;

  const [searchError, setSearchError] = useState('');

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

export default SearchForm;
