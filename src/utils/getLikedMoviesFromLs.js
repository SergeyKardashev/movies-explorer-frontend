import LS_KEYS from '../constants/localStorageKeys';
import getArrayFromLS from './getArrayFromLS';

const getLikedMoviesFromLs = () => getArrayFromLS(LS_KEYS.likedMovies);

export default getLikedMoviesFromLs;
