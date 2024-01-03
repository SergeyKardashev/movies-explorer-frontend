import React from 'react';
import './MoviesCardList.css';
import MoviesCard from '../MoviesCard/MoviesCard';
import MoreBtn from '../MoreBtn/MoreBtn';

function MoviesCardList(props) {
  const {
    filteredMovies,
    setFilteredMovies,
  } = props;

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
