import React, { useState } from 'react';
import './MoviesCard.css';
import { useLocation } from 'react-router-dom';
import LS_KEYS from '../../constants/localStorageKeys';
// import THUMB_BASE_URL from '../../constants/thumbBaseUrl';
import {
  // createUser, updateUser, login, getUser,
  // getMovies,
  saveMovie,
  deleteMovie,
} from '../../utils/MainApi';

function MoviesCard(props) {
  const {
    movie,
    setFilteredMovies,
  } = props;

  const { nameRU, duration, thumbnail } = movie;
  console.log('получил в пропсах объект фильма. ', movie);
  // const IMG_PREFIX = 'https://api.nomoreparties.co/';
  // const LS_KEYS = {
  //   queryAll: 'queryAll',
  //   isShortAll: 'isShortAll',
  //   allMovies: 'allMovies',
  //   likedMovies: 'likedMovies',
  //   filtered: 'filtered',
  // };

  // const thumbUrl = `${THUMB_BASE_URL}${image.formats.thumbnail.url}`;

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
    const raw = localStorage.getItem(LS_KEYS.likedMovies);
    if (raw && raw !== 'undefined' && raw !== 'null') {
      console.log('🍿 есть переменная лайкнутых. Проверил - он трушный и не является строкой от фословых значений, ');
      console.log('🍿 Буду парсить сырую переменную - получу массив');
      const parsedArray = JSON.parse(raw);

      console.log('🍿 Распарсил переменную:', parsedArray);
      console.log('🍿 смотрю есть ли в parsedArray фильм из пропсов');
      const isLiked = parsedArray.some((i) => i.movieId === movie.movieId);

      console.log('🍿 🧾 проверка показала', isLiked);
      return isLiked;
    } if (!raw) {
      console.log('🍿 нет массива лайкнутых. ');
      // если нет массива лайкнутых - вернуть фолс.
      // Это получится автоматоом, тк в после проверок возврат
    }
    return false;
  };

  const [isLiked, setLiked] = useState(checkIfLiked());

  const cardLikeClassName = `card__like ${isLiked ? 'card__like_active' : ''}`;

  const handleLike = () => {
    // если фильм не лайкнутый, я его лайкаю
    if (!isLiked) {
      try {
        //
        // 🔴🟠🟡🟢🔵 добавить проверку на наличие лайкнутого фильма в массиве лайкнутых
        // чтобы не было дубля в массиве. Иначе логика дизлайка сломается

        console.log('🍿 Шлю ⬆️ movie в апишку', movie);
        saveMovie(movie)
          .then((movieGot) => {
            console.log('🍿 получил из апишки фильм', movieGot);

            console.log('🍿 достаю переменную с массивом из ЛС и распарсиваю. ЛИБО СОЗДАЮ.');
            const likedFromLS = JSON.parse(localStorage.getItem(LS_KEYS.likedMovies)) || [];
            console.log('🍿 распарсил массив');

            likedFromLS.push(movieGot);
            console.log('🍿 Запушил киношку из пропсов в локальный массив без отправки в ЛС');

            console.log('🍿 Отправляю локальный массив в хранилище');
            localStorage.setItem(LS_KEYS.likedMovies, JSON.stringify(likedFromLS));
            console.log('🍿 массив в хранилище - его длина: ', JSON.parse(localStorage.getItem(LS_KEYS.likedMovies)).length);

            console.log('🍿 Обновляю стейт isLiked = true, сейчас перерендерится компонент');
            setLiked(true);
          })
          .catch(console.error);
      } catch (error) {
        console.error(error);
      }
    }
    if (isLiked) {
      try {
        // eslint-disable-next-line no-debugger
        debugger;
        let likedArr;
        const raw = localStorage.getItem(LS_KEYS.likedMovies);
        if (raw && raw !== 'undefined' && raw !== 'null') {
          likedArr = JSON.parse(raw) || [];
        }

        const movieToDelete = likedArr.find((i) => i.id === movie.id);
        console.log('🍿 найденный в массиве из ЛС фильм: ', movieToDelete);
        console.log('🍿 _id найденного фильма: ', movieToDelete._id);

        deleteMovie(movieToDelete)
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
    const likedFromLS = JSON.parse(localStorage.getItem(LS_KEYS.likedMovies));

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
        {/* <img src={thumbUrl} className="card__img" alt={`фото фильма ${nameRU}`} /> */}
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
