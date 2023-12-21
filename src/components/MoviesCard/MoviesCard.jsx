import React, { useState } from 'react';
import './MoviesCard.css';
import { useLocation } from 'react-router-dom';

function MoviesCard(props) {
  const { movie } = props;
  const { nameRU, duration, image } = movie;
  const thumbUrl = `https://api.nomoreparties.co/${image.formats.thumbnail.url}`;

  const checkIsLiked = () => {
    const likedFromLS = JSON.parse(localStorage.getItem('likedMovies')) || [];
    return likedFromLS.some((item) => item.id === movie.id);
  };
  const [isLiked, setLiked] = useState(checkIsLiked());

  const cardLikeClassName = `card__like ${isLiked ? 'card__like_active' : ''}`;

  const handleLike = () => {
    if (!isLiked) {
      const likedFromLS = JSON.parse(localStorage.getItem('likedMovies')) || [];
      localStorage.setItem('likedMovies', JSON.stringify([...likedFromLS, movie]));
      setLiked(true);
    }
  };

  const handleDelete = () => {
    const likedFromLS = JSON.parse(localStorage.getItem('likedMovies'));
    const likedAfterDelete = likedFromLS.pop(movie);
    localStorage.setItem('likedMovies', JSON.stringify(likedAfterDelete));
  };

  const location = useLocation();
  const url = location.pathname;
  if (url === '/saved-movies') {
    return 'saved-movies';
  }

  return (
    <div className="card">
      <div className="card__img-wrap">
        <img src={thumbUrl} className="card__img" alt={`фото фильма ${nameRU}`} />
      </div>
      <div className="card_title-wrap">
        <div className="card__title">{nameRU}</div>
        <button className={cardLikeClassName} onClick={handleLike} type="button" aria-label="кнопка лайка" />
        <button className="card__delete" onClick={handleDelete} type="button" aria-label="кнопка удаления" />
      </div>
      <div className="card__time">{duration}</div>
    </div>
  );
}

export default MoviesCard;
