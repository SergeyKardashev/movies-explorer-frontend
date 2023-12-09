import React from 'react';
import './AboutProject.css';

function AboutProject() {
  return (
    <section className="aboutProject">
      <h2 className="aboutProject__title">О проекте</h2>
      <ul className="aboutProject__points">
        <li className="aboutProject__point-item">
          <h3 className="aboutProject__point-subtitle">Дипломный проект включал 5 этапов</h3>
          <p className="aboutProject__point-txt">
            Составление плана, работу над бэкендом, вёрстку,
            добавление функциональности и&nbsp;финальные доработки.
          </p>
        </li>
        <li className="aboutProject__point-item">
          <h3 className="aboutProject__point-subtitle">На выполнение диплома ушло 5 недель</h3>
          <p className="aboutProject__point-txt">
            У&nbsp;каждого этапа был мягкий и&nbsp;жёсткий дедлайн,
            которые нужно было соблюдать, чтобы успешно защититься.
          </p>
        </li>
      </ul>
      {/* <div className="aboutProject__chart">
        <div className="aboutProject__time aboutProject__time_one">1 неделя</div>
        <div className="aboutProject__time aboutProject__time_two">4 недели</div>
        <div className="aboutProject__side">Back-end</div>
        <div className="aboutProject__side">Front-end</div>
      </div> */}

      {/* <ul className="aboutProject__timeline">
        <li className="aboutProject__timeline-item">
          <p className="aboutProject__timeline-week aboutProject__timeline-week_first">1 неделя</p>
          <p className="aboutProject__timeline-task">Back-end</p>
        </li>
        <li className="aboutProject__timeline-item">
          <p className="aboutProject__timeline-week aboutProject__timeline-week_second">4 недели</p>
          <p className="aboutProject__timeline-task">Front-end</p>
        </li>
      </ul> */}

      <ul className="aboutProject__chart">
        <li className="aboutProject__chart-item aboutProject__chart-item_first">
          <p className="aboutProject__chart-week aboutProject__chart-week_first">0 неделя</p>
          <p className="aboutProject__chart-task">Back-end</p>
        </li>
        <li className="aboutProject__chart-item aboutProject__chart-item_second">
          <p className="aboutProject__chart-week aboutProject__chart-week_second">4 недели</p>
          <p className="aboutProject__chart-task">Front-end</p>
        </li>
      </ul>
    </section>
  );
}

export default AboutProject;
