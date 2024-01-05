import React from 'react';
import './Promo.css';
import bannerImgPath from '../../../images/banner_img.svg';

function Promo() {
  return (
    <section className="banner">
      <div className="banner__main-wrap">
        <div className="banner__txt-wrap">
          <h1 className="banner__title">Учебный проект студента факультета Веб&#8209;разработки.</h1>
          <p className="banner__subtitle">Листайте ниже, чтобы узнать больше про этот проект и его создателя.</p>
        </div>
        <img className="banner__img" src={bannerImgPath} alt="планета из слов веб" />
      </div>
      <div className="banner__btn-wrap">
        <p className="banner__more-btn">
          <a className="banner__more-btn-link" href="#aboutProject">Узнать больше</a>
        </p>
      </div>
    </section>
  );
}

export default Promo;
