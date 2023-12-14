import React from 'react';
import { useLocation } from 'react-router-dom';

import './Footer.css';

function Footer(props) {
  const { urlWithHeaderFooter } = props;

  const location = useLocation();

  if (!urlWithHeaderFooter.includes(location.pathname)) {
    return null;
  }

  return (
    <section className="footer">
      <h5 className="footer__title">
        Учебный проект Яндекс.Практикум х BeatFilm.
      </h5>
      <div className="footer__law-info">
        <p className="footer__copyright">© 2020</p>
        <nav className="footer__nav">
          <a className="footer__link" href="http://ya.ru" target="_blank" rel="noreferrer">
            Яндекс.Практикум
          </a>
          <a className="footer__link" href="https://github.com/SergeyKardashev?tab=repositories" target="_blank" rel="noreferrer">
            Github
          </a>
        </nav>
      </div>
    </section>
  );
}

export default Footer;
