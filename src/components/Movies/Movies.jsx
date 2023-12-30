import React, {
  useState, useRef, useEffect, useCallback,
} from 'react';
import './Movies.css';
import Preloader from '../Preloader/Preloader';
import MoviesCardList from '../MoviesCardList/MoviesCardList';
import SearchForm from '../SearchForm/SearchForm';
import FilterCheckbox from '../FilterCheckbox/FilterCheckbox';
import api from '../utils/Api';

function Movies() {
  const LOCAL_STORAGE_KEYS = {
    queryAll: 'queryAll',
    isShortAll: 'isShortAll',
    allMovies: 'allMovies',
    filtered: 'filtered',
    likedMovies: 'likedMovies',
  };
  const MESSAGES = {
    noResults: 'Введите или измените запрос',
  };

  const searchFieldRef = useRef(null);

  const [filteredMovies, setFilteredMovies] = useState([]);
  const [isFetching, setFetching] = useState(false);
  const [isShort, setShort] = useState(JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.isShortAll) || 'false'));

  async function fetchMovies() {
    setFetching(true);
    let movies = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.allMovies));
    if (!movies) {
      // const response = await fetch(BEATFILM_URL);
      const response = await api.getInitialMoviesData();
      movies = await response.json();
      localStorage.setItem(LOCAL_STORAGE_KEYS.allMovies, JSON.stringify(movies));
    }
    setFetching(false);
    return movies;
  }

  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& означает всю найденную строку
  }

  function compareStr(str1, str2) {
    const escapedStr1 = escapeRegExp(str1);
    const regex = new RegExp(`\\s*${escapedStr1}\\s*`, 'i');
    return regex.test(str2);
  }

  function filterMovies(movies) {
    const queryValue = searchFieldRef.current.value.trim();
    if (!queryValue) { return []; }
    // Если строка запроса пуста или содержит только пробелы, возвращаем пустой массив.
    return movies.filter((movie) => compareStr(queryValue, movie.nameRU)
      || compareStr(queryValue, movie.nameEN));
  }

  /*   useCallback возвращает мемоизированную версию переданной ему функции,
  Это помогает предотвращать ненужные ререндеры, особенно когда эти функции
  передаются в дочерние компоненты в качестве пропсов. */
  const searchMoviesAll = useCallback(async () => {
    try {
      // сохраняем запрос перед поиском
      localStorage.setItem(LOCAL_STORAGE_KEYS.queryAll, searchFieldRef.current.value);
      const allMovies = await fetchMovies();
      const filtered = filterMovies(allMovies);
      setFilteredMovies(filtered);
      localStorage.setItem(LOCAL_STORAGE_KEYS.filtered, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error occurred while searching for movies: ', error);
    }
  }, [isShort]);

  /* Указываем пустой массив зависимостей, если функция не зависит от внешних переменных
  Чтобы убедиться, что searchMoviesAll использует актуальное значение isShort после его изменения,
  добавил isShort в массив зависимостей useCallback для searchMoviesAll.
  Это гарантирует, что функция searchMoviesAll обновляется каждый раз, когда isShort изменяется.
*/
  const submitHandler = useCallback(async (e) => {
    e.preventDefault();
    await searchMoviesAll();
  }, [searchMoviesAll]); // Указываем searchMoviesAll как зависимость

  const handleIsShort = useCallback(() => {
    setShort((prevIsShort) => {
      const newIsShortValue = !prevIsShort;
      return newIsShortValue;
    });
    searchMoviesAll();
  }, [searchMoviesAll]); // Указываем isShort и searchMoviesAll как зависимости

  // Сработает при каждом изменении isShort
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.isShortAll, JSON.stringify(isShort));
  }, [isShort]);

  // Сработает только при МОНТИРОВАНИИ
  useEffect(() => {
    // Инициализация состояния isShort из localStorage
    const initialIsShort = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.isShortAll) || 'false');
    setShort(initialIsShort);

    // Загрузка сохраненных фильтрованных фильмов после перезагрузки
    const filteredMoviesFromLS = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.filtered));
    if (filteredMoviesFromLS) {
      setFilteredMovies(filteredMoviesFromLS);
    } else {
      // Если фильтрованные фильмы не найдены, выполняем поиск
      searchMoviesAll();
    }
  }, []);

  return (
    <main className="movies">
      {/*  ex movies-page */}
      <SearchForm
        onSubmit={submitHandler}
        searchFieldRef={searchFieldRef}
        query={LOCAL_STORAGE_KEYS.queryAll}
      />
      <FilterCheckbox onChange={handleIsShort} isShort={isShort} />
      <div className="movies__search-results">
        {isFetching ? <Preloader /> : ''}
        {!isFetching && (filteredMovies.length > 0) && (
          <MoviesCardList
            movies={filteredMovies}
            isFetching={isFetching}
          />
        )}
        {!isFetching && (filteredMovies.length === 0) && (
          <h2>{MESSAGES.noResults}</h2>
        )}
      </div>
    </main>
  );
}

export default Movies;
