import React from 'react';
import './SearchForm.css';

function SearchForm(props) {
  const { onSubmit, searchFieldRef, query } = props;
  return (
    <section className="movies__search">
      <form className="movies__search-form" onSubmit={onSubmit}>
        <input
          className="movies__search-input"
          type="text"
          placeholder="Фильм"
          ref={searchFieldRef}
          defaultValue={localStorage.getItem(`${query}`) || ''}
        />
        <button className="movies__search-btn" type="submit">Найти</button>
      </form>
    </section>
  );
}

export default SearchForm;
