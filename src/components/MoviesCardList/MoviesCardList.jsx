import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useNavigate, useLocation, NavLink } from 'react-router-dom';
import './MoviesCardList.css';
import MoviesCard from '../MoviesCard/MoviesCard';

function MoviesCardList() {
  // const navigate = useNavigate();
  // const location = useLocation();

  const movie = {
    title: 'abcd',
    url: 'https://api.nomoreparties.co/uploads/zagruzhennoe_edcf93eb96.jpeg',
    time: '123456',
  };

  return (
    <div>
      <p>list</p>
      <MoviesCard movie={movie} />
    </div>
  );
}

export default MoviesCardList;
