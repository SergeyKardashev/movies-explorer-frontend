import React, {
  useState,
} from 'react';
import './SearchForm.css';
import ERR_MSG from '../../constants/errorMessages';

function SearchForm(props) {
  const {
    onSubmit,
    query,
    searchFieldRef, // Создаю ниже ref для поля ввода чтоб не прокидывать из предка.
  } = props;

  // // // // //
  //  СТЕЙТЫ  //
  // // // // //

  const [searchError, setSearchError] = useState('');
  const [isEditMode, setIsEditMode] = useState(true);// стейт для блокировки форм при запросах к АПИ

  // // // // // //
  //   ФУНКЦИИ   //
  // // // // // //

  const handleSubmit = async (event) => {
    event.preventDefault(); // Предотвратить стандартную отправку формы
    setIsEditMode(false);
    console.log('Форма заблокирована.');
    // console.log('предварительно блокирую и ожидаю фолс', isEditMode);
    // Проверяю, что searchFieldRef.current существует, прежде чем обращаться к value
    if (searchFieldRef.current) {
      const inputValue = searchFieldRef.current.value;

      if (!inputValue.trim()) { // Если значение (с учетом пробелов) пустое, то...
        setSearchError(ERR_MSG.searchInputOnInvalid); // ... устанавливаю сообщение об ошибке
        setIsEditMode(true);
        console.log('Форма разблокирована и готова к взаимодействию.');
      } else {
        setSearchError(''); // если инпут заполнен - очищаю сообщение об ошибке.
        try {
          await onSubmit(); // Вызываю родительский onSubmit из пропсов чтоб обработать данные
          // Перестал передавать event т.к. preventDefault выполняю тут.
        } catch (error) {
          console.error('ошибка запроса к базе всех фильмов', error);
        } finally {
          setIsEditMode(true);
          console.log('Форма разблокирована и готова к взаимодействию.');
          // console.log('после снимаю блок и ожидаю = тру', isEditMode);
          searchFieldRef.current.focus(); // фокусировка на элемент формы
        }
      }
    } else {
      // Обрабатываем ситуацию, когда searchFieldRef.current недоступен
      console.error('Поле ввода не найдено');
    }
  };

  // // // // //
  //  СТИЛИ   //
  // // // // //

  // Если режим редактирования НЕ активен, то форма заблокирована и кнопка серая.
  const searchBtnClassName = `movies__search-btn ${!isEditMode
    ? 'movies__search-btn_disabled'
    : ''} `;

  return (
    <div className="movies__search">
      <form className="movies__search-form" onSubmit={handleSubmit} noValidate>
        <input
          className="movies__search-input"
          type="text"
          placeholder="Фильм"
          name="movieSearch"
          ref={searchFieldRef} // устанавливаю ссылку на инпут
          defaultValue={localStorage.getItem(`${query}`) || ''}
          onInput={() => setSearchError('')} // Очищаю ОШИБКУ при вводе
          readOnly={!isEditMode}
        />
        <button disabled={!isEditMode} className={searchBtnClassName} type="submit">Найти</button>
      </form>
      <div className="movies__search-input-error">{searchError}</div>

    </div>
  );
}

export default SearchForm;
