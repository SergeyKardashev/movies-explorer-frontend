import THUMB_BASE_URL from '../constants/thumbBaseUrl';

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

export default processMovies;
