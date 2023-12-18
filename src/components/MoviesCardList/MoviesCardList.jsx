import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useNavigate, useLocation, NavLink } from 'react-router-dom';
import './MoviesCardList.css';
import MoviesCard from '../MoviesCard/MoviesCard';

function MoviesCardList(props) {
  const { movies } = props;
  // const navigate = useNavigate();
  // const location = useLocation();

  return (
    <div>
      {movies.map((movie) => <MoviesCard key={movie.id} movie={movie} />)}
    </div>
  );
}

export default MoviesCardList;
