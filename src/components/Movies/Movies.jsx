import React, {
  useState, useRef, useEffect, useCallback,
} from 'react';
import './Movies.css';
import Preloader from '../Preloader/Preloader';
import MoviesCardList from '../MoviesCardList/MoviesCardList';
import SearchForm from '../SearchForm/SearchForm';
import FilterCheckbox from '../FilterCheckbox/FilterCheckbox';
import getAllMoviesFromApi from '../../utils/BeatFilmApi';
import LS_KEYS from '../../constants/localStorageKeys';
import ERR_MSG from '../../constants/errorMessages';
import processMovies from '../../utils/processMovies';
import getAllMoviesFromLs from '../../utils/getAllMoviesFromLs';

function Movies() {
  const searchFieldRef = useRef(null);

  const [filteredMovies, setFilteredMovies] = useState([]);
  const [isFetching, setFetching] = useState(false);
  const [isShort, setShort] = useState(JSON.parse(localStorage.getItem(LS_KEYS.isShortAll) || 'false'));
  const [fetchErrMsg, setFetchErrMsg] = useState('');

  async function getAllMovies() {
    setFetching(true);

    // eslint-disable-next-line no-debugger
    // debugger;
    const allMoviesFromLS = getAllMoviesFromLs();
    if (allMoviesFromLS.length !== 0) {
      setFetching(false);
      return allMoviesFromLS;
    }

    let processedMovies;
    try {
      const allMoviesFromApi = await getAllMoviesFromApi();
      // 🍺 обрабатываю массив, приводя к виду бэка
      processedMovies = processMovies(allMoviesFromApi);
      localStorage.setItem(LS_KEYS.allMovies, JSON.stringify(processedMovies));
    } catch (error) {
      setFetchErrMsg(error);
    }
    setFetching(false);
    return processedMovies;
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
  Это предотвращает лишние ререндеры,
  особенно когда эти функции передаются дочкам в виде пропсов. */
  const searchMoviesAll = useCallback(async () => {
    try {
      localStorage.setItem(LS_KEYS.queryAll, searchFieldRef.current.value);

      // иду за 100. Если они есть в ЛС, фетчить не буду. Проверка встроена в fetchAllMovies
      const allMovies = await getAllMovies();
      const filtered = filterMovies(allMovies); // Фильтрую по поисковом запросу
      setFilteredMovies(filtered);
      localStorage.setItem(LS_KEYS.filtered, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error occurred while searching for movies: ', error);
    }
  }, [isShort]);
  /*    Если бы функция не зависела от внешних переменных, указал бы пустой массив зависимостей.
  Чтобы убедиться, что searchMoviesAll берет свежее значение isShort после его изменения,
  добавил isShort в зависимости юзКолбэка для searchMoviesAll.
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
  }, [searchMoviesAll]);

  useEffect(
    () => { localStorage.setItem(LS_KEYS.isShortAll, JSON.stringify(isShort)); },
    [isShort],
  );

  useEffect(() => {
    // Инициализация состояния isShort из localStorage
    const initialIsShort = JSON.parse(localStorage.getItem(LS_KEYS.isShortAll) || 'false');
    setShort(initialIsShort);

    //  после перезагрузки / при МОНТИРОВАНИИ Загрузка сохраненных фильтрованных фильмов
    const filteredMoviesFromLS = JSON.parse(localStorage.getItem(LS_KEYS.filtered));
    if (filteredMoviesFromLS) {
      setFilteredMovies(filteredMoviesFromLS);
    }
  }, []);

  return (
    <main className="movies">
      <SearchForm
        onSubmit={submitHandler}
        searchFieldRef={searchFieldRef}
        query={LS_KEYS.queryAll}
      />
      <FilterCheckbox onChange={handleIsShort} isShort={isShort} />
      <div className="movies__search-results">
        {/* если идет обращение к АПИ */}
        {isFetching ? <Preloader /> : ''}
        {/* Если НЕ идет загрузка и если массив отфильтрованных не пуст - показываю список */}
        {!isFetching && (filteredMovies.length > 0) && (
          <MoviesCardList filteredMovies={filteredMovies} />
        )}
        {/* Если НЕ идет загрузка и массив отфильтрованных пустой, то вместо списка даю ошибку */}
        {/* текст ошибки:
          - при пустом массиве = ERR_MSG.noResultsInAllMovies
          - при ошибке фетча или обработке данных = fetchAllMoviesErr */}
        {!isFetching && (filteredMovies.length === 0) && (fetchErrMsg === '')
          && (<h2>{ERR_MSG.noResultsInAllMovies}</h2>)}
        {!isFetching && (fetchErrMsg !== '') && (
          <h2>{ERR_MSG.fetchAllMoviesErr}</h2>
        )}
      </div>
    </main>
  );
}

export default Movies;
