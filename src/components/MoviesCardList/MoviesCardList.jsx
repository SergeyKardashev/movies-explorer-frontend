import React from 'react';
import './MoviesCardList.css';
import MoviesCard from '../MoviesCard/MoviesCard';
import Preloader from '../Preloader/Preloader';
import MoreBtn from '../MoreBtn/MoreBtn';

function MoviesCardList(props) {
  const { movies, isFetching, emptyMsg } = props;

  return (
    <>
      {movies.length === 0 ? `<h1>${emptyMsg}</h1>` : ''}
      <div className="moviesCardList">
        {isFetching ? <Preloader /> : ''}
        {movies.map((movie) => (
          <MoviesCard
            key={movie.id}
            movie={movie}
          />
        ))}
      </div>
      <MoreBtn />
    </>
  );
}

export default MoviesCardList;
