import React, { useState } from 'react';
import './MoviesCard.css';
import { useLocation } from 'react-router-dom';
import LS_KEYS from '../../constants/localStorageKeys';
// import THUMB_BASE_URL from '../../constants/thumbBaseUrl';
import {
  // createUser, updateUser, login, getUser,
  // getMovies,
  saveMovieApi,
  deleteMovieApi,
} from '../../utils/MainApi';

import getLikedMoviesFromLs from '../../utils/getLikedMoviesFromLs';

function MoviesCard(props) {
  const {
    movie,
    setFilteredMovies,
  } = props;

  const { nameRU, duration, thumbnail } = movie;
  // const IMG_PREFIX = 'https://api.nomoreparties.co/'
  // LS_KEYS queryAll,isShortAll, allMovies, likedMovies, filtered
  // thumbUrl = `${THUMB_BASE_URL}${image.formats.thumbnail.url}`

  const hoursNum = Math.floor(duration / 60);
  const minutesNum = duration % 60;
  let durationWithUnits;
  if (hoursNum === 0) {
    durationWithUnits = `${minutesNum}м`;
  } else {
    durationWithUnits = `${hoursNum}ч ${minutesNum}м`;
  }

  //  Проверяю лайкнутый ли фильм - ищу его в массиве лайкнутых в ЛС
  const checkIfLiked = () => {
    const likedMovies = getLikedMoviesFromLs();
    return likedMovies.some((i) => i.movieId === movie.movieId);
  };

  const [isLiked, setLiked] = useState(checkIfLiked());

  const cardLikeClassName = `card__like ${isLiked ? 'card__like_active' : ''}`;

  const handleLike = () => {
    // если фильм не лайкнутый, я его лайкаю
    if (!isLiked) {
      try {
        saveMovieApi(movie)
          .then((movieGot) => {
            const likedFromLS = getLikedMoviesFromLs();
            likedFromLS.push(movieGot);
            localStorage.setItem(LS_KEYS.likedMovies, JSON.stringify(likedFromLS));
            setLiked(true);
          })
          .catch(console.error);
      } catch (error) {
        console.error(error);
      }
    }
    if (isLiked) {
      try {
        const likedArr = getLikedMoviesFromLs();
        const movieToDelete = likedArr.find((i) => i.id === movie.id);
        deleteMovieApi(movieToDelete)
          .then((res) => {
            const reducedLikedArr = likedArr.filter((i) => i._id !== res._id);
            localStorage.setItem(LS_KEYS.likedMovies, JSON.stringify(reducedLikedArr));
            setLiked(false);
          })
          .catch(console.error);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleDelete = (movieToDelete) => {
    const likedFromLS = getLikedMoviesFromLs();

    // Фильтрую массив likedFromLS - удаляю выбранный фильм, не мутируя оригинальный массив
    const filteredLikedMovies = likedFromLS.filter((item) => item.id !== movieToDelete.id);

    // Обновляю ЛС - пишу в него новый (отфильтрованный) массив, а не правлю существующий
    localStorage.setItem(LS_KEYS.likedMovies, JSON.stringify(filteredLikedMovies));

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
        <img src={thumbnail} className="card__img" alt={`фото фильма ${nameRU}`} />
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
