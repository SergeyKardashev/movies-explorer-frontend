import React, { useState } from 'react';
import './MoviesCard.css';
import { useLocation } from 'react-router-dom';

function MoviesCard(props) {
  const {
    movie,
    setFilteredMovies,
  } = props;

  const { nameRU, duration, image } = movie;

  const IMG_PREFIX = 'https://api.nomoreparties.co/';
  const LOCAL_STORAGE_KEYS = {
    queryAll: 'queryAll',
    isShortAll: 'isShortAll',
    allMovies: 'allMovies',
    likedMovies: 'likedMovies',
    filtered: 'filtered',
  };

  const thumbUrl = `${IMG_PREFIX}${image.formats.thumbnail.url}`;

  const hoursNum = Math.floor(duration / 60);
  const minutesNum = duration % 60;
  let durationWithUnits;
  if (hoursNum === 0) {
    durationWithUnits = `${minutesNum}м`;
  } else {
    durationWithUnits = `${hoursNum}ч ${minutesNum}м`;
  }

  const checkIsLiked = () => {
    const likedFromLS = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.likedMovies)) || [];
    return likedFromLS.some((item) => item.id === movie.id);
  };
  const [isLiked, setLiked] = useState(checkIsLiked());

  const cardLikeClassName = `card__like ${isLiked ? 'card__like_active' : ''}`;

  const handleLike = () => {
    if (!isLiked) {
      const likedFromLS = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.likedMovies)) || [];
      localStorage.setItem(LOCAL_STORAGE_KEYS.likedMovies, JSON.stringify([...likedFromLS, movie]));
      setLiked(true);
    }
  };

  const handleDelete = (movieToDelete) => {
    const likedFromLS = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.likedMovies));

    // Фильтрую массив likedFromLS - удаляю выбранный фильм, не мутируя оригинальный массив
    const filteredLikedMovies = likedFromLS.filter((item) => item.id !== movieToDelete.id);

    // Обновляю ЛС - пишу в него новый (отфильтрованный) массив, а не правлю существующий
    localStorage.setItem(LOCAL_STORAGE_KEYS.likedMovies, JSON.stringify(filteredLikedMovies));

    // Обновляю стейт фильтрованных чтоб обновить список на странице(а не в ЛС),
    // нужно уведомить родительский компонент через вызов setLikedMovies, переданной сюда в пропсах
    setFilteredMovies(
      (currentLiked) => currentLiked.filter((item) => item.id !== movieToDelete.id),
    );
  };

  const location = useLocation();
  const url = location.pathname;
  let buttonMarkUp;
  if (url === '/movies') {
    buttonMarkUp = <button className={cardLikeClassName} onClick={handleLike} type="button" aria-label="кнопка лайка" />;
  }
  if (url === '/saved-movies') {
    buttonMarkUp = <button className="card__delete" onClick={() => handleDelete(movie)} type="button" aria-label="кнопка удаления" />;
  }

  return (
    <div className="card">
      <div className="card__img-wrap">
        <img src={thumbUrl} className="card__img" alt={`фото фильма ${nameRU}`} />
      </div>
      <div className="card__title-wrap">
        <div className="card__title">{nameRU}</div>
        {buttonMarkUp}
      </div>
      <div className="card__time">{durationWithUnits}</div>
    </div>
  );
}

export default MoviesCard;
