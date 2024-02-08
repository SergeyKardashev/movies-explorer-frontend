import React, { useState, useContext } from 'react';
import './MoviesCard.css';
import { useLocation } from 'react-router-dom';
import LS_KEYS from '../../constants/localStorageKeys';
import { saveMovieApi, deleteMovieApi } from '../../utils/MainApi';
import getLikedMoviesFromLs from '../../utils/getLikedMoviesFromLs';
import LogOutFunctionContext from '../../contexts/LogOutFunctionContext';

function MoviesCard(props) {
  const {
    movie, updateFilteredMovies,
  } = props;

  const {
    nameRU, duration, thumbnail, trailer,
  } = movie;

  const hoursNum = Math.floor(duration / 60);
  const minutesNum = duration % 60;
  let durationWithUnits;
  if (hoursNum === 0) {
    durationWithUnits = `${minutesNum}м`;
  } else {
    durationWithUnits = `${hoursNum}ч ${minutesNum}м`;
  }

  const logOut = useContext(LogOutFunctionContext);

  //  Проверяю лайкнутый ли фильм - ищу его в массиве лайкнутых в ЛС
  const checkIfLiked = () => {
    const likedMovies = getLikedMoviesFromLs();
    return likedMovies.some((i) => i.movieId === movie.movieId);
  };

  const [isLiked, setLiked] = useState(checkIfLiked());

  const cardLikeClassName = `card__like ${isLiked ? 'card__like_active' : ''}`;

  const handleLike = async () => {
    // если фильм еще не лайкнутый, я его лайкаю
    if (!isLiked) {
      try {
        const LikedMovieFromApi = await saveMovieApi(movie);
        const likedMoviesArrFromLS = getLikedMoviesFromLs();
        likedMoviesArrFromLS.push(LikedMovieFromApi);
        localStorage.setItem(LS_KEYS.likedMovies, JSON.stringify(likedMoviesArrFromLS));
        setLiked(true);
      } catch (error) {
        console.error('обработчик лайка вернул ошибку. status', error.status);
        if (error.status === 401) {
          logOut();
        }
      }
    }

    // если фильм уже лайкнутый, я удаляю его из лайкнутых
    if (isLiked) {
      try {
        const likedArr = getLikedMoviesFromLs();
        const movieToDelete = likedArr.find((i) => i.id === movie.id);
        const deletedMovieFromApi = await deleteMovieApi(movieToDelete);
        const reducedLikedArr = likedArr.filter((i) => i._id !== deletedMovieFromApi._id);
        localStorage.setItem(LS_KEYS.likedMovies, JSON.stringify(reducedLikedArr));
        setLiked(false);
      } catch (error) {
        console.error('обработчик дизлайка вернул ошибку. status', error.status);
        if (error.status === 401) {
          logOut();
        }
      }
    }
  };

  const handleDelete = async (movieToDelete) => {
    try {
      await deleteMovieApi(movieToDelete);

      const likedMovies = getLikedMoviesFromLs();

      // Фильтрую массив likedFromLS - удаляю выбранный фильм, не мутируя оригинальный массив
      const filteredLikedMovies = likedMovies.filter((i) => i.movieId !== movieToDelete.movieId);

      // Обновляю ЛС - пишу в него новый (отфильтрованный) массив, а не правлю существующий
      localStorage.setItem(LS_KEYS.likedMovies, JSON.stringify(filteredLikedMovies));

      // Обновляю стейт фильтрованных чтоб обновить список на странице(а не в ЛС),
      // нужно уведомить родительский комп-т через вызов функции, переданной сюда в пропсах
      updateFilteredMovies(filteredLikedMovies);
    } catch (error) {
      console.error('обработчик дизлайка вернул ошибку. status', error.status);
      if (error.status === 401) {
        logOut();
      }
    }
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
        <a href={trailer} target="_blank" rel="noreferrer">
          <img src={thumbnail} className="card__img" alt={`фото фильма ${nameRU}`} />
        </a>
      </div>
      <div className="card__title-wrap">
        <div className="card__title">{nameRU}</div>
        {/* кнопка */}
        {buttonMarkUp}
      </div>
      <div className="card__time">{durationWithUnits}</div>
    </div>
  );
}

export default MoviesCard;
