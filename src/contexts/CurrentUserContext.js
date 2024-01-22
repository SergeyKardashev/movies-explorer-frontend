// для хранения данных о пользователе использовать глобальную стейт-переменную currentUser,
// созданную с помощью createContext;
// в компонент App внедрить контекст через CurrentUserContext.Provider;

import React from 'react';

const CurrentUserContext = React.createContext();

export default CurrentUserContext;
