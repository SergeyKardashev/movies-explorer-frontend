import React from 'react';
import './AboutMe.css';

function AboutMe() {
  return (
    <section className="about-me">
      <h2 className="about-me__section-heading">Студент</h2>
      <div className="about-me__bio-wrap">
        <div className="about-me__text-column">
          <div className="about-me__text-group-one">
            <h2 className="about-me__name">Виталий</h2>
            <p className="about-me__job">Фронтенд-разработчик, 30 лет</p>
            <p className="about-me__background">
              Я родился и живу в Саратове, закончил факультет экономики СГУ.
              У меня есть жена и дочь. Я люблю слушать музыку, а ещё увлекаюсь бегом.
              Недавно начал кодить. С 2015 года работал в компании «СКБ Контур».
              После того, как прошёл курс по веб-разработке,
              начал заниматься фриланс-заказами и ушёл с постоянной работы.
            </p>
          </div>
          <div className="about-me__text-group-two">
            <p className="about-me__github-link">Github</p>
          </div>
        </div>
        <div className="about-me__ava" aria-label="Моя фотка анфас" />
      </div>
      <h3 className="about-me__portfolio">Портфолио</h3>
      <ul className="about-me__portfolio-list">
        <li className="about-me__portfolio-item">
          <a className="about-me__portfolio-link" href="http://ya.ru" target="_blank" rel="noreferrer">
            <p className="about-me__portfolio-name">Статичный сайт</p>
            <p className="about-me__portfolio-name about-me__portfolio-arrow">↗</p>
          </a>
        </li>
        <li className="about-me__portfolio-item">
          <a className="about-me__portfolio-link" href="http://ya.ru" target="_blank" rel="noreferrer">
            <p className="about-me__portfolio-name">Адаптивный сайт</p>
            <p className="about-me__portfolio-name about-me__portfolio-arrow">↗</p>
          </a>
        </li>
        <li className="about-me__portfolio-item">
          <a className="about-me__portfolio-link" href="http://ya.ru" target="_blank" rel="noreferrer">
            <p className="about-me__portfolio-name">Одностраничное приложение</p>
            <p className="about-me__portfolio-name about-me__portfolio-arrow">↗</p>
          </a>
        </li>
      </ul>
    </section>
  );
}

export default AboutMe;
