import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
} from 'react';
import './SavedMovies.css';
import MoviesCardList from '../MoviesCardList/MoviesCardList';
import SearchForm from '../SearchForm/SearchForm';
import FilterCheckbox from '../FilterCheckbox/FilterCheckbox';
import LOCAL_STORAGE_KEYS from '../../constants/localStorageKeys';
import ERR_MSG from '../../constants/errorMessages';

function SavedMovies() {
  //

  // получаю лайкнутые фильмы из ЛС
  // 🔴 МБ зря асинхронность.
  // async function getLikedMovies() {
  //   const movies = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.likedMovies));
  //   return movies || [];
  // }

  // получаю лайкнутые фильмы из ЛС
  function getLikedMoviesFromLS() {
    const movies = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.likedMovies));
    return movies || [];
  }

  const searchFieldRef = useRef(null);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [isShort, setShort] = useState(false);

  /*
  escapeRegExp - Функция для экранирования спец символов в строке,
  которая будет использоваться в регулярке. Например слеш в строке "24/7" или "WTF?".
  Чтобы использовать произвольную строку в качестве части регулярки, нужно убедиться,
  что спец символы регулярок в этой строке воспринимаются движком БУКВАЛЬНО,
  а не как часть синтаксиса регулярки.
  */
  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& означает всю найденную строку
    // возвращает строку с экранированными спец символами
  }

  // сравниватель строк. 1я строка - запрос. 2я строка - регулярка
  function compareStr(str1, str2) {
    const escapedStr1 = escapeRegExp(str1);
    const regex = new RegExp(`\\s*${escapedStr1}\\s*`, 'i');
    return regex.test(str2);
  }

  // Фильтрую по поисковом запросу
  function filterMovies(movies) {
    const queryValue = searchFieldRef.current.value.trim();
    if (!queryValue) {
      // Если строка запроса пуста / содержит лишь пробелы,
      // возвращаю весь массив фильмов, поданных на фильтрацию.
      return movies;
    }
    return movies.filter((movie) => compareStr(queryValue, movie.nameRU)
      || compareStr(queryValue, movie.nameEN));
  }

  const searchMoviesLiked = useCallback(() => {
    const likedMoviesFromLS = getLikedMoviesFromLS();
    // const filteredLiked = filterMovies(likedMoviesFromLS); // сократил запись вложением
    setFilteredMovies(filterMovies(likedMoviesFromLS));
  }, [isShort]);
  // 🔴 МБ зря асинхронность.
  // const searchMoviesLiked = useCallback(async () => {
  //   const gottenLikedMovies = await getLikedMovies();
  //   const filteredLiked = filterMovies(gottenLikedMovies);
  //   setFilteredMovies(filteredLiked);
  // }, [isShort]);

  const submitHandler = useCallback(async (e) => {
    e.preventDefault();
    await searchMoviesLiked();
  }, [searchMoviesLiked]);

  const handleIsShort = useCallback(() => {
    setShort((prevIsShort) => {
      const newIsShortValue = !prevIsShort;
      return newIsShortValue;
    });
    searchMoviesLiked();
  }, [searchMoviesLiked]);

  useEffect(() => {
    searchMoviesLiked();
  }, [searchMoviesLiked]);

  return (
    <main className="movies">
      <SearchForm
        onSubmit={submitHandler}
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
        {/* {(!localStorage.getItem(LOCAL_STORAGE_KEYS.likedMovies))
          && (<h2>{ERR_MSG.noResultsInSavedMovies}</h2>)} */}
        {(filteredMovies.length === 0) && <h2>{ERR_MSG.noResultsInSavedMovies}</h2>}
      </div>
    </main>
  );
}

export default SavedMovies;
