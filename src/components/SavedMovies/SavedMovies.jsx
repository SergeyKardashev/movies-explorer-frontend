import React, { useState, useRef } from 'react';
import './SavedMovies.css';
import MoviesCardList from '../MoviesCardList/MoviesCardList';
import SearchForm from '../SearchForm/SearchForm';
import FilterCheckbox from '../FilterCheckbox/FilterCheckbox';
import LS_KEYS from '../../constants/localStorageKeys';
import ERR_MSG from '../../constants/errorMessages';
import compareStr from '../../utils/compareStr';
import shortMovieMaxDuration from '../../constants/shortMovieMaxDuration';

function SavedMovies() {
  console.log('SavedMovies');

  // получаю лайкнутые фильмы из ЛС
  function getLikedMovies() {
    const rawMovies = localStorage.getItem(LS_KEYS.likedMovies);
    let movies = [];

    // Проверяю, не является ли rawMovies равным null, пустой строке или строке "undefined"
    if (rawMovies && rawMovies !== 'undefined' && rawMovies !== '') {
      movies = JSON.parse(rawMovies);
    }
    return movies;
  }

  const searchFieldRef = useRef(null);
  const [filteredMovies, setFilteredMovies] = useState(getLikedMovies());
  const [isShort, setShort] = useState(false);

  // Фильтрую по поисковом запросу
  function filterMovies(movies, isMovieShort, queryValue) {
    return movies.filter((movie) => {
      const isNameMatch = compareStr(queryValue, movie.nameRU)
        || compareStr(queryValue, movie.nameEN);
      // Если ЧБ активен, дополнительно проверяем длит-ть. Возвращаем результат ДВУХ проверок:
      // 1) сличения текстового запроса и 2) сравнения длительности.
      // Выходим из функции, не исполняя следующие строки.
      if (isMovieShort) {
        return isNameMatch && movie.duration <= shortMovieMaxDuration;
      }
      return isNameMatch; // ЧБ НЕактив: возврат ТОЛЬКО результата name check без проверки длит-ти
    });
  }

  // метод updateFilteredMovies получает на вход фильмы, которые были лайкнуты
  // и из которых был удален фильм, который убрал их сохраненных

  // выполняю фильтрацию по isMovieShort, queryValue

  // обновляю стейт filteredMovies через setFilteredMovies

  const updateFilteredMovies = (filteredLikedMovies) => {
    const queryValue = searchFieldRef.current.value.trim();

    const filtered = filterMovies(filteredLikedMovies, isShort, queryValue);
    setFilteredMovies(filtered);
  };

  const searchMoviesLiked = (queryValue, nextIsShort) => {
    const likedMovies = getLikedMovies();
    const filtered = filterMovies(likedMovies, nextIsShort, queryValue);
    setFilteredMovies(filtered);
  };

  const handleSubmit = () => {
    const queryValue = searchFieldRef.current.value.trim();
    searchMoviesLiked(queryValue, isShort);
  };

  const handleIsShort = () => {
    const queryValue = searchFieldRef.current.value.trim();
    const nextIsShort = !isShort;
    setShort(nextIsShort);
    searchMoviesLiked(queryValue, nextIsShort);
  };

  return (
    <main className="movies">
      <SearchForm
        onSubmit={handleSubmit}
        searchFieldRef={searchFieldRef}
      />
      <FilterCheckbox onChange={handleIsShort} isShort={isShort} />
      {/* если фильмы есть -  MoviesCardList. Если фильмов нет - заглушка фильмов нет */}
      <div className="movies__search-results">
        {(filteredMovies.length > 0) && (
          <MoviesCardList
            filteredMovies={filteredMovies}
            updateFilteredMovies={updateFilteredMovies}
          />
        )}
        {(filteredMovies.length === 0) && <h2>{ERR_MSG.noResultsInSavedMovies}</h2>}
      </div>
    </main>
  );
}

export default SavedMovies;
