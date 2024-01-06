import React from 'react';
import './MoviesCardList.css';
import MoviesCard from '../MoviesCard/MoviesCard';
import MoreBtn from '../MoreBtn/MoreBtn';

function MoviesCardList(props) {
  const {
    filteredMovies,
    setFilteredMovies,
  } = props;

  // 🔴 проверить передаю ли в список на выдачу функцию установки стейта setFilteredMovies
  // возможно из всех фильмов не передаю, а из сохраненных - передаю.
  console.log('В списке на выдачу пропсы:', props);
  // console.log('В списке на выдачу стейт setFilteredMovies = ', setFilteredMovies);

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
