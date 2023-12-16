import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useNavigate, useLocation, NavLink } from 'react-router-dom';
import './Movies.css';
import MoviesCardList from '../MoviesCardList/MoviesCardList';

function Movies(props) {
  const { onFind } = props;
  // const navigate = useNavigate();
  // const location = useLocation();

  return (
    <div className="movies-page">

      {/* ======== поисковая секция =========== */}
      <section className="movies__search">

        <form className="movies__search-form" onSubmit={onFind}>
          <input className="movies__search-input" type="text" placeholder="Фильм" />
          <button className="movies__search-btn" type="submit">Найти</button>
        </form>

        <div className="movies__toggle-wrap">
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label className="switch" htmlFor="switch">
            <input type="checkbox" id="switch" />
            <span className="slider round" />
          </label>
          <span className="movies__toggle-label">Короткометражки</span>
        </div>

      </section>

      {/* ======== сетка киношек =========== */}
      <section className="movies__search-results">
        <MoviesCardList />
      </section>

    </div>
  );
}

export default Movies;
