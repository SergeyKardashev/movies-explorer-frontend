import React from 'react';
import './AboutMe.css';

function AboutMe() {
  return (
    <section className="about-me">
      <h2 className="about-me__section-heading">Студент</h2>
      <div className="about-me__bio-wrap">
        <div className="about-me__text-column">
          <div className="about-me__text-group-one">
            <h2 className="about-me__name">Сергей</h2>
            <p className="about-me__job">Фронтенд-разработчик, 42 года</p>
            <p className="about-me__background">
              За 20 лет в IT развил уникальный набор навыков в разработке, дизайне,
              исследовании пользовательского опыта и управлении.
              Эти разнообразные опыты позволяют мне эффективно общаться с членами команды,
              адаптируя мой язык к каждой роли — будь то разговор о метриках и KPI с менеджерами
              или обсуждение принципов дизайна с дизайнерами.
            </p>
            <p className="about-me__background">
              Получив диплом инженера, я учил программирование по книгам и курсам, совмещая это с работой.
              Я начал с создания простых веб-сайтов в качестве фрилансера.
              В компании Tele2 я разработал каталог услуг Data Shop и создал более 10 дайджестов для сотрудников.
            </p>
          </div>
          <div className="about-me__text-group-two">
            <a
              className="about-me__github-link"
              href="https://github.com/SergeyKardashev?tab=repositories"
              target="_blank"
              rel="noreferrer"
            >
              Github
            </a>
          </div>
        </div>
        <div className="about-me__ava" />
      </div>
      <h3 className="about-me__portfolio">Портфолио</h3>
      <ul className="about-me__portfolio-list">
        <li className="about-me__portfolio-item">
          <a
            className="about-me__portfolio-link"
            href="https://github.com/SergeyKardashev/how-to-learn"
            target="_blank"
            rel="noreferrer"
          >
            <p className="about-me__portfolio-name">Статичный сайт</p>
            <p className="about-me__portfolio-name about-me__portfolio-arrow">
              ↗
            </p>
          </a>
        </li>
        <li className="about-me__portfolio-item">
          <a
            className="about-me__portfolio-link"
            href="https://sergeykardashev.github.io/russian-travel/"
            target="_blank"
            rel="noreferrer"
          >
            <p className="about-me__portfolio-name">Адаптивный сайт</p>
            <p className="about-me__portfolio-name about-me__portfolio-arrow">
              ↗
            </p>
          </a>
        </li>
        <li className="about-me__portfolio-item">
          <a
            className="about-me__portfolio-link"
            href="https://github.com/SergeyKardashev/react-mesto-api-full-gha"
            target="_blank"
            rel="noreferrer"
          >
            <p className="about-me__portfolio-name">
              Одностраничное приложение
            </p>
            <p className="about-me__portfolio-name about-me__portfolio-arrow">
              ↗
            </p>
          </a>
        </li>
      </ul>
    </section>
  );
}

export default AboutMe;
