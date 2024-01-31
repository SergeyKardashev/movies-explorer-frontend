import React from 'react';
import './MoviesCardList.css';
import MoviesCard from '../MoviesCard/MoviesCard';

function MoviesCardList(props) {
  // 🟢 это нормально что не все пропсы используются.
  // На странице ВСЕХ фильмов нужны не все пропсы
  // Некоторые нужны только для ЛАЙКНУТЫХ - на странице сохраненных.
  const {
    filteredMovies,
    setFilteredMovies,
  } = props;

  return (
    <div className="moviesCardList">
      {filteredMovies.map((movie) => (
        <MoviesCard
          key={movie.movieId}
          movie={movie}
          setFilteredMovies={setFilteredMovies}
        />
      ))}
    </div>
  );
}

export default MoviesCardList;
