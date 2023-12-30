const clearLocalStorage = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('allMovies');
  localStorage.removeItem('likedMovies');
  localStorage.removeItem('filtered');
  localStorage.removeItem('filteredLiked');
  localStorage.removeItem('queryAll');
  localStorage.removeItem('queryLiked');
  localStorage.removeItem('isShortAll');
  localStorage.removeItem('isShortLiked');
};

export default clearLocalStorage;
