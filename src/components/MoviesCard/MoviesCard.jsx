import React from 'react';
import './MoviesCard.css';

function MoviesCard(props) {
  const { movie } = props;
  const { nameRU, duration, image } = movie;
  const thumbUrl = `https://api.nomoreparties.co/${image.formats.thumbnail.url}`;

  return (
    <div className="card">
      <div className="card__img-wrap">
        <img src={thumbUrl} className="card__img" alt={`фото фильма ${nameRU}`} />
      </div>
      <div className="card_title-wrap">
        <div className="card__title">{nameRU}</div>
        <div className="card__like" />
      </div>
      <div className="card__time">{duration}</div>
    </div>
  );
}

export default MoviesCard;
