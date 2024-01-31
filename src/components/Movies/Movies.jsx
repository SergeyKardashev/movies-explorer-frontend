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
import useStorage from '../../utils/hooks';
import MoreBtn from '../MoreBtn/MoreBtn';
import compareStr from '../../utils/compareStr';

//  1280px+ = 16шт. Кнопка = доп 4шт.
//  768-1280 = 8шт. Кнопка = доп 2шт.
//  320-768 — 5шт. Кнопка = доп 2шт.
const initialCardsAmount = { desktop: 16, tablet: 8, phone: 5 };
const extraCardsNumber = { desktop: 4, tablet: 2, phone: 2 };

// return в каждом условии для краткости
const getDeviceType = (clientWidth) => {
  if (clientWidth >= 1280) {
    return 'desktop';
  }
  if ((clientWidth >= 768) && (clientWidth < 1280)) {
    return 'tablet';
  }
  return 'phone';
};

function Movies() {
  const [deviceType, setDeviceType] = useState(
    () => getDeviceType(document.documentElement.clientWidth),
  );
  const searchFieldRef = useRef(null);
  const [filteredMovies, setFilteredMovies] = useStorage('filteredMovies', []);
  const [isFetching, setFetching] = useState(false);
  const [isShort, setShort] = useStorage('isShort', JSON.parse(localStorage.getItem(LS_KEYS.isShort) || 'false'));
  const [fetchErrMsg, setFetchErrMsg] = useState('');
  const [isMoreBtnVisible, setMoreBtnVisible] = useState(false);

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

  // Фильтрую по поисковом запросу
  function filterMovies(movies, isMovieShort, queryValue) {
    return movies.filter((movie) => {
      const isNameMatch = compareStr(queryValue, movie.nameRU)
        || compareStr(queryValue, movie.nameEN);
      // Если чекбокс активен, дополнительно проверяю длит-ть. Возвращаю результат ДВУХ проверок:
      // 1) сличения текстового запроса и 2) сравнения длительности.
      // Выходим из функции, не исполняя следующие строки.
      if (isMovieShort) {
        return isNameMatch && movie.duration <= 40;
      }
      return isNameMatch; // ЧБ НЕактив: возврат ТОЛЬКО результата name check без проверки длит-ти
    });
  }

  const getNextMovies = (movies, startIndex, limit) => {
    // проверяю размер оставшегося массива (следующий индекс есть ли)
    // и выставлять значение стейта видимости кнопки ЕЩЕ

    // Массив, который верну (и отображу)
    const arrayToReturn = movies.slice(startIndex, startIndex + limit);

    // Сколько элементов подано на вход:
    const submittedArrLength = movies.length;

    // Сколько элементов верну на показ:
    const returnedArrLength = arrayToReturn.length;

    // Сколько элементов осталось не отображено
    const numberOfRemainedItems = submittedArrLength - (startIndex + returnedArrLength);

    if (numberOfRemainedItems > 0) {
      // console.log('осталось что-то непоказанное, ставлю кнопку');
      setMoreBtnVisible(true);
    } else {
      // console.log('непоказанного нет, прячу кнопку');
      setMoreBtnVisible(false);
    }

    return arrayToReturn;
  };

  // todo - порядок аргументов
  const searchMoviesAll = async (previousMovies, queryValue, isMovieShort) => {
    if (!queryValue) {
      return;
    }
    try {
      localStorage.setItem(LS_KEYS.queryAll, queryValue);
      // иду за Соткой в ЛС или АПИ. Проверка встроена в getAllMovies
      const allMovies = await getAllMovies();
      // Фильтрую по поисковом запросу
      const filtered = filterMovies(allMovies, isMovieShort, queryValue);

      // стартовый индекс выставляю равным длине массива, скормленного поиску.
      // Размер зависит от того, кто запустил ищейку.
      // Если нажата кнопка поиска или чекбокс, то массив пуст.
      // Если нажата кнопка ЕЩЕ, то массив - то что уже на экране.
      const startIndex = previousMovies.length;

      // устанавливаю размер порции для загрузки - по кнопке ЕЩЕ
      const limit = startIndex === 0
        ? initialCardsAmount[deviceType]
        : extraCardsNumber[deviceType];

      const nextMovies = getNextMovies(filtered, startIndex, limit);

      setFilteredMovies([...previousMovies, ...nextMovies]);
    } catch (error) {
      console.error('Error occurred while searching for movies: ', error);
    }
  };

  const handleSubmit = async (e) => {
    // todo - деактивировать кнопку 'найти' после поиска до изменения поля
    const queryValue = searchFieldRef.current.value.trim();
    e.preventDefault();
    setFilteredMovies([]);
    await searchMoviesAll([], queryValue, isShort);
  };

  const handleIsShort = async () => {
    const queryValue = searchFieldRef.current.value.trim();
    const nextIsShort = !isShort;
    setShort(nextIsShort);
    setFilteredMovies([]);
    await searchMoviesAll([], queryValue, nextIsShort);
  };

  const handleShowMore = async (e) => {
    const queryValue = searchFieldRef.current.value.trim();
    e.preventDefault();
    await searchMoviesAll(filteredMovies, queryValue, isShort);
  };

  useEffect(() => {
    // При перезагрузке / МОНТИРОВАНИИ : Инициализация стейтов короткометражек и фильтрованных из ЛС
    const initialIsShort = JSON.parse(localStorage.getItem(LS_KEYS.isShort) || 'false');
    setShort(initialIsShort);

    const filteredMoviesFromLS = JSON.parse(localStorage.getItem(LS_KEYS.filtered));
    if (filteredMoviesFromLS) {
      setFilteredMovies(filteredMoviesFromLS);
    }

    // При перезагрузке / МОНТИРОВАНИИ чтобы кнопка была пересчитана и отображена если надо:
    // Восстанавливаю поисковый запрос из ЛС
    const savedQuery = localStorage.getItem(LS_KEYS.queryAll);
    // проверяю что он не пуст
    if (savedQuery) {
      searchFieldRef.current.value = savedQuery;
      // Выполняю поиск с восстановленным запросом
      handleSubmit({ preventDefault: () => { } });
      // { preventDefault: () => { } } чтобы избежать ошибок из - за отсутствия объекта события
      // т.к.вызываю отправку формы напрямую без события
    }

    let resizeTimer;

    function handleWindowResize() {
      clearTimeout(resizeTimer); // Очистка предыдущего таймера

      resizeTimer = setTimeout(() => {
        setDeviceType(getDeviceType(document.documentElement.clientWidth));
      }, 1000);
    }
    window.addEventListener('resize', handleWindowResize);

    return () => {
      clearTimeout(resizeTimer); // Очистка таймера при размонтировании
      window.removeEventListener('resize', handleWindowResize);
    };
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
        {!isFetching && (filteredMovies.length > 0)
          && (<MoviesCardList filteredMovies={filteredMovies} />)}
        {/* Если НЕидет загрузка и массив отфильтрованных пуст, то вместо списка даю ошибку: */}
        {/*  - при пустом массиве = ERR_MSG.noResultsInAllMovies
             - при ошибке фетча или обработке данных = fetchAllMoviesErr */}
        {!isFetching && (filteredMovies.length === 0) && (fetchErrMsg === '') && (<h2>{ERR_MSG.noResultsInAllMovies}</h2>)}
        {!isFetching && (fetchErrMsg !== '') && (<h2>{ERR_MSG.fetchAllMoviesErr}</h2>)}
        {isMoreBtnVisible ? (<MoreBtn onShowMore={handleShowMore} />) : ''}

      </div>
    </main>
  );
}

export default Movies;
