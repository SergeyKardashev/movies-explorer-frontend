import THUMB_BASE_URL from '../constants/thumbBaseUrl';
// const thumbUrl = `${THUMB_BASE_URL}${image.formats.thumbnail.url}`;

// функция принимает массив объектов. Форычом проходит по массиву, каждый объект собирает заново.

const processMovies = (moviesArray) => {
  // создаю новый массив из результата работы метода массива map,
  // который как forEach, но возвращает новый массив.
  const processedArray = moviesArray.map(
    (origin) => {
      // собираю объект
      const processedObject = {
        country: origin.country,
        director: origin.director,
        duration: String(origin.duration),
        year: origin.year,
        description: origin.description,
        image: `${THUMB_BASE_URL}${origin.image.url}`,
        trailer: origin.trailerLink,
        nameRU: origin.nameRU,
        nameEN: origin.nameEN,
        thumbnail: `${THUMB_BASE_URL}${origin.image.formats.thumbnail.url}`,
        movieId: origin.id,
      };
      // возвращаю собранный объект
      return processedObject;
    },
  );
  return processedArray;
};

// У функции в целом неявный возврат. И у форыча тоже.
// В форыче работает колбэк с неявным возвратом. Т.е. без фигурных скобок.
// Т.к. он возвращает объект, то вокруг фигурных скобок проставлены круглые.
// Иначе он воспримет фигурные как контейнер для тела функции и будет ожидать возврата из нее.

// В чужой АПИ trailerLink, а в моей - trailer.
// В чужой нет thumbnail, а в моей есть. Взял из movie.image.thumbnail.url
// Owner не передаю с фронта, т.к. он создается на бэке из токена мидлвэром auth
// и пишется в БД owner: req.user._id,
// для отправки фильма изменил карткиночный урл на абсолютный

// const processMovies = (moviesArray) => moviesArray.forEach(
//   (origin) => ({
//     country: origin.country,
//     director: origin.director,
//     duration: String(origin.duration),
//     year: origin.year,
//     description: origin.description,
//     image: `${THUMB_BASE_URL}${origin.image.url}`,
//     trailer: origin.trailerLink,
//     nameRU: origin,
//     nameEN: origin,
//     thumbnail: `${THUMB_BASE_URL}${origin.image.formats.thumbnail.url}`,
//     movieId: origin.id,
//   }),
// );

export default processMovies;
