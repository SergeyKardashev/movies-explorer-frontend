import React, { useState } from 'react';
import './MoviesCard.css';

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

  return (
    <div className="card">
      <div className="card__img-wrap">
        <img src={thumbUrl} className="card__img" alt={`фото фильма ${nameRU}`} />
      </div>
      <div className="card_title-wrap">
        <div className="card__title">{nameRU}</div>
        <button className={cardLikeClassName} onClick={handleLike} type="button" aria-label="кнопка лайка" />
      </div>
      <div className="card__time">{duration}</div>
    </div>
  );
}

export default MoviesCard;
