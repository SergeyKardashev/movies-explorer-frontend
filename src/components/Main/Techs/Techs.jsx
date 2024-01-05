import React from 'react';
import './Techs.css';

function Techs() {
  return (
    <section className="techs">
      <h2 className="techs__title">Технологии</h2>
      <h2 className="techs__article-title">7 технологий</h2>
      <p className="techs__article-txt">На&nbsp;курсе веб-разработки мы&nbsp;освоили технологии, которые применили в&nbsp;дипломном проекте.</p>
      <ul className="techs__tech-list">
        <li className="techs__tech-item">HTML</li>
        <li className="techs__tech-item">CSS</li>
        <li className="techs__tech-item">JS</li>
        <li className="techs__tech-item">React</li>
        <li className="techs__tech-item">Git</li>
        <li className="techs__tech-item">Express.js</li>
        <li className="techs__tech-item">mongoDB</li>
      </ul>
    </section>
  );
}

export default Techs;
