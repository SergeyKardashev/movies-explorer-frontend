import React from 'react';
import './MoviesCard.css';

function MoviesCard(props) {
  const { movie } = props;
  const movieTitle = movie.title;
  const imgUrl = movie.url;
  const movieTime = movie.time;

  return (
    <div className="card">
      <div className="card__img-wrap">
        <img src={imgUrl} className="card__img" alt={`фото фильма ${movieTitle}`} />
      </div>
      <div className="card_title-wrap">
        <div className="card__title">{movieTitle}</div>
        <div className="card__like" />
      </div>
      <div className="card__time">{movieTime}</div>
    </div>
  );
}

export default MoviesCard;
