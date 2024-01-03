import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NotFound.css';

function NotFound() {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1, { replace: true });
    // navigate('/', { replace: true });
  };
  return (
    <main className="not-found">
      <h1 className="not-found__title">404</h1>
      <p className="not-found__subtitle">Страница не найдена</p>

      <button className="not-found__back-btn" onClick={goBack} type="button">
        Назад
      </button>
    </main>
  );
}

export default NotFound;
