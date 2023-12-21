import React from 'react';
import './MoreBtn.css';

function MoreBtn(props) {
  const { onMoreClick } = props;
  return (
    <section className="more-section">
      <button
        type="button"
        onClick={onMoreClick}
        className="more-section__more-btn"
      >
        Ещё
      </button>
    </section>

  );
}

export default MoreBtn;
