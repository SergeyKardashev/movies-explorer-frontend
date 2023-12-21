import React, { useState, useRef, useEffect } from 'react';
import './SavedMovies.css';
// import Preloader from '../Preloader/Preloader';
import MoviesCardList from '../MoviesCardList/MoviesCardList';
import SearchForm from '../SearchForm/SearchForm';
import FilterCheckbox from '../FilterCheckbox/FilterCheckbox';

function SavedMovies() {
  const query = 'queryLiked';
  const searchFieldRef = useRef(null);

  const [filteredLikedMovies, setFilteredLikedMovies] = useState([]);
  // const [isFetching, setFetching] = useState(false);
  const [isShortLiked, setShortLiked] = useState(JSON.parse(localStorage.getItem('isShortLiked') || 'false')); // 'false' в кавычках парсить

  function compareStr(str1, str2) {
    const regex = new RegExp(`\\s*${str1}\\s*`, 'i'); // Создаю регулярку из первой строки, 'i' = игнорир регистра
    return regex.test(str2); // check if str2 matches regExp. Вернет true или false
  }

  const searchMoviesLiked = async () => {
    localStorage.setItem(query, searchFieldRef.current.value); // сохраняю запрос
    localStorage.setItem('isShortLiked', isShortLiked); // сохраняю чекбокс

    let likedMovies = []; // создаю массив для фильмов из АПИ
    if (localStorage.getItem('likedMovies') === null) {
      localStorage.setItem('likedMovies', JSON.stringify(likedMovies));
    } else {
      likedMovies = JSON.parse(localStorage.getItem('likedMovies'));
    }

    const filteredLiked = likedMovies.filter((movie) => {
      if (!searchFieldRef.current.value || searchFieldRef.current.value === ' ') {
        return false;
      }
      if (
        compareStr(searchFieldRef.current.value, movie.nameRU)
        || compareStr(searchFieldRef.current.value, movie.nameEN)) {
        return true;
      }
      return false;
    });
    setFilteredLikedMovies(filteredLiked);
    localStorage.setItem('filteredLiked', JSON.stringify(filteredLiked));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    searchMoviesLiked();
  };

  const handleIsShort = () => {
    setShortLiked(!isShortLiked);
    searchMoviesLiked();
  };

  useEffect(() => {
    if (!localStorage.getItem('filteredLiked')) {
      searchMoviesLiked();
    }
  }, [filteredLikedMovies, isShortLiked]);

  const emptyMsg = 'Ничего показать. Либо нет сохраненных фильмов, либо запрос пустой или содержит лишь пробелы.';

  // let movies;

  // if (!localStorage.getItem('likedMovies')) {
  //   movies = [];
  // }
  // if (localStorage.getItem('likedMovies')) {
  //   movies = JSON.parse(localStorage.getItem('likedMovies'));
  // }

  // console.log('movies', movies);

  // const likedArrLength = movies.length;
  // console.log('likedArrLength ', likedArrLength);

  // const isLikedArrEmpty = movies.length === 0;
  // console.log('isLikedArrEmpty', isLikedArrEmpty);

  return (
    <div className="movies-page">
      <h2>!!! SavedMovies !!! SavedMovies !!!</h2>
      <SearchForm
        onSubmit={submitHandler}
        searchFieldRef={searchFieldRef}
        query={query}
      />
      <FilterCheckbox
        onChange={handleIsShort}
        isShort={isShortLiked}
      />
      <section className="movies__search-results">
        {/* {isFetching ? <Preloader /> : ''} */}
        {localStorage.getItem('filteredLiked') && (
          <MoviesCardList
            movies={JSON.parse(localStorage.getItem('filteredLiked'))}
            emptyMsg={emptyMsg}
          />
        )}
      </section>
    </div>
  );
}

export default SavedMovies;
