import React, {
  useState, useRef, useEffect,
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
import { useLocalStorageState as useStorage } from '../../utils/hooks';

function Movies() {
  const searchFieldRef = useRef(null);
  const [filteredMovies, setFilteredMovies] = useStorage('filteredMovies', []);
  const [isFetching, setFetching] = useState(false);
  const [isShort, setShort] = useStorage('isShort', JSON.parse(localStorage.getItem(LS_KEYS.isShort) || 'false'));
  const [fetchErrMsg, setFetchErrMsg] = useState('');

  async function getAllMovies() {
    // Берет фильмы либо из ЛС, либо из бэка
    setFetching(true);
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

  /* escapeRegExp - Функция экранирования спец символов в строке, применяемой в регулярке.
  Например слеш в строке "24/7" или "WTF?". Чтоб использовать любую строку как часть регулярки,
  нужно убедиться, что спец символы регулярок в этой строке воспринимаются движком БУКВАЛЬНО,
  а не как часть синтаксиса регулярки.   */
  function escapeRegExp(string) {
    // Возвращает строку с экранированными спец символами
    // Проверяю тип данных на входе для защиты от падения проги
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

  const searchMoviesAll = async (queryValue, isMovieShort) => {
    if (!queryValue) {
      return;
    }
    try {
      localStorage.setItem(LS_KEYS.queryAll, queryValue);
      // иду за Соткой в ЛС или АПИ. Проверка встроена в getAllMovies
      const allMovies = await getAllMovies();
      // Фильтрую по поисковом запросу
      const filtered = filterMovies(allMovies, isMovieShort, queryValue);
      setFilteredMovies(filtered);
    } catch (error) {
      console.error('Error occurred while searching for movies: ', error);
    }
  };

  const handleSubmit = async (e) => {
    const queryValue = searchFieldRef.current.value.trim();
    e.preventDefault();
    await searchMoviesAll(queryValue, isShort);
  };

  const handleIsShort = () => {
    const queryValue = searchFieldRef.current.value.trim();
    const nextIsShort = !isShort;
    setShort(nextIsShort);
    searchMoviesAll(queryValue, nextIsShort);
  };

  useEffect(() => {
    // При перезагрузке / МОНТИРОВАНИИ : Инициализация стейтов короткометражек и фильтрованных из ЛС
    const initialIsShort = JSON.parse(localStorage.getItem(LS_KEYS.isShort) || 'false');
    setShort(initialIsShort);

    const filteredMoviesFromLS = JSON.parse(localStorage.getItem(LS_KEYS.filtered));
    if (filteredMoviesFromLS) {
      setFilteredMovies(filteredMoviesFromLS);
    }
  }, []);

  return (
    <main className="movies">
      <SearchForm
        onSubmit={handleSubmit}
        searchFieldRef={searchFieldRef}
        query={LS_KEYS.queryAll}
      />
      <FilterCheckbox onChange={handleIsShort} isShort={isShort} />
      <div className="movies__search-results">
        {isFetching ? <Preloader /> : ''}
        {!isFetching && (filteredMovies.length > 0) && (
          <MoviesCardList filteredMovies={filteredMovies} />
        )}
        {/* Если НЕидет загрузка и массив отфильтрованных пуст, то вместо списка даю ошибку: */}
        {/*  - при пустом массиве = ERR_MSG.noResultsInAllMovies
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
