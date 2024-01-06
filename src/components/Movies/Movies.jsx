import React, {
  useState, useRef, useEffect, useCallback,
} from 'react';
import './Movies.css';
import Preloader from '../Preloader/Preloader';
import MoviesCardList from '../MoviesCardList/MoviesCardList';
import SearchForm from '../SearchForm/SearchForm';
import FilterCheckbox from '../FilterCheckbox/FilterCheckbox';
import getInitialMoviesData from '../utils/MoviesApi';
import LOCAL_STORAGE_KEYS from '../../constants/localStorageKeys';
import ERR_MSG from '../../constants/errorMessages';

function Movies() {
  const searchFieldRef = useRef(null);

  const [filteredMovies, setFilteredMovies] = useState([]);
  const [isFetching, setFetching] = useState(false);
  const [isShort, setShort] = useState(JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.isShortAll) || 'false'));

  async function fetchMovies() {
    setFetching(true);
    let movies = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.allMovies));
    if (!movies) {
      movies = await getInitialMoviesData();
      localStorage.setItem(LOCAL_STORAGE_KEYS.allMovies, JSON.stringify(movies));
    }
    setFetching(false);
    return movies;
  }

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
    if (!queryValue) { return []; }
    // Если строка запроса пуста / содержит лишь пробелы, возвращаю пустой массив вместо фильмов.
    // Если запрос не пуст, фильтрую массив. Откидываю все фильмы, не прощедшие проверку.
    // Проверка выше - название фильма  с любым
    return movies.filter((movie) => compareStr(queryValue, movie.nameRU)
      || compareStr(queryValue, movie.nameEN));
  }

  /*   useCallback возвращает мемоизированную версию переданной ему функции,
  Это предотвращает лишние ререндеры, особенно когда эти функции
  передаются дочкам в виде пропсов. */
  const searchMoviesAll = useCallback(async () => {
    try {
      // сохраняем запрос перед поиском
      localStorage.setItem(LOCAL_STORAGE_KEYS.queryAll, searchFieldRef.current.value);

      // иду к АПИ за фильмами. Если они есть в ЛС, фетчить не буду. Проверка встроена в fetchMovies
      const allMovies = await fetchMovies();
      const filtered = filterMovies(allMovies); // Фильтрую по поисковом запросу
      setFilteredMovies(filtered);
      localStorage.setItem(LOCAL_STORAGE_KEYS.filtered, JSON.stringify(filtered));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error occurred while searching for movies: ', error);
    }
  }, [isShort]);
  /*    Если бы функция не зависела от внешних переменных, указал бы пустой массив зависимостей.
  Чтобы убедиться, что searchMoviesAll берет свежее значение isShort после его изменения,
  добавил isShort в зависимости юзКолбэка для searchMoviesAll.
  Это гарантирует, что функция searchMoviesAll обновляется каждый раз, когда isShort изменяется.
  */
  //

  // 🔴 убрал e из аргументов и e.preventDefault из обновленной функции,
  // т.к.уже есть в дочернем компоненте
  // потом вернул, тк выяснилось, что не нужна лайв валидация и кастомная валидация сабмита.
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
  //  🔴isShort удалил из зависимостей. Не помню почему.

  // при каждом изменении стейта isShort пишу его в ЛС
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.isShortAll, JSON.stringify(isShort));
  }, [isShort]);

  // только при МОНТИРОВАНИИ читаю значение isShort из ЛС и устанавливаю стейт
  useEffect(() => {
    // Инициализация состояния isShort из localStorage
    const initialIsShort = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.isShortAll) || 'false');
    setShort(initialIsShort);

    //  после перезагрузки / при МОНТИРОВАНИИ Загрузка сохраненных фильтрованных фильмов
    const filteredMoviesFromLS = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.filtered));
    if (filteredMoviesFromLS) {
      setFilteredMovies(filteredMoviesFromLS);
    }
    // 🔴 наверное тут ошибка - не нужно при монтировании обращаться к АПИ
    // else {
    //   // Если фильтрованные фильмы не найдены, выполняем поиск
    //   searchMoviesAll();
    // }
  }, []);

  return (
    <main className="movies">
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
            filteredMovies={filteredMovies}
            isFetching={isFetching}
          />
        )}
        {!isFetching && (filteredMovies.length === 0) && (
          <h2>{ERR_MSG.noResultsInAllMovies}</h2>
        )}
      </div>
    </main>
  );
}

export default Movies;
