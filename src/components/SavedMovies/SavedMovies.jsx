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

function SavedMovies() {
  const LOCAL_STORAGE_KEYS = {
    queryAll: 'queryAll',
    isShortAll: 'isShortAll',
    allMovies: 'allMovies',
    filtered: 'filtered',
    likedMovies: 'likedMovies',
  };
  const MESSAGES = {
    noResults: 'Ничего не найдено или нет сохраненных фильмов',
  };

  const searchFieldRef = useRef(null);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [isShort, setShort] = useState(false);

  async function getLikedMovies() {
    const movies = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.likedMovies));
    return movies || [];
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
    if (!queryValue) {
      return movies;
    }
    return movies.filter((movie) => compareStr(queryValue, movie.nameRU)
      || compareStr(queryValue, movie.nameEN));
  }

  const searchMoviesLiked = useCallback(async () => {
    const gottenLikedMovies = await getLikedMovies();
    const filteredLiked = filterMovies(gottenLikedMovies);
    setFilteredMovies(filteredLiked);
  }, [isShort]);

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
      <div className="movies__search-results">
        {/* ex movies__search-results */}
        {(filteredMovies.length > 0) && (
          <MoviesCardList
            movies={filteredMovies}
          />
        )}
        {(!localStorage.getItem(LOCAL_STORAGE_KEYS.likedMovies)) && (<h2>{MESSAGES.noResults}</h2>)}
      </div>
    </main>
  );
}

export default SavedMovies;
