import React from 'react';
import './MoviesCard.css';

function MoviesCard(props) {
  const { movie } = props;
  const title = movie.nameRU;
  const imgUrl = movie.image.formats.thumbnail.url;
  const movieTime = movie.duration;
  const thumbnailUrl = `https://api.nomoreparties.co/${imgUrl}`;

  return (
    <div className="card">
      <div className="card__img-wrap">
        <img src={thumbnailUrl} className="card__img" alt={`фото фильма ${title}`} />
      </div>
      <div className="card_title-wrap">
        <div className="card__title">{title}</div>
        <div className="card__like" />
      </div>
      <div className="card__time">{movieTime}</div>
    </div>
  );
}

export default MoviesCard;
