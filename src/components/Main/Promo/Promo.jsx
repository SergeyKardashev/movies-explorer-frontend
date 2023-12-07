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
        <button className="banner__btn" type="button">Узнать больше</button>
      </div>
    </section>
  );
}

export default Promo;
