import React, { memo, useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useNavigate, useLocation, NavLink } from 'react-router-dom';
import './Movies.css';
import MoviesCardList from '../MoviesCardList/MoviesCardList';

const Movies = memo(() => {
  // const navigate = useNavigate();
  // const location = useLocation();

  const [allMovies, setAllMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [query, setQuery] = useState('');
  const [isFetching, setFetching] = useState(false);

  // const fetchMovies = (query) => {
  //   fetch('https://api.nomoreparties.co/beatfilm-movies')
  //     .then((res) => res.json())
  //     .then((res) => {
  //       res.forEach((i) => {
  //         setAllMovies((spread) => [...spread, i]);
  //       });
  //     });
  // };

  const getAllMovies = async () => {
    setFetching(true);
    let movies = [];
    const rawMovies = localStorage.getItem('allMovies');

    if (rawMovies === null) {
      const response = await fetch(
        'https://api.nomoreparties.co/beatfilm-movies',
      );
      movies = await response.json();
      localStorage.setItem('allMovies', JSON.stringify(movies));
    } else {
      movies = JSON.parse(rawMovies);
    }
    setAllMovies(movies);
    setFilteredMovies(movies);
    setFetching(false);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    const result = allMovies.filter((movie) => movie.nameRU.startsWith(query));
    setFilteredMovies(result);
  };

  useEffect(() => {
    if (isFetching || allMovies.length) {
      return;
    }
    getAllMovies();
    setQuery('All');
  }, [isFetching, allMovies]);

  return (
    <div className="movies-page">
      {/* ======== поисковая секция =========== */}
      <section className="movies__search">
        <form className="movies__search-form" onSubmit={submitHandler}>
          <input
            className="movies__search-input"
            type="text"
            placeholder="Фильм"
          />
          <button className="movies__search-btn" type="submit">
            Найти
          </button>
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
        {isFetching && <span>идет загрузка</span>}
        {!isFetching && filteredMovies.length && (
          <MoviesCardList movies={filteredMovies} />
        )}
      </section>
    </div>
  );
});

export default Movies;
