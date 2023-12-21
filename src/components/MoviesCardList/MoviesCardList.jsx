import React from 'react';
import './MoviesCardList.css';
import MoviesCard from '../MoviesCard/MoviesCard';
import Preloader from '../Preloader/Preloader';
import MoreBtn from '../MoreBtn/MoreBtn';

function MoviesCardList(props) {
  const { movies, isFetching, emptyMsg } = props;

  return (
    <>
      <h1>{movies.length === 0 ? emptyMsg : ''}</h1>
      <section className="moviesCardList">
        {isFetching ? <Preloader /> : ''}
        {movies.map((movie) => (
          <MoviesCard
            key={movie.id}
            movie={movie}
          />
        ))}
      </section>
      <MoreBtn />
    </>
  );
}

export default MoviesCardList;
