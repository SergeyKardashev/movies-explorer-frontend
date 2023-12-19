import React, { useState, useRef } from 'react';
// import React, { useState, useRef, useEffect } from 'react';
import './Movies.css';
import Preloader from '../Preloader/Preloader';
import MoviesCardList from '../MoviesCardList/MoviesCardList';
import SearchForm from '../SearchForm/SearchForm';
import FilterCheckbox from '../FilterCheckbox/FilterCheckbox';

function Movies() {
  const searchFieldRef = useRef(null);
  const isShortRef = useRef(null);

  const [filteredMovies, setFilteredMovies] = useState([]);
  const [isFetching, setFetching] = useState(false);

  function compareStr(str1, str2) {
    // Создаю регулярку из первой строки, 'i' = игнорир регистра
    const regex = new RegExp(`\\s*${str1}\\s*`, 'i');
    // Проверяю, соответствует ли 2я строка этой регулярке. Вернет true или false
    return regex.test(str2);
  }

  const submitHandler = async (e) => {
    e.preventDefault();

    localStorage.setItem('searchQuery', searchFieldRef.current.value); // сохраняю запрос
    localStorage.setItem('isShort', JSON.stringify(isShortRef.current.checked));

    let allMovies = []; // создаю массив для фильмов из чужой АПИ
    // если в хранилище нет фильмов - запрашиваю, сохраняю как в массив allMovies, так и в локальное
    // Если в хранилище есть фильмы, сохраняю их в массив.
    if (localStorage.getItem('allMovies') === null) {
      setFetching(true); // Включаю анимацию
      const response = await fetch('https://api.nomoreparties.co/beatfilm-movies');
      allMovies = await response.json();
      localStorage.setItem('allMovies', JSON.stringify(allMovies));
    } else {
      allMovies = JSON.parse(localStorage.getItem('allMovies'));
    }

    const filtered = allMovies.filter(
      (movie) => {
        if (
          compareStr(searchFieldRef.current.value, movie.nameRU)
          || compareStr(searchFieldRef.current.value, movie.nameEN)) {
          return true;
        }
        return false;
      },
    );
    setFilteredMovies(filtered);
    setFetching(false); // Убираю анимацию
  };

  return (
    <div className="movies-page">
      {/* ======== поисковая секция =========== */}
      <SearchForm onSubmit={submitHandler} searchFieldRef={searchFieldRef} />

      {/* ======== чекбокс короткометражки =========== */}
      <FilterCheckbox isShortRef={isShortRef} />
      {/* ======== сетка киношек =========== */}
      <section className="movies__search-results">
        {isFetching ? <Preloader /> : ''}
        {!isFetching && filteredMovies.length
          ? (<MoviesCardList movies={filteredMovies} isFetching={isFetching} />)
          : ''}
      </section>
    </div>
  );
}

export default Movies;
