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
import { useLocalStorageState as useStorage } from '../../utils/hooks';

function Movies() {
  console.log('rerender movies');
  const searchFieldRef = useRef(null);
  const [filteredMovies, setFilteredMovies] = useStorage('filteredMovies', []);
  const [isFetching, setFetching] = useState(false);
  const [isShort, setShort] = useStorage('isShort', JSON.parse(localStorage.getItem(LS_KEYS.isShortAll) || 'false'));
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
    // возвращает строку с экранированными спец символами
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& означает всю найденную строку
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
      return [];
    }
    return movies.filter((movie) => {
      const isNameMatch = compareStr(queryValue, movie.nameRU)
        || compareStr(queryValue, movie.nameEN);
      // Если чекбокс активен, дополнительно проверяем длит-ть. Возвращаем результат ДВУХ проверок:
      // 1) сличения текстового запроса и 2) сравнения длительности.
      // Выходим из функции, не исполняя следующие строки.
      if (isShort) {
        return isNameMatch && movie.duration <= 40;
      }
      // чекбокс НЕактивен - возврат ТОЛЬКО результата проверки name (без проверки длительности).
      return isNameMatch;
    });
  }

  /*   useCallback возвращает мемоизированную версию переданной ему функции,
  Это предотвращает лишние ререндеры, особенно когда функция передается дочкам в виде пропсов. */
  const searchMoviesAll = useCallback(async () => {
    console.log('start searchMoviesAll');
    try {
      localStorage.setItem(LS_KEYS.queryAll, searchFieldRef.current.value);
      // иду за Соткой в ЛС или АПИ. Проверка встроена в getAllMovies
      const allMovies = await getAllMovies();
      const filtered = filterMovies(allMovies); // Фильтрую по поисковом запросу
      setFilteredMovies(filtered);
    } catch (error) {
      console.error('Error occurred while searching for movies: ', error);
    }
  }, [isShort]);
  /*    Если бы функция не зависела от внешних переменных, указал бы пустой массив зависимостей.
  Чтобы убедиться, что searchMoviesAll берет свежее значение isShort после его изменения,
  добавил isShort в зависимости юзКолбэка для searchMoviesAll.
  Это гарантирует, что функция searchMoviesAll обновляется каждый раз, когда isShort изменяется.  */

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    await searchMoviesAll();
  }, [searchMoviesAll]);

  // Если используем useCallback для обработчика событий,
  // проверяем, что все необходимые зависимости корректно указаны в массиве зависимостей.
  // Если handleIsShort зависит от isShort или других переменных / функций,
  // они должны быть включены в массив зависимостей.
  // const handleIsShort = useCallback(() => {
  //   setShort((prevIsShort) => !prevIsShort);
  //   searchMoviesAll();
  // }, [searchMoviesAll, isShort]);

  // const handleIsShort = () => {
  //   setShort(
  //     (prevIsShort) => !prevIsShort,
  //     () => { searchMoviesAll(); },
  //   );
  // };

  const handleIsShort = () => {
    setShort((prevIsShort) => !prevIsShort);
  };
  useEffect(() => {
    searchMoviesAll();
  }, [isShort]);

  useEffect(() => {
    // При перезагрузке / МОНТИРОВАНИИ : Инициализация стейтов короткометражек и фильтрованных из ЛС
    const initialIsShort = JSON.parse(localStorage.getItem(LS_KEYS.isShortAll) || 'false');
    setShort(initialIsShort);

    const filteredMoviesFromLS = JSON.parse(localStorage.getItem(LS_KEYS.filtered));
    if (filteredMoviesFromLS) {
      setFilteredMovies(filteredMoviesFromLS);
    }
  }, []);

  // const [count, setCount] = useState(0);

  // const incrementCount = () => {
  //   setCount(count + 1, () => {
  //     console.log('Состояние было обновлено. Текущее значение count:', count);
  //   });
  // };

  return (
    <main className="movies">
      {/* <div>
        <p>
          Вы нажали
          {count}
          раз.
        </p>
        <button
          onClick={incrementCount}
          type="button"
        >
          Нажми на меня
        </button>
      </div> */}
      <SearchForm
        onSubmit={handleSubmit}
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
