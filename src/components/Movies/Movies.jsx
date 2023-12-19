import React, { useState, useRef, useEffect } from 'react';
// import React, { useState, useRef, useEffect } from 'react';
import './Movies.css';
import Preloader from '../Preloader/Preloader';
import MoviesCardList from '../MoviesCardList/MoviesCardList';
import SearchForm from '../SearchForm/SearchForm';
import FilterCheckbox from '../FilterCheckbox/FilterCheckbox';

function Movies() {
  const searchFieldRef = useRef(null);
  const shortRef = useRef(null);

  const [filteredMovies, setFilteredMovies] = useState([]);
  const [isFetching, setFetching] = useState(false);
  const [isShort, setShort] = useState(JSON.parse(localStorage.getItem('isShort') || true));

  function compareStr(str1, str2) {
    const regex = new RegExp(`\\s*${str1}\\s*`, 'i'); // Создаю регулярку из первой строки, 'i' = игнорир регистра
    return regex.test(str2); // check if str2 matches regExp. Вернет true или false
  }

  const searchMovies = async () => {
    localStorage.setItem('searchQuery', searchFieldRef.current.value); // сохраняю запрос
    localStorage.setItem('isShort', JSON.stringify(shortRef.current.checked)); // сохраняю чекбокс

    let allMovies = []; // создаю массив для фильмов из АПИ
    // если в хранилище нет фильмов - запрашиваю, сохраняю как в allMovies, так и в локал
    // Если в хранилище есть фильмы, сохраняю их в массив.
    if (localStorage.getItem('allMovies') === null) {
      setFetching(true); // Включаю анимацию
      const response = await fetch('https://api.nomoreparties.co/beatfilm-movies');
      allMovies = await response.json();
      localStorage.setItem('allMovies', JSON.stringify(allMovies));
    } else {
      allMovies = JSON.parse(localStorage.getItem('allMovies'));
    }

    const filtered = allMovies.filter((movie) => {
      if (
        compareStr(searchFieldRef.current.value, movie.nameRU)
        || compareStr(searchFieldRef.current.value, movie.nameEN)) {
        return true;
      }
      return false;
    });

    setFilteredMovies(filtered);
    localStorage.setItem('filtered', JSON.stringify(filtered));
    setFetching(false); // Убираю анимацию
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    searchMovies();
  };

  const handleIsShort = () => {
    setShort(!isShort);
    searchMovies();
  };

  useEffect(() => {
    if (!localStorage.getItem('filtered')) {
      searchMovies();
    }
  }, [filteredMovies, isShort]);

  return (
    <div className="movies-page">
      <SearchForm onSubmit={submitHandler} searchFieldRef={searchFieldRef} />
      <FilterCheckbox onChange={handleIsShort} shortRef={shortRef} />
      <section className="movies__search-results">
        {isFetching ? <Preloader /> : ''}
        {!isFetching && localStorage.getItem('filtered') && (
          <MoviesCardList movies={JSON.parse(localStorage.getItem('filtered'))} isFetching={isFetching} />
        )}
      </section>
    </div>
  );
}

export default Movies;
