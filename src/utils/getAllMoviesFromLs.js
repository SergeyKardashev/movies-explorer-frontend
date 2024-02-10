import LS_KEYS from '../constants/localStorageKeys';
import getArrayFromLS from './getArrayFromLS';

const getAllMoviesFromLs = () => getArrayFromLS(LS_KEYS.allMovies);

export default getAllMoviesFromLs;
