import React from 'react';
import './MoviesCardList.css';
import MoviesCard from '../MoviesCard/MoviesCard';
import Preloader from '../Preloader/Preloader';

function MoviesCardList(props) {
  const { movies, isFetching } = props;

  const emptyStateString = 'Ничего не найдено или запрос пустой или содержит лишь пробелы.';

  return (
    <>
      <h1>{movies.length === 0 ? emptyStateString : ''}</h1>
      <section className="moviesCardList">
        {isFetching ? <Preloader /> : ''}
        {movies.map((movie) => (
          <MoviesCard
            key={movie.id}
            movie={movie}
          />
        ))}
      </section>
    </>
  );
}

export default MoviesCardList;
