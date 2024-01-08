import React from 'react';
import './MoviesCardList.css';
import MoviesCard from '../MoviesCard/MoviesCard';
import MoreBtn from '../MoreBtn/MoreBtn';

function MoviesCardList(props) {
  const {
    filteredMovies,
    setFilteredMovies,
  } = props;

  // 🟢 это нормально что не все пропсы используются.
  // На странице ВСЕХ фильмов нужны не все пропсы
  // Некоторые нужны только для ЛАЙКНУТЫХ - на странице сохраненных.

  return (
    <>
      <div className="moviesCardList">
        {filteredMovies.map((movie) => (
          <MoviesCard
            key={movie.id}
            movie={movie}
            setFilteredMovies={setFilteredMovies}
          />
        ))}
      </div>
      <MoreBtn />
    </>
  );
}

export default MoviesCardList;
