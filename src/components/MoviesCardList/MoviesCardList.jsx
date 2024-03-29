import React from 'react';
import './MoviesCardList.css';
import MoviesCard from '../MoviesCard/MoviesCard';

function MoviesCardList(props) {
  // 🟢 нормально что не все пропсы используются. На странице ВСЕХ фильмов нужны не все.
  // Некоторые нужны только для ЛАЙКНУТЫХ - на странице сохраненных.
  const {
    filteredMovies,
    updateFilteredMovies,
  } = props;

  return (
    <div className="moviesCardList">
      {filteredMovies.map((movie) => (
        <MoviesCard
          key={`${movie.movieId}-${movie._id}`}
          movie={movie}
          updateFilteredMovies={updateFilteredMovies}
        />
      ))}
    </div>
  );
}

export default MoviesCardList;
