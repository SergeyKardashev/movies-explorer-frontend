import React from 'react';
import './MoviesCardList.css';
import MoviesCard from '../MoviesCard/MoviesCard';
import MoreBtn from '../MoreBtn/MoreBtn';

function MoviesCardList(props) {
  const {
    filteredMovies,
    setFilteredMovies,
    // likedMovies,
    setLikedMovies,
    // emptyMsg,
  } = props;

  return (
    <>
      {/* {filteredMovies.length === 0 ? `<h1>${emptyMsg}</h1>` : ''} */}
      <div className="moviesCardList">
        {filteredMovies.map((movie) => (
          <MoviesCard
            key={movie.id}
            movie={movie}
            // filteredMovies={filteredMovies}
            setFilteredMovies={setFilteredMovies}
            // likedMovies={likedMovies}
            setLikedMovies={setLikedMovies}
          />
        ))}
      </div>
      <MoreBtn />
    </>
  );
}

export default MoviesCardList;
