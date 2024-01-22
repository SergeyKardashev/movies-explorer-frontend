import React, {
  useState,
  useRef,
} from 'react';
import './SavedMovies.css';
import MoviesCardList from '../MoviesCardList/MoviesCardList';
import SearchForm from '../SearchForm/SearchForm';
import FilterCheckbox from '../FilterCheckbox/FilterCheckbox';
import LS_KEYS from '../../constants/localStorageKeys';
import ERR_MSG from '../../constants/errorMessages';

function SavedMovies() {
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

  /*   escapeRegExp - Функция для экранирования спец символов в строке,
  которая будет использоваться в регулярке. Например слеш в строке "24/7" или "WTF?".
  Чтобы использовать произвольную строку в качестве части регулярки, нужно убедиться,
  что спец символы регулярок в этой строке воспринимаются движком БУКВАЛЬНО,
  а не как часть синтаксиса регулярки.   */
  function escapeRegExp(string) {
    // возвращает строку с экранированными спец символами
    if (typeof string !== 'string') {
      console.log('НЕ строковой тип данных на входе ');
      return '';
    }
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& означает всю найденную строку
  }

  // сравниватель строк. 1я строка - запрос. 2я строка - регулярка
  function compareStr(str1, str2) {
    const escapedStr1 = escapeRegExp(str1);
    const regex = new RegExp(`\\s*${escapedStr1}\\s*`, 'i');
    return regex.test(str2);
  }

  // Фильтрую по поисковом запросу
  function filterMovies(movies, isMovieShort, queryValue) {
    return movies.filter((movie) => {
      const isNameMatch = compareStr(queryValue, movie.nameRU)
        || compareStr(queryValue, movie.nameEN);
      // Если ЧБ активен, дополнительно проверяем длит-ть. Возвращаем результат ДВУХ проверок:
      // 1) сличения текстового запроса и 2) сравнения длительности.
      // Выходим из функции, не исполняя следующие строки.
      if (isMovieShort) {
        return isNameMatch && movie.duration <= 40;
      }
      return isNameMatch; // ЧБ НЕактив: возврат ТОЛЬКО результата name check без проверки длит-ти
    });
  }
  const searchMoviesLiked = (queryValue, nextIsShort) => {
    const likedMovies = getLikedMovies();
    const filtered = filterMovies(likedMovies, nextIsShort, queryValue);
    setFilteredMovies(filtered);
  };

  const handleSubmit = (e) => {
    const queryValue = searchFieldRef.current.value.trim();
    e.preventDefault();
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
            setFilteredMovies={setFilteredMovies}
          />
        )}
        {(filteredMovies.length === 0) && <h2>{ERR_MSG.noResultsInSavedMovies}</h2>}
      </div>
    </main>
  );
}

export default SavedMovies;
