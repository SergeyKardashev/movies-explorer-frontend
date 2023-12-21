import React, { useState, useRef, useEffect } from 'react';
import './Movies.css';
import Preloader from '../Preloader/Preloader';
import MoviesCardList from '../MoviesCardList/MoviesCardList';
import SearchForm from '../SearchForm/SearchForm';
import FilterCheckbox from '../FilterCheckbox/FilterCheckbox';

function Movies() {
  const query = 'queryAll';
  const searchFieldRef = useRef(null);

  const [filteredMovies, setFilteredMovies] = useState([]);
  const [isFetching, setFetching] = useState(false);
  const [isShort, setShort] = useState(JSON.parse(localStorage.getItem('isShortAll') || 'false')); // 'false' в кавычках парсить

  function compareStr(str1, str2) {
    const regex = new RegExp(`\\s*${str1}\\s*`, 'i'); // Создаю regex из str1, 'i' = игнорир регистра
    return regex.test(str2); // check if str2 matches regExp. Вернет true / false
  }

  const searchMoviesAll = async () => {
    localStorage.setItem(query, searchFieldRef.current.value); // сохраняю запрос
    localStorage.setItem('isShortAll', isShort); // сохраняю чекбокс

    let allMovies = []; // создаю массив для фильмов из АПИ
    if (localStorage.getItem('allMovies') === null) {
      setFetching(true); // Включаю анимацию
      const response = await fetch('https://api.nomoreparties.co/beatfilm-movies');
      allMovies = await response.json();
      localStorage.setItem('allMovies', JSON.stringify(allMovies));
    } else {
      allMovies = JSON.parse(localStorage.getItem('allMovies'));
    }

    const filtered = allMovies.filter((movie) => {
      if (!searchFieldRef.current.value || searchFieldRef.current.value === ' ') {
        return false;
      }
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
    searchMoviesAll();
  };

  const handleIsShort = () => {
    const newIsShortValue = !isShort;
    setShort(newIsShortValue); // Обновление состояния
    // Не сохраняем значение в localStorage здесь
    searchMoviesAll(); // Вызов поиска с новым состоянием
  };

  useEffect(() => {
    localStorage.setItem('isShortAll', isShort);
    if (!localStorage.getItem('filtered')) {
      searchMoviesAll();
    }
  }, [filteredMovies, isShort]);

  const emptyMsg = 'Ничего не найдено или запрос пустой или содержит лишь пробелы.';

  return (
    <div className="movies-page">
      <h2>!!! All Movies !!! All Movies !!!</h2>
      <SearchForm
        onSubmit={submitHandler}
        searchFieldRef={searchFieldRef}
        query={query}
      />
      <FilterCheckbox
        onChange={handleIsShort}
        isShort={isShort}
      />
      <section className="movies__search-results">
        {isFetching ? <Preloader /> : ''}
        {!isFetching && localStorage.getItem('filtered') && (
          <MoviesCardList
            movies={JSON.parse(localStorage.getItem('filtered'))}
            isFetching={isFetching}
            emptyMsg={emptyMsg}
          />
        )}
      </section>
    </div>
  );
}

export default Movies;
